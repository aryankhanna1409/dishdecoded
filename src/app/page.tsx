"use client";

import { useEffect, useState } from "react";
import DishView from "@/components/DishView";
import ImagePicker from "@/components/ImagePicker";
import { DemoBanner, ErrorNote, Spinner } from "@/components/Status";
import { api, fileToImage } from "@/lib/client";
import type { DishProfile } from "@/lib/schemas";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [dish, setDish] = useState<DishProfile | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decode(input: { file?: File | null; text?: string }) {
    setLoading(true);
    setError(null);
    try {
      const image = input.file ? await fileToImage(input.file) : undefined;
      const r = await api<DishProfile>("/api/identify", { image, text: input.text });
      if (!r.result.recognized) {
        setError("That doesn't look like a dish. Try another photo or type its name.");
        setDish(null);
      } else {
        setDish(r.result);
        setDemo(r.demo);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Other pages link here with ?q=<dish name>.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) lookup(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = (name: string) => {
    setFile(null);
    setText(name);
    decode({ text: name });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">What am I eating?</h1>
        <p className="text-stone-600">
          Snap or upload a photo of a dish, or type its name. You&apos;ll get its name, origin, pronunciation, likely
          allergens, flavor, story and a home recipe.
        </p>
      </section>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          decode({ file, text });
        }}
      >
        <ImagePicker file={file} onChange={setFile} label="Take or upload a photo of a dish" />
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={file ? "Anything to add? (optional)" : "…or type a dish, e.g. khao soi"}
            className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
          />
          <button
            disabled={loading || (!file && !text.trim())}
            className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white disabled:opacity-40"
          >
            Decode
          </button>
        </div>
      </form>

      <DemoBanner show={demo} />
      <ErrorNote message={error} />
      {loading && <Spinner label="Looking at your dish…" />}
      {dish && !loading && <DishView dish={dish} onLookup={lookup} />}
    </div>
  );
}
