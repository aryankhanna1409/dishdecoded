import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaContentBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type * as z from "zod/v4";
import type { ImageInput, Prefs } from "./schemas";

const MODEL = "claude-opus-5-5";

const SYSTEM = `You are DishDecoded, a food expert who knows dishes from every cuisine.
You explain food to curious eaters and travellers in plain, friendly English.
Be honest about uncertainty: mark ingredients and allergens as "possible" when a dish varies by cook, and never claim a dish is safe for an allergy.`;

export class EngineError extends Error {
  constructor(message: string, readonly status = 500) {
    super(message);
  }
}

export const hasApiKey = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

// Simple in-memory cache so repeat lookups of the same dish are instant and free.
const cache = new Map<string, unknown>();
const MAX_CACHE = 500;

export async function decode<S extends z.ZodType>(opts: {
  schema: S;
  prompt: string;
  image?: ImageInput;
  cacheKey?: string;
}): Promise<z.infer<S>> {
  if (opts.cacheKey && cache.has(opts.cacheKey)) return cache.get(opts.cacheKey) as z.infer<S>;

  const content: BetaContentBlockParam[] = [];
  if (opts.image) {
    content.push({ type: "image", source: { type: "base64", media_type: opts.image.mediaType, data: opts.image.data } });
  }
  content.push({ type: "text", text: opts.prompt });

  let response;
  try {
    response = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content }],
      output_config: { effort: "low", format: betaZodOutputFormat(opts.schema) },
      // Retry on another model automatically if a safety classifier declines.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) throw new EngineError("Too many requests right now. Try again in a minute.", 429);
    if (err instanceof Anthropic.AuthenticationError) throw new EngineError("The Anthropic API key is missing or invalid.", 500);
    if (err instanceof Anthropic.BadRequestError) throw new EngineError("That input could not be processed. Try a smaller or clearer photo.", 400);
    if (err instanceof Anthropic.APIError) throw new EngineError("The food engine is unavailable. Try again shortly.", 502);
    throw err;
  }

  if (response.stop_reason === "refusal") throw new EngineError("That request was declined. Try a different photo or description.", 422);
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    throw new EngineError("The answer came back incomplete. Please try again.", 502);
  }

  const result = response.parsed_output as z.infer<S>;
  if (opts.cacheKey) {
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
    cache.set(opts.cacheKey, result);
  }
  return result;
}

export function describePrefs(prefs: Prefs | undefined): string {
  if (!prefs) return "The diner has not shared any preferences.";
  const lines = [
    prefs.allergens.length ? `Allergies: ${prefs.allergens.join(", ")}.` : "",
    prefs.diets.length ? `Diets: ${prefs.diets.join(", ").replaceAll("_", "-")}.` : "",
    prefs.likes ? `Likes: ${prefs.likes}.` : "",
    prefs.dislikes ? `Dislikes: ${prefs.dislikes}.` : "",
    prefs.homeCountry ? `Lives in: ${prefs.homeCountry}.` : "",
  ].filter(Boolean);
  return lines.length ? `About the diner:\n${lines.join("\n")}` : "The diner has not shared any preferences.";
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
