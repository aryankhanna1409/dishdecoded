import { decode, describePrefs, EngineError } from "@/lib/engine";
import { demoMenu } from "@/lib/demo";
import { handle, parseImage } from "@/lib/route";
import { MenuResult, type Prefs } from "@/lib/schemas";

export const maxDuration = 120;

// Feature 4: menu decoder for travellers.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return handle(
    async () => {
      const image = parseImage(body.image);
      if (!image) throw new EngineError("Add a photo of a menu.", 400);
      return decode({
        schema: MenuResult,
        image,
        prompt: `This is a photo of a restaurant menu. Read every dish on it, in any language.
For each dish give its original name exactly as written, an English name, a plain description of what it really is, main ingredients, likely allergens, whether it is vegetarian or vegan, and its spice level.
Then score how well each dish fits this diner from 0 to 10, with a one-line reason. Score 0 for anything that conflicts with an allergy or diet.
${describePrefs(body.prefs as Prefs | undefined)}
If the image is not a menu, set readable to false and return no items.`,
      });
    },
    () => demoMenu,
  );
}
