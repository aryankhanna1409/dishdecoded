import * as z from "zod/v4";

export const ALLERGENS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "dairy",
  "tree nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const DIETS = [
  "vegetarian",
  "vegan",
  "halal",
  "kosher",
  "gluten_free",
  "dairy_free",
  "keto",
] as const;
export type Diet = (typeof DIETS)[number];

const Likelihood = z.enum(["certain", "likely", "possible"]);
const Fit = z.enum(["yes", "no", "depends"]);
const Level = z.number().int().describe("0 (none) to 5 (very strong)");

// The core "dish profile" every module builds on.
export const DishProfile = z.object({
  recognized: z.boolean().describe("false if the input is not food or cannot be identified"),
  name: z.string().describe("Common English name of the dish"),
  native_name: z.string().nullable().describe("Name in the original language and script, if different"),
  pronunciation: z.string().describe("Simple phonetic spelling for English speakers, e.g. 'kow-soy'"),
  origin: z.object({
    country: z.string(),
    region: z.string().nullable(),
  }),
  cuisine: z.string(),
  description: z.string().describe("One or two plain sentences: what it is and how it is eaten"),
  ingredients: z.array(z.object({ name: z.string(), likelihood: Likelihood })),
  allergens: z.array(z.object({ allergen: z.enum(ALLERGENS), likelihood: Likelihood })),
  diet: z.object({
    vegetarian: Fit,
    vegan: Fit,
    halal: Fit,
    kosher: Fit,
    gluten_free: Fit,
    dairy_free: Fit,
    keto: Fit,
  }),
  flavor: z.object({
    spicy: Level,
    sweet: Level,
    sour: Level,
    salty: Level,
    bitter: Level,
    umami: Level,
  }),
  confidence: z.number().describe("0 to 1"),
  alternatives: z.array(z.string()).describe("Up to 3 other dishes it could be"),
});
export type DishProfile = z.infer<typeof DishProfile>;

export const Culture = z.object({
  history: z.string().describe("Two or three short paragraphs separated by blank lines"),
  regional_variations: z.array(z.object({ region: z.string(), difference: z.string() })),
  how_to_eat: z.string(),
  fun_fact: z.string(),
  related_dishes: z.array(z.string()),
});
export type Culture = z.infer<typeof Culture>;

export const Recipe = z.object({
  servings: z.number().int(),
  total_minutes: z.number().int(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  ingredients: z.array(
    z.object({
      item: z.string(),
      amount: z.string(),
      swap: z.string().nullable().describe("A substitute that is easy to find in the cook's country, or null"),
    }),
  ),
  steps: z.array(z.string()),
  tips: z.array(z.string()),
});
export type Recipe = z.infer<typeof Recipe>;

export const Pairings = z.object({
  drinks: z.array(z.object({ name: z.string(), why: z.string() })),
  sides: z.array(z.object({ name: z.string(), why: z.string() })),
  similar_dishes: z.array(z.object({ name: z.string(), origin: z.string(), why: z.string() })),
});
export type Pairings = z.infer<typeof Pairings>;

export const DETAIL_KINDS = ["culture", "recipe", "pairings"] as const;
export type DetailKind = (typeof DETAIL_KINDS)[number];

export const MenuResult = z.object({
  readable: z.boolean().describe("false if the image is not a menu"),
  language: z.string(),
  cuisine: z.string(),
  items: z.array(
    z.object({
      original_name: z.string(),
      translated_name: z.string(),
      section: z.string().nullable(),
      price: z.string().nullable(),
      description: z.string().describe("What the dish actually is, in plain English"),
      main_ingredients: z.array(z.string()),
      allergens: z.array(z.enum(ALLERGENS)),
      vegetarian: z.boolean(),
      vegan: z.boolean(),
      spice: Level,
      match_score: z.number().int().describe("0 to 10, how well it fits the diner's tastes and diet"),
      match_reason: z.string(),
    }),
  ),
});
export type MenuResult = z.infer<typeof MenuResult>;
export type MenuItem = MenuResult["items"][number];

export const PantryResult = z.object({
  detected_ingredients: z.array(z.string()).describe("Ingredients read from the photo, or the list given"),
  dishes: z.array(
    z.object({
      name: z.string(),
      origin: z.string(),
      description: z.string(),
      uses: z.array(z.string()),
      missing: z.array(z.string()).describe("Ingredients the cook still needs, at most 3"),
      minutes: z.number().int(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),
});
export type PantryResult = z.infer<typeof PantryResult>;

export type Prefs = {
  allergens: Allergen[];
  diets: Diet[];
  likes: string;
  dislikes: string;
  homeCountry: string;
};

export const EMPTY_PREFS: Prefs = { allergens: [], diets: [], likes: "", dislikes: "", homeCountry: "" };

export type ImageInput = { data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" };
