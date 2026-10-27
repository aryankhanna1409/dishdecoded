"use client";

import { useEffect, useMemo, useRef } from "react";

export default function ImagePicker({
  file,
  onChange,
  label,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  label: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Selected photo" className="w-full max-h-72 object-cover rounded-xl border border-stone-200" />
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (input.current) input.current.value = "";
            }}
            className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm shadow"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-stone-300 bg-white py-10 text-stone-500 hover:border-orange-400 hover:text-orange-700"
        >
          <span className="block text-3xl mb-1" aria-hidden>📷</span>
          {label}
        </button>
      )}
    </div>
  );
}
