import { decode, describePrefs, EngineError } from "@/lib/engine";
import { demoPantry } from "@/lib/demo";
import { handle, parseImage } from "@/lib/route";
import { PantryResult, type Prefs } from "@/lib/schemas";

export const maxDuration = 60;

// Feature 7: cook it with what I have.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return handle(
    async () => {
      const image = parseImage(body.image);
      const list = typeof body.ingredients === "string" ? body.ingredients.trim().slice(0, 1000) : "";
      if (!image && !list) throw new EngineError("List some ingredients or add a photo of your fridge.", 400);
      return decode({
        schema: PantryResult,
        image,
        prompt: `${image ? "This photo shows what is in the cook's fridge or pantry. Identify the ingredients." : ""}
${list ? `The cook has: ${list}.` : ""}
Assume basic staples (salt, pepper, oil, water) are available.
Suggest 5 dishes from a variety of cuisines they can make tonight, best match first. Each may need at most 3 extra ingredients.
${describePrefs(body.prefs as Prefs | undefined)}`,
      });
    },
    () => demoPantry,
  );
}
