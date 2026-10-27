"use client";

import Link from "next/link";
import { stashDish, useSaved } from "@/lib/client";

// Food journal: dishes saved from the dish view.
export default function SavedPage() {
  const [saved, setSaved] = useSaved();

  const setNote = (name: string, note: string) =>
    setSaved(saved.map((s) => (s.profile.name === name ? { ...s, note } : s)));

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">My food journal</h1>
        <p className="text-stone-600">Dishes you&apos;ve saved, with your own notes.</p>
      </section>

      {saved.length === 0 ? (
        <p className="text-stone-500">
          Nothing saved yet. <Link href="/" className="underline">Decode a dish</Link> and tap &ldquo;Save to journal&rdquo;.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {saved.map(({ profile, savedAt, note }) => (
            <li key={profile.name} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-stone-500">
                    {profile.origin.country} · saved {new Date(savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSaved(saved.filter((s) => s.profile.name !== profile.name))}
                  className="text-sm text-stone-400 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-stone-700">{profile.description}</p>
              <textarea
                defaultValue={note}
                onBlur={(e) => setNote(profile.name, e.target.value)}
                rows={2}
                placeholder="Where you ate it, what you thought…"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              />
              <Link href="/dish" onClick={() => stashDish(profile)} className="text-sm text-orange-700 underline">
                Open →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
