"use client";

import { useState } from "react";
import ImagePicker from "@/components/ImagePicker";
import { DemoBanner, ErrorNote, Spinner } from "@/components/Status";
import { api, fileToImage, getPrefs, menuConflicts, usePrefs } from "@/lib/client";
import type { MenuItem, MenuResult } from "@/lib/schemas";

// Feature 4: menu decoder.
export default function MenuPage() {
  const [prefs] = usePrefs();
  const [file, setFile] = useState<File | null>(null);
  const [menu, setMenu] = useState<MenuResult | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"menu" | "match">("match");

  async function decode() {
    setLoading(true);
    setError(null);
    setMenu(null);
    try {
      const image = file ? await fileToImage(file, 2000) : undefined;
      const r = await api<MenuResult>("/api/menu", { image, prefs: getPrefs() });
      if (!r.result.readable) setError("I couldn't read a menu in that photo. Try a closer, straighter shot.");
      else setMenu(r.result);
      setDemo(r.demo);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const items = menu
    ? sort === "match"
      ? [...menu.items].sort((a, b) => b.match_score - a.match_score)
      : menu.items
    : [];
  const topPicks = new Set(
    [...(menu?.items ?? [])]
      .filter((i) => menuConflicts(i.allergens, i.vegetarian, i.vegan, prefs).length === 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3)
      .map((i) => i.original_name),
  );

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Decode a menu</h1>
        <p className="text-stone-600">
          Photograph a menu in any language. Every dish gets a plain-English explanation, allergen flags and a match score
          based on <a href="/profile" className="underline">your tastes</a>.
        </p>
      </section>

      <div className="space-y-3">
        <ImagePicker file={file} onChange={setFile} label="Take or upload a photo of a menu" />
        <button
          onClick={decode}
          disabled={loading || !file}
          className="w-full rounded-xl bg-orange-600 px-6 py-3 font-medium text-white disabled:opacity-40"
        >
          Decode menu
        </button>
      </div>

      <DemoBanner show={demo} />
      <ErrorNote message={error} />
      {loading && <Spinner label="Reading the menu… this can take up to a minute for long menus." />}

      {menu && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-stone-600">
              {menu.items.length} dishes · {menu.cuisine} · written in {menu.language}
            </p>
            <div className="flex gap-1 text-sm">
              {(["match", "menu"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`rounded-full px-3 py-1 ${sort === s ? "bg-stone-800 text-white" : "bg-stone-100"}`}
                >
                  {s === "match" ? "Best for me" : "Menu order"}
                </button>
              ))}
            </div>
          </div>
          <ul className="space-y-3">
            {items.map((item) => (
              <MenuCard key={item.original_name} item={item} pick={topPicks.has(item.original_name)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function MenuCard({ item, pick }: { item: MenuItem; pick: boolean }) {
  const [prefs] = usePrefs();
  const conflicts = menuConflicts(item.allergens, item.vegetarian, item.vegan, prefs);
  return (
    <li className={`rounded-2xl border bg-white p-5 space-y-2 ${pick ? "border-orange-400" : "border-stone-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {pick && <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Top pick for you</span>}
          <h3 className="text-lg font-semibold">{item.translated_name}</h3>
          <p className="text-sm text-stone-500">
            {item.original_name}
            {item.section ? ` · ${item.section}` : ""}
          </p>
        </div>
        <div className="text-right">
          {item.price && <p className="font-medium">{item.price}</p>}
          <p className="text-sm text-stone-500">Match {item.match_score}/10</p>
        </div>
      </div>
      <p className="text-stone-700">{item.description}</p>
      <p className="text-sm text-stone-500 italic">{item.match_reason}</p>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {conflicts.map((c) => (
          <span key={c} className="rounded-full bg-red-50 px-2.5 py-0.5 text-red-800">
            ⚠ {c}
          </span>
        ))}
        {item.vegan ? (
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-green-800">Vegan</span>
        ) : item.vegetarian ? (
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-green-800">Vegetarian</span>
        ) : null}
        {item.spice > 0 && <span className="rounded-full bg-stone-100 px-2.5 py-0.5">{"🌶".repeat(Math.min(item.spice, 5))}</span>}
        {item.main_ingredients.map((i) => (
          <span key={i} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-stone-600">
            {i}
          </span>
        ))}
        <a href={`/?q=${encodeURIComponent(item.translated_name)}`} className="ml-auto text-orange-700 underline">
          Full profile →
        </a>
      </div>
    </li>
  );
}
