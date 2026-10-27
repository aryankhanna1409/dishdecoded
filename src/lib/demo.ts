// Sample answers used when no ANTHROPIC_API_KEY is set, so the app can be
// explored (for example on a portfolio deploy) without spending API credit.
import type { Culture, DishProfile, MenuResult, PantryResult, Pairings, Recipe } from "./schemas";

export const demoDish: DishProfile = {
  recognized: true,
  name: "Khao soi",
  native_name: "ข้าวซอย",
  pronunciation: "kow-soy",
  origin: { country: "Thailand", region: "Chiang Mai, Northern Thailand" },
  cuisine: "Northern Thai",
  description:
    "A rich coconut curry noodle soup with soft egg noodles in the broth and a nest of crispy fried noodles on top. It is served with pickled mustard greens, shallots and lime on the side.",
  ingredients: [
    { name: "egg noodles", likelihood: "certain" },
    { name: "coconut milk", likelihood: "certain" },
    { name: "red curry paste", likelihood: "certain" },
    { name: "chicken drumsticks", likelihood: "likely" },
    { name: "fish sauce", likelihood: "likely" },
    { name: "pickled mustard greens", likelihood: "likely" },
    { name: "shallots", likelihood: "likely" },
    { name: "chili oil", likelihood: "possible" },
  ],
  allergens: [
    { allergen: "gluten", likelihood: "certain" },
    { allergen: "eggs", likelihood: "certain" },
    { allergen: "fish", likelihood: "likely" },
    { allergen: "crustaceans", likelihood: "possible" },
    { allergen: "peanuts", likelihood: "possible" },
  ],
  diet: {
    vegetarian: "no",
    vegan: "no",
    halal: "depends",
    kosher: "no",
    gluten_free: "no",
    dairy_free: "yes",
    keto: "no",
  },
  flavor: { spicy: 3, sweet: 2, sour: 2, salty: 3, bitter: 0, umami: 4 },
  confidence: 0.86,
  alternatives: ["Laksa", "Khao poon", "Ohn no khao swe"],
};

export const demoCulture: Culture = {
  history:
    "Khao soi is closely linked to Chiang Mai and the Chin Haw, Chinese Muslim traders from Yunnan who travelled caravan routes through northern Thailand, Laos and Myanmar.\n\nThe coconut curry version most visitors know today mixes those Yunnanese noodle traditions with Burmese and Thai curry flavours. Many of the oldest shops in Chiang Mai are run by Muslim families and serve it with chicken or beef rather than pork.",
  regional_variations: [
    { region: "Chiang Mai", difference: "Coconut curry broth, egg noodles, crispy noodle topping." },
    { region: "Laos (khao soi Lao)", difference: "Clear pork broth with a chunky tomato and minced pork sauce, no coconut." },
    { region: "Myanmar (ohn no khao swe)", difference: "A close cousin with a thicker coconut and chickpea flour broth." },
  ],
  how_to_eat:
    "Squeeze in the lime, add pickled greens and shallots to taste, stir the crispy noodles into the broth bit by bit, and eat with a spoon and chopsticks.",
  fun_fact: "In Laos, ordering khao soi gets you a completely different dish with no curry at all.",
  related_dishes: ["Laksa", "Ohn no khao swe", "Nam ngiao"],
};

export const demoRecipe: Recipe = {
  servings: 4,
  total_minutes: 60,
  difficulty: "medium",
  ingredients: [
    { item: "Fresh egg noodles", amount: "500 g", swap: "Dried egg noodles or linguine" },
    { item: "Coconut milk", amount: "2 × 400 ml cans", swap: null },
    { item: "Red curry paste", amount: "3 tbsp", swap: null },
    { item: "Curry powder", amount: "1 tbsp", swap: null },
    { item: "Chicken drumsticks", amount: "6", swap: "Firm tofu for a vegetarian version" },
    { item: "Chicken stock", amount: "500 ml", swap: null },
    { item: "Fish sauce", amount: "2 tbsp", swap: "Soy sauce" },
    { item: "Palm sugar", amount: "1 tbsp", swap: "Brown sugar" },
    { item: "Pickled mustard greens", amount: "To serve", swap: "Sauerkraut or kimchi, rinsed" },
    { item: "Shallots and lime", amount: "To serve", swap: "Red onion" },
  ],
  steps: [
    "Fry a quarter of the noodles in hot oil until crisp and golden. Drain and set aside.",
    "Fry the curry paste and curry powder in the thick top layer of one can of coconut milk until fragrant, about 3 minutes.",
    "Add the chicken and turn it to coat, then pour in the remaining coconut milk and the stock.",
    "Simmer gently for 35 to 40 minutes until the chicken is tender. Season with fish sauce and sugar.",
    "Boil the remaining noodles, divide between bowls, ladle over the curry and a drumstick, and top with crispy noodles.",
  ],
  tips: [
    "Don't let the coconut milk boil hard or it will split.",
    "Serve the pickled greens, shallots and lime on the side so everyone seasons their own bowl.",
  ],
};

