import { decode, describePrefs, EngineError, slug } from "@/lib/engine";
import { demoCulture, demoPairings, demoRecipe } from "@/lib/demo";
import { handle } from "@/lib/route";
import { Culture, DETAIL_KINDS, Pairings, Recipe, type DetailKind, type Prefs } from "@/lib/schemas";

export const maxDuration = 60;

const KINDS = {
  // Feature 6: food culture explorer
  culture: {
    schema: Culture,
    prompt: (dish: string) =>
      `Tell the story of ${dish}: where it comes from, how it spread, how it differs by region, how locals eat it, and one surprising fact.`,
    demo: () => demoCulture,
  },
  // Feature 2: recipe reverse-engineering
  recipe: {
    schema: Recipe,
    prompt: (dish: string, prefs?: Prefs) =>
      `Write a reliable home recipe for ${dish} that tastes close to a good restaurant version.
${prefs?.homeCountry ? `The cook lives in ${prefs.homeCountry}; suggest swaps for anything hard to find there.` : "Suggest swaps for anything hard to find outside its home country."}
${prefs?.diets.length ? `Where possible, note swaps that suit these diets: ${prefs.diets.join(", ")}.` : ""}`,
    demo: () => demoRecipe,
  },
  // Feature 5: flavor profile and pairings
  pairings: {
    schema: Pairings,
    prompt: (dish: string, prefs?: Prefs) =>
      `Suggest 3 drinks (include at least one non-alcoholic) and 2 sides that pair well with ${dish}, and 3 similar dishes from other cuisines the diner might like.
${describePrefs(prefs)}`,
    demo: () => demoPairings,
  },
} as const;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const kind = body.kind as DetailKind;
  const def = KINDS[kind];
  return handle(
    async () => {
      if (!DETAIL_KINDS.includes(kind)) throw new EngineError("Unknown detail type.", 400);
      const dish = typeof body.dish === "string" ? body.dish.trim().slice(0, 200) : "";
      if (!dish) throw new EngineError("Missing dish name.", 400);
      const prefs = body.prefs as Prefs | undefined;
      const personal = kind === "culture" ? "" : JSON.stringify(prefs ?? {});
      return decode({
        schema: def.schema,
        prompt: def.prompt(dish, prefs),
        cacheKey: `${kind}:${slug(dish)}:${personal}`,
      });
    },
    () => (def ? def.demo() : demoCulture),
  );
}
