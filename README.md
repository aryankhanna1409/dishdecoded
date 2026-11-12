<div align="center">

<picture><source media="(prefers-color-scheme: light)" srcset="assets/banner-light.svg" /><img src="assets/banner.svg" width="100%" alt="dishdecoded: stop 5 of 5 in the loop, SHIP" /></picture>

**Point your camera at a dish or a menu. Find out what it is, what's in it, where it comes from, and how to make it at home.**


![Next.js 15](https://img.shields.io/badge/Next.js-15-8a5a22?style=flat-square&labelColor=1d120b) ![TypeScript](https://img.shields.io/badge/TypeScript-3b2416?style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3b2416?style=flat-square) ![Claude vision](https://img.shields.io/badge/Claude-vision-8a5a22?style=flat-square&labelColor=1d120b) ![Zod](https://img.shields.io/badge/Zod-3b2416?style=flat-square) ![license MIT](https://img.shields.io/badge/license-MIT-8a5a22?style=flat-square&labelColor=1d120b)

</div>

> **Stop 5 of 5 · SHIP · the Serve.** The last stop is the one people touch: a small product built on the same idea of structured, checked AI output. Previous: [nexus](https://github.com/aryankhanna1409/nexus). See [the whole loop](https://github.com/aryankhanna1409).

<div align="center">

![DishDecoded demo](assets/demo.gif)

<sub>Recorded in demo mode: decoding a dish, its allergens, story and recipe, then a Thai menu and a pantry list.</sub>

</div>

## Why

Travelling, or just at a restaurant with an unfamiliar menu, you often can't tell what a dish is, whether it's safe for your allergies, or how to say its name. Food apps mostly count calories. DishDecoded explains the food instead.

## Features

DishDecoded has seven features, and they all run on **one shared engine**. A vision model turns a photo, a menu or a dish name into a structured *dish profile*. Each feature is a thin layer on top of that profile.

| # | Feature | What you get |
| --- | --- | --- |
| 01 | **Dish identifier** | Name, native script, pronunciation with audio, origin, a plain description, and a confidence score with "could also be" alternatives |
| 02 | **Allergen and diet checker** | Likely allergens and the fit for vegan, vegetarian, halal, kosher, keto and gluten-free diets, checked against *your* saved allergies |
| 03 | **Flavor and pairings** | A six-axis flavor radar, drinks and sides that go with it, and similar dishes from other cuisines |
| 04 | **Food culture explorer** | The dish's history, regional variations, how locals eat it and a fun fact |
| 05 | **Recipe reverse-engineering** | A home recipe with swaps for ingredients that are hard to find where you live |
| 06 | **Menu decoder** | Reads a menu in any language, explains every dish and ranks the best picks for you |
| 07 | **Cook it with what I have** | Type what's in your fridge or snap a photo of it, and get dishes you can make tonight |

## Screenshots

<sub>Captured in demo mode, which shows built-in sample results.</sub>

<table>
  <tr>
    <td colspan="2"><img src="assets/screenshots/identify.png" alt="Dish identifier showing khao soi with pronunciation and origin" /></td>
  </tr>
  <tr>
    <td colspan="2"><img src="assets/screenshots/allergens-flavor.png" alt="Allergen warnings and flavor radar" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/screenshots/menu.png" alt="Decoded Thai menu with top picks and allergen flags" /></td>
    <td width="50%"><img src="assets/screenshots/recipe.png" alt="Home recipe with ingredient swaps" /><br><br><img src="assets/screenshots/pantry.png" alt="Dishes you can cook from your pantry" /></td>
  </tr>
</table>

## How it works

```mermaid
flowchart LR
    A[Dish photo] --> E
    B[Menu photo] --> E
    C[Dish name or pantry list] --> E
    E["Dish engine<br/>Claude vision + structured outputs"] --> P[(Dish profile)]
    P --> F1[Identifier]
    P --> F2[Allergen and diet checker]
    P --> F3[Flavor and pairings]
    P --> F4[Culture explorer]
    P --> F5[Recipe]
    E --> F6[Menu decoder]
    E --> F7[Cook with what I have]
```

- **One engine, typed outputs.** `src/lib/engine.ts` makes a single Claude API call per request using structured outputs. The response is validated against a Zod schema from `src/lib/schemas.ts`, so the UI never has to parse free text.
- **Cheap repeat lookups.** Text lookups and generated details (story, recipe, pairings) are cached in memory by dish name, so a second request for the same dish doesn't call the API again.
- **Allergen checks run locally.** The engine reports allergens and diet fit once. Your personal warnings are worked out in the browser from your saved profile, so they're instant and deterministic.
- **No accounts.** Your taste profile and food journal live in the browser's local storage.
- **Demo mode.** With no API key set, every route returns sample data. That lets the app be explored, or deployed publicly, at no cost.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) with React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| AI | Claude API (`@anthropic-ai/sdk`), with vision input and structured outputs |
| Validation | Zod |
| Storage | Browser local storage |

## Getting started

```bash
git clone https://github.com/aryankhanna1409/dishdecoded.git
cd dishdecoded
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. Get an API key from the [Anthropic Console](https://console.anthropic.com). Leave the key empty to run in demo mode.

## Project structure

```
src/
├── app/
│   ├── page.tsx            # Decode a dish (identifier + dish view)
│   ├── menu/               # Menu decoder
│   ├── pantry/             # Cook it with what I have
│   ├── saved/ · dish/      # Food journal
│   ├── profile/            # Allergies, diets and tastes
│   └── api/                # identify · details · menu · pantry
├── components/             # DishView, FlavorRadar, ImagePicker, …
└── lib/
    ├── engine.ts           # Shared Claude engine + cache
    ├── schemas.ts          # Zod schemas for every output
    ├── client.ts           # Local storage, API helper, allergen checker
    └── demo.ts             # Sample data for demo mode
```

## Deploy

Deploy to [Vercel](https://vercel.com/new) or any Node host. Set `ANTHROPIC_API_KEY` in the environment variables, or leave it unset to publish the demo.

## Disclaimer

Ingredients and allergens are AI estimates based on typical recipes, and recipes vary. If you have an allergy, always confirm with the restaurant.

## License

[MIT](LICENSE)

---

<div align="center">

<picture><source media="(prefers-color-scheme: light)" srcset="assets/loop-light.svg" /><img src="assets/loop.svg" width="100%" alt="dishdecoded is one pour in a loop: move, see, know, act, ship" /></picture>

<sub>Part of <a href="https://github.com/aryankhanna1409">Aryan Khanna's portfolio</a>: one loop, five pours, from robots to AI systems.</sub>

</div>
