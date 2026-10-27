"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_PREFS, type Allergen, type DishProfile, type ImageInput, type Prefs } from "./schemas";

// ---- Local storage (this is a single-user portfolio app, so no backend accounts) ----

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(`dd:${key}`));
  } catch {
    // Storage may be unavailable (private mode); the app still works without it.
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const sync = () => setValue(read(key, fallback));
    sync();
    window.addEventListener(`dd:${key}`, sync);
    return () => window.removeEventListener(`dd:${key}`, sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = useCallback((next: T) => write(key, next), [key]);
  return [value, update] as const;
}

export const usePrefs = () => useStored<Prefs>("prefs", EMPTY_PREFS);

export type SavedDish = { profile: DishProfile; savedAt: string; note: string };
export const useSaved = () => useStored<SavedDish[]>("saved", []);

export function getPrefs(): Prefs {
  return read("prefs", EMPTY_PREFS);
}

// Hands a dish profile from one page to another (e.g. Saved -> dish view).
export function stashDish(profile: DishProfile) {
  try {
    sessionStorage.setItem("dd:dish", JSON.stringify(profile));
  } catch {}
}
export function takeStashedDish(): DishProfile | null {
  try {
    const raw = sessionStorage.getItem("dd:dish");
    return raw ? (JSON.parse(raw) as DishProfile) : null;
  } catch {
    return null;
  }
}

// ---- API ----

export type ApiResult<T> = { demo: boolean; result: T };

export async function api<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({ error: "Unexpected response from the server." }));
  if (!res.ok) throw new Error(json.error ?? "Request failed.");
  return json as ApiResult<T>;
}

// ---- Images: shrink before upload to keep requests fast ----

export async function fileToImage(file: File, maxSide = 1568): Promise<ImageInput> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { data: dataUrl.split(",")[1], mediaType: "image/jpeg" };
}

// ---- Feature 3: allergen and diet checker (deterministic, runs in the browser) ----

export type Warning = { label: string; level: "high" | "medium" };

export function checkDish(profile: DishProfile, prefs: Prefs): Warning[] {
  const warnings: Warning[] = [];
  for (const a of profile.allergens) {
    if (prefs.allergens.includes(a.allergen)) {
      warnings.push({
        label: `${a.likelihood === "possible" ? "May contain" : "Contains"} ${a.allergen}`,
        level: a.likelihood === "possible" ? "medium" : "high",
      });
    }
  }
  for (const d of prefs.diets) {
    const fit = profile.diet[d];
    if (fit === "no") warnings.push({ label: `Not ${dietLabel(d)}`, level: "high" });
    if (fit === "depends") warnings.push({ label: `${capitalize(dietLabel(d))} only in some versions`, level: "medium" });
  }
  return warnings;
}

export function menuConflicts(allergens: Allergen[], vegetarian: boolean, vegan: boolean, prefs: Prefs): string[] {
  const out = allergens.filter((a) => prefs.allergens.includes(a)).map((a) => `Likely contains ${a}`);
  if (prefs.diets.includes("vegan") && !vegan) out.push("Not vegan");
  else if (prefs.diets.includes("vegetarian") && !vegetarian) out.push("Not vegetarian");
  return out;
}

export const dietLabel = (d: string) => d.replace("_", "-");
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
