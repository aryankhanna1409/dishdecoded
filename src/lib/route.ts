import "server-only";
import { NextResponse } from "next/server";
import { EngineError, hasApiKey } from "./engine";
import type { ImageInput } from "./schemas";

const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_CHARS = 7_000_000; // ~5 MB of base64

export function parseImage(raw: unknown): ImageInput | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const { data, mediaType } = raw as Record<string, unknown>;
  if (typeof data !== "string" || typeof mediaType !== "string" || !MEDIA_TYPES.includes(mediaType)) {
    throw new EngineError("Unsupported image. Use a JPEG, PNG or WebP photo.", 400);
  }
  if (data.length > MAX_IMAGE_CHARS) throw new EngineError("That photo is too large.", 413);
  return { data, mediaType: mediaType as ImageInput["mediaType"] };
}

// Wraps a route handler: returns demo data when no API key is configured,
// and turns EngineErrors into JSON error responses.
export async function handle<T>(run: () => Promise<T>, demo: () => T) {
  try {
    if (!hasApiKey()) return NextResponse.json({ demo: true, result: demo() });
    return NextResponse.json({ demo: false, result: await run() });
  } catch (err) {
    if (err instanceof EngineError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
