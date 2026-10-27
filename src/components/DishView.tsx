"use client";

import { useEffect, useState } from "react";
import FlavorRadar from "./FlavorRadar";
import { ErrorNote, Spinner } from "./Status";
import { api, capitalize, checkDish, dietLabel, usePrefs, useSaved } from "@/lib/client";
import { DIETS, type Culture, type DetailKind, type DishProfile, type Pairings, type Recipe } from "@/lib/schemas";

const TABS: { kind: DetailKind; label: string }[] = [
  { kind: "pairings", label: "Pairings" },
  { kind: "culture", label: "Story" },
  { kind: "recipe", label: "Make it at home" },
];

export default function DishView({ dish, onLookup }: { dish: DishProfile; onLookup?: (name: string) => void }) {
  const [prefs] = usePrefs();
  const [saved, setSaved] = useSaved();
  const isSaved = saved.some((s) => s.profile.name === dish.name);
  const warnings = checkDish(dish, prefs);
  const hasPrefs = prefs.allergens.length > 0 || prefs.diets.length > 0;

  const toggleSave = () =>
    setSaved(
      isSaved
        ? saved.filter((s) => s.profile.name !== dish.name)
        : [{ profile: dish, savedAt: new Date().toISOString(), note: "" }, ...saved],
    );

  const speak = () => {
    const u = new SpeechSynthesisUtterance(dish.native_name ?? dish.name);
    u.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  return (
    <article className="space-y-6">
      {/* Feature 1: identifier */}
      <section className="rounded-2xl bg-white border border-stone-200 p-6 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{dish.name}</h2>
            {dish.native_name && <p className="text-lg text-stone-500">{dish.native_name}</p>}
          </div>
          <button
            onClick={toggleSave}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              isSaved ? "bg-orange-600 text-white" : "border border-stone-300 hover:bg-stone-50"
            }`}
          >
            {isSaved ? "Saved ✓" : "Save to journal"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button onClick={speak} className="rounded-full bg-stone-100 px-3 py-1 hover:bg-stone-200" title="Hear it">
            🔊 {dish.pronunciation}
          </button>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            {dish.origin.region ? `${dish.origin.region}, ` : ""}
            {dish.origin.country}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{dish.cuisine}</span>
          <span className="text-stone-500">{Math.round(dish.confidence * 100)}% sure</span>
        </div>
        <p className="text-stone-700 leading-relaxed">{dish.description}</p>
        {dish.alternatives.length > 0 && (
          <p className="text-sm text-stone-500">
            Could also be:{" "}
            {dish.alternatives.map((a, i) => (
              <span key={a}>
                {i > 0 && ", "}
                {onLookup ? (
                  <button onClick={() => onLookup(a)} className="underline hover:text-orange-700">
                    {a}
                  </button>
                ) : (
                  a
                )}
              </span>
            ))}
          </p>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Feature 3: allergen and diet checker */}
        <section className="rounded-2xl bg-white border border-stone-200 p-6 space-y-3">
          <h3 className="font-semibold">Allergens and diets</h3>
          {hasPrefs ? (
            warnings.length ? (
              <ul className="space-y-1">
                {warnings.map((w) => (
                  <li
                    key={w.label}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      w.level === "high" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    ⚠ {w.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-green-50 px-3 py-1.5 text-sm text-green-800">
                No conflicts found with your allergies or diets.
              </p>
            )
          ) : (
            <p className="text-sm text-stone-500">
              Set your allergies and diets in <a href="/profile" className="underline">My tastes</a> to get personal warnings.
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {dish.allergens.map((a) => (
              <span key={a.allergen} className="rounded-full border border-stone-200 px-2.5 py-0.5 text-xs">
                {a.allergen}
                {a.likelihood === "possible" ? "?" : ""}
              </span>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {DIETS.map((d) => (
              <div key={d} className="flex justify-between border-b border-stone-100 py-0.5">
                <dt className="text-stone-600">{capitalize(dietLabel(d))}</dt>
                <dd
                  className={
                    dish.diet[d] === "yes" ? "text-green-700" : dish.diet[d] === "no" ? "text-red-700" : "text-amber-700"
                  }
                >
                  {dish.diet[d]}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-stone-400">
            Estimated from a typical recipe. Recipes vary, so always check with staff if you have a serious allergy.
          </p>
        </section>

        {/* Feature 5: flavor profile */}
        <section className="rounded-2xl bg-white border border-stone-200 p-6 space-y-3">
          <h3 className="font-semibold">Flavor and ingredients</h3>
          <div className="flex justify-center">
            <FlavorRadar flavor={dish.flavor} />
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((i) => (
              <li
                key={i.name}
                className={`rounded-full px-2.5 py-0.5 text-xs ${
                  i.likelihood === "certain" ? "bg-orange-100 text-orange-900" : "bg-stone-100 text-stone-600"
                }`}
              >
                {i.name}
                {i.likelihood === "possible" ? "?" : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <DetailTabs dish={dish.name} onLookup={onLookup} />
    </article>
  );
}

// Features 2, 5 and 6: details generated on demand and cached on the server.
function DetailTabs({ dish, onLookup }: { dish: string; onLookup?: (name: string) => void }) {
  const [prefs] = usePrefs();
  const [tab, setTab] = useState<DetailKind>("pairings");
  const [data, setData] = useState<Partial<Record<DetailKind, unknown>>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setData({}), [dish]);

  useEffect(() => {
    if (data[tab]) return;
    let cancelled = false;
    setError(null);
    api(`/api/details`, { kind: tab, dish, prefs })
      .then((r) => !cancelled && setData((d) => ({ ...d, [tab]: r.result })))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, dish]);

  const current = data[tab];
  return (
    <section className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4">
      <div className="flex gap-1 border-b border-stone-200">
        {TABS.map((t) => (
          <button
            key={t.kind}
            onClick={() => setTab(t.kind)}
            className={`px-4 py-2 text-sm -mb-px border-b-2 ${
              tab === t.kind ? "border-orange-600 text-orange-800 font-medium" : "border-transparent text-stone-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ErrorNote message={error} />
      {!current && !error && <Spinner label="Decoding…" />}
      {current && tab === "pairings" ? <PairingsView p={current as Pairings} onLookup={onLookup} /> : null}
      {current && tab === "culture" ? <CultureView c={current as Culture} onLookup={onLookup} /> : null}
      {current && tab === "recipe" ? <RecipeView r={current as Recipe} /> : null}
    </section>
  );
}

function PairingsView({ p, onLookup }: { p: Pairings; onLookup?: (name: string) => void }) {
  const List = ({ title, items }: { title: string; items: { name: string; why: string }[] }) => (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.name} className="text-sm">
            <span className="font-medium">{i.name}</span>
            <span className="text-stone-600"> · {i.why}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <List title="Drinks" items={p.drinks} />
      <List title="Sides" items={p.sides} />
      <div>
        <h4 className="font-medium mb-2">If you liked this, try</h4>
        <ul className="space-y-2">
          {p.similar_dishes.map((s) => (
            <li key={s.name} className="text-sm">
              <button onClick={() => onLookup?.(s.name)} className="font-medium underline hover:text-orange-700">
                {s.name}
              </button>
              <span className="text-stone-500"> ({s.origin})</span>
              <span className="text-stone-600"> · {s.why}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CultureView({ c, onLookup }: { c: Culture; onLookup?: (name: string) => void }) {
  return (
    <div className="space-y-4 text-stone-700 leading-relaxed">
      {c.history.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      <div>
        <h4 className="font-medium text-stone-900 mb-2">Regional variations</h4>
        <ul className="space-y-1 text-sm">
          {c.regional_variations.map((v) => (
            <li key={v.region}>
              <span className="font-medium">{v.region}:</span> {v.difference}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm">
        <span className="font-medium">How to eat it:</span> {c.how_to_eat}
      </p>
      <p className="rounded-lg bg-orange-50 px-4 py-3 text-sm">💡 {c.fun_fact}</p>
      {c.related_dishes.length > 0 && (
        <p className="text-sm">
          Related:{" "}
          {c.related_dishes.map((d, i) => (
            <span key={d}>
              {i > 0 && ", "}
              <button onClick={() => onLookup?.(d)} className="underline hover:text-orange-700">
                {d}
              </button>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function RecipeView({ r }: { r: Recipe }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">
        Serves {r.servings} · {r.total_minutes} min · {r.difficulty}
      </p>
      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <div>
          <h4 className="font-medium mb-2">Ingredients</h4>
          <ul className="space-y-1.5 text-sm">
            {r.ingredients.map((i) => (
              <li key={i.item}>
                <span className="font-medium">{i.amount}</span> {i.item}
                {i.swap && <span className="block text-xs text-stone-500">Swap: {i.swap}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Steps</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-stone-700">
            {r.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {r.tips.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-stone-600">
              {r.tips.map((t, i) => (
                <li key={i}>💡 {t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
