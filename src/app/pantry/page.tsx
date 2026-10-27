"use client";

import { useState } from "react";
import ImagePicker from "@/components/ImagePicker";
import { DemoBanner, ErrorNote, Spinner } from "@/components/Status";
import { api, fileToImage, getPrefs } from "@/lib/client";
import type { PantryResult } from "@/lib/schemas";

// Feature 7: cook it with what I have.
export default function PantryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<PantryResult | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function suggest() {
    setLoading(true);
    setError(null);
    try {
      const image = file ? await fileToImage(file) : undefined;
      const r = await api<PantryResult>("/api/pantry", { image, ingredients, prefs: getPrefs() });
      setResult(r.result);
      setDemo(r.demo);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">What can I cook tonight?</h1>
        <p className="text-stone-600">
          List what&apos;s in your fridge, or snap a photo of it. You&apos;ll get dishes from around the world you can make
          now, and what (if anything) you&apos;d need to pick up.
        </p>
      </section>

      <div className="space-y-3">
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          placeholder="e.g. eggs, rice, spring onions, soy sauce, frozen peas"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
        />
        <ImagePicker file={file} onChange={setFile} label="Or add a photo of your fridge" />
        <button
          onClick={suggest}
          disabled={loading || (!file && !ingredients.trim())}
          className="w-full rounded-xl bg-orange-600 px-6 py-3 font-medium text-white disabled:opacity-40"
        >
          Find dishes
        </button>
      </div>

      <DemoBanner show={demo} />
      <ErrorNote message={error} />
      {loading && <Spinner label="Checking your pantry…" />}

      {result && !loading && (
        <section className="space-y-4">
          {result.detected_ingredients.length > 0 && (
            <p className="text-sm text-stone-600">Working with: {result.detected_ingredients.join(", ")}</p>
          )}
          <ul className="grid gap-4 md:grid-cols-2">
            {result.dishes.map((d) => (
              <li key={d.name} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  <span className="text-sm text-stone-500 whitespace-nowrap">
                    {d.minutes} min · {d.difficulty}
                  </span>
                </div>
                <p className="text-sm text-stone-500">{d.origin}</p>
                <p className="text-stone-700">{d.description}</p>
                <p className={`text-sm ${d.missing.length ? "text-amber-800" : "text-green-700"}`}>
                  {d.missing.length ? `You'll need: ${d.missing.join(", ")}` : "You have everything."}
                </p>
                <a href={`/?q=${encodeURIComponent(d.name)}`} className="inline-block text-sm text-orange-700 underline">
                  Recipe and story →
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