export const demoPairings: Pairings = {
  drinks: [
    { name: "Thai iced tea", why: "Its creamy sweetness cools the chili heat." },
    { name: "Off-dry Riesling", why: "A little sugar and high acidity cut through the coconut richness." },
    { name: "Light lager", why: "Crisp and cold, it resets the palate between spoonfuls." },
  ],
  sides: [
    { name: "Pickled mustard greens", why: "Sour crunch balances the rich broth." },
    { name: "Sai ua (northern Thai sausage)", why: "A herby, grilled side common in Chiang Mai." },
  ],
  similar_dishes: [
    { name: "Laksa", origin: "Malaysia and Singapore", why: "Coconut curry noodle soup with a seafood edge." },
    { name: "Ohn no khao swe", origin: "Myanmar", why: "Its closest relative, milder and thicker." },
    { name: "Curry udon", origin: "Japan", why: "Thick noodles in a mild, savoury curry broth." },
  ],
};

export const demoMenu: MenuResult = {
  readable: true,
  language: "Thai",
  cuisine: "Thai",
  items: [
    {
      original_name: "ข้าวซอยไก่",
      translated_name: "Khao soi with chicken",
      section: "Noodles",
      price: "฿80",
      description: "Coconut curry noodle soup with crispy noodles on top, a Chiang Mai classic.",
      main_ingredients: ["egg noodles", "coconut curry", "chicken"],
      allergens: ["gluten", "eggs", "fish"],
      vegetarian: false,
      vegan: false,
      spice: 3,
      match_score: 9,
      match_reason: "Rich and gently spicy, a good first taste of northern Thai food.",
    },
    {
      original_name: "ส้มตำ",
      translated_name: "Som tam (green papaya salad)",
      section: "Salads",
      price: "฿60",
      description: "Shredded green papaya pounded with lime, chili, fish sauce and peanuts. Fresh, sour and hot.",
      main_ingredients: ["green papaya", "lime", "chili", "peanuts", "dried shrimp"],
      allergens: ["peanuts", "fish", "crustaceans"],
      vegetarian: false,
      vegan: false,
      spice: 4,
      match_score: 6,
      match_reason: "Very bright and spicy; ask for 'mai phet' if you want it milder.",
    },
    {
      original_name: "ผัดผักบุ้ง",
      translated_name: "Stir-fried morning glory",
      section: "Vegetables",
      price: "฿50",
      description: "Water spinach flash-fried with garlic, chili and soy bean paste.",
      main_ingredients: ["water spinach", "garlic", "soybean paste"],
      allergens: ["soy"],
      vegetarian: true,
      vegan: false,
      spice: 2,
      match_score: 7,
      match_reason: "A simple, garlicky green side that goes with everything.",
    },
    {
      original_name: "ข้าวเหนียวมะม่วง",
      translated_name: "Mango sticky rice",
      section: "Desserts",
      price: "฿70",
      description: "Sweet sticky rice soaked in coconut cream, served with ripe mango.",
      main_ingredients: ["glutinous rice", "coconut cream", "mango"],
      allergens: [],
      vegetarian: true,
      vegan: true,
      spice: 0,
      match_score: 8,
      match_reason: "Naturally vegan and a crowd favourite to end the meal.",
    },
  ],
};

export const demoPantry: PantryResult = {
  detected_ingredients: ["eggs", "rice", "spring onions", "soy sauce", "garlic", "frozen peas"],
  dishes: [
    {
      name: "Egg fried rice",
      origin: "China",
      description: "Day-old rice tossed in a hot pan with egg, garlic and spring onion.",
      uses: ["eggs", "rice", "spring onions", "soy sauce", "garlic", "frozen peas"],
      missing: [],
      minutes: 15,
      difficulty: "easy",
    },
    {
      name: "Tamagoyaki",
      origin: "Japan",
      description: "A rolled, slightly sweet omelette, sliced into neat pieces.",
      uses: ["eggs", "soy sauce"],
      missing: ["sugar", "mirin"],
      minutes: 15,
      difficulty: "medium",
    },
    {
      name: "Okayu (rice porridge)",
      origin: "Japan",
      description: "Soft, comforting rice porridge topped with egg and spring onion.",
      uses: ["rice", "eggs", "spring onions", "soy sauce"],
      missing: ["ginger"],
      minutes: 35,
      difficulty: "easy",
    },
  ],
};
