# DishDecoded

Snap a dish or a menu and find out what it is, what's in it, where it comes from, and how to make it.

DishDecoded is a Next.js web app built around one shared "dish understanding" engine: a vision model turns a photo, a menu or a dish name into a structured **dish profile** (name, origin, ingredients, allergens, diet fit, flavor). Seven features sit on top of that profile.

| Feature | Where | What it does |
| --- | --- | --- |
| Dish identifier | Decode a dish | Photo or name in; name, native name, pronunciation (with audio), origin and description out |
| Allergen and diet checker | Dish view, Menu | Flags allergens and diet conflicts against your saved profile |
| Flavor profile and pairings | Dish view | Six-axis flavor chart, drink and side pairings, similar dishes |
| Food culture explorer | Dish view, "Story" tab | History, regional variations, how to eat it |
| Recipe reverse-engineering | Dish view, "Make it at home" tab | A home recipe with swaps for ingredients that are hard to find where you live |
| Menu decoder | Menu | Reads a menu in any language, explains each dish and ranks picks for you |
| Cook it with what I have | Cook tonight | Suggests dishes from a typed list or a fridge photo |

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. Without an API key the app runs in **demo mode** and returns sample results, which is handy for a public portfolio deploy.

## How it works

- `src/lib/schemas.ts`: Zod schemas for the dish profile and every module's output.
- `src/lib/engine.ts`: the shared engine. One call to the Claude API with structured outputs, so every answer matches its schema, plus an in-memory cache keyed by dish name.
- `src/app/api/*`: one route per capability (`identify`, `details`, `menu`, `pantry`).
- Your taste profile and saved dishes are stored in the browser's local storage; there is no database or login.

Images are resized in the browser before upload to keep requests fast.

## Deploy

Deploy to Vercel (or any Node host) and set `ANTHROPIC_API_KEY` in the project's environment variables. Leave it unset to publish the demo.

## Disclaimer

Ingredients and allergens are AI estimates based on typical recipes. Always confirm with the restaurant if you have an allergy.
