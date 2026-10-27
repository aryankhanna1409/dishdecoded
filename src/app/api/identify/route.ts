import { decode, slug } from "@/lib/engine";
import { demoDish } from "@/lib/demo";
import { EngineError } from "@/lib/engine";
import { handle, parseImage } from "@/lib/route";
import { DishProfile } from "@/lib/schemas";

export const maxDuration = 60;

// Feature 1 (dish identifier) and the shared engine: photo or name in, dish profile out.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return handle(
    async () => {
      const image = parseImage(body.image);
      const text = typeof body.text === "string" ? body.text.trim().slice(0, 500) : "";
      if (!image && !text) throw new EngineError("Add a photo or type a dish name.", 400);

      const prompt = image
        ? `Identify the dish in this photo.${text ? ` The diner adds: "${text}".` : ""} Build its dish profile.`
        : `Build the dish profile for: "${text}".`;
      return decode({
        schema: DishProfile,
        image,
        prompt: `${prompt}
List the ingredients a typical version contains, the allergens they imply, how well it fits each diet, and its flavor on a 0 to 5 scale.
If it is not food, set recognized to false and leave the other fields minimal.`,
        cacheKey: image ? undefined : `dish:${slug(text)}`,
      });
    },
    () => demoDish,
  );
}
