"use client";

import { useEffect, useState } from "react";
import { capitalize, dietLabel, usePrefs } from "@/lib/client";
import { ALLERGENS, DIETS, type Prefs } from "@/lib/schemas";

// Taste profile used by the allergen checker, menu picks, pairings and recipe swaps.
export default function ProfilePage() {
  const [stored, save] = usePrefs();
  const [prefs, setPrefs] = useState<Prefs>(stored);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  useEffect(() => setPrefs(stored), [stored]);

  const toggle = <K extends "allergens" | "diets">(key: K, value: Prefs[K][number]) => {
    const list = prefs[key] as string[];
    setPrefs({ ...prefs, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const chip = (on: boolean) =>
    `rounded-full px-3 py-1.5 text-sm border ${on ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-stone-300"}`;

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        save(prefs);
        setSavedAt(Date.now());
      }}
    >
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">My tastes</h1>
        <p className="text-stone-600">
          Used to flag allergens, pick menu dishes for you, suggest pairings and adapt recipes. Stored only in this browser.
        </p>
      </section>

      <fieldset className="space-y-3">
        <legend className="font-semibold mb-2">Allergies</legend>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => (
            <button type="button" key={a} onClick={() => toggle("allergens", a)} className={chip(prefs.allergens.includes(a))}>
              {capitalize(a)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-semibold mb-2">Diets</legend>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <button type="button" key={d} onClick={() => toggle("diets", d)} className={chip(prefs.diets.includes(d))}>
              {capitalize(dietLabel(d))}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="font-semibold">Flavors I love</span>
          <input
            value={prefs.likes}
            onChange={(e) => setPrefs({ ...prefs, likes: e.target.value })}
            placeholder="e.g. spicy, sour, noodles, seafood"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold">Things I avoid</span>
          <input
            value={prefs.dislikes}
            onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
            placeholder="e.g. coriander, offal, very sweet"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
          />
        </label>
        <label className="space-y-1">
          <span className="font-semibold">Country I cook in</span>
          <input
            value={prefs.homeCountry}
            onChange={(e) => setPrefs({ ...prefs, homeCountry: e.target.value })}
            placeholder="e.g. India"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
          />
          <span className="text-xs text-stone-500">Used to suggest ingredient swaps you can actually buy.</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white">Save</button>
        {savedAt && <span className="text-sm text-green-700">Saved</span>}
      </div>
    </form>
  );
}
