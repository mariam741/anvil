# CLAUDE.md

Guidance for Claude Code working in the Anvil repository. Read this first every session. Anvil is a real product going to market in July 2026, so treat the rules here as canon. When something in the code conflicts with this file, ask before changing it.

## What Anvil is

Anvil, by Prompted Forge, is an ad-generation tool. It turns a buyer and an offer into finished, placement-shaped ads, A/B test sets, and Google responsive search ad asset sets, tuned to a campaign objective and a brand voice. It is built on a six-block direct-response framework. The core component is a single large React component that began as a chat artifact and is moving to a Vite app with a small serverless backend.

Supported placements: Facebook, Instagram, TikTok, YouTube Shorts, Google Search.

The six blocks: Pain, Promise, Proof, Constraints, Curiosity, Conditions.

## Repository layout

- `src/App.jsx` is the Anvil component. It already imports React at the top.
- `src/main.jsx` renders `App`.
- `api/generate.js` is the serverless proxy that holds the Anthropic key.
- `.env.local` holds `ANTHROPIC_API_KEY` for local dev. It is gitignored. Never commit a key.

## Setup and commands

- Install: `npm install`
- Local dev with the API function: `vercel dev` (plain `npm run dev` will not run `api/`)
- Production build: `npm run build`
- Deploy: push to GitHub, Vercel auto-builds. `vercel --prod` for a manual deploy.

The key lives only on the server, as `process.env.ANTHROPIC_API_KEY`, set in Vercel project settings. It must never appear in `src/` or ship to the browser.

## API shape (do not break)

- The browser calls `POST /api/generate` with `{ prompt, max_tokens }` and reads `{ text }`.
- `api/generate.js` calls `https://api.anthropic.com/v1/messages` with the headers `x-api-key` and `anthropic-version: 2023-06-01`. Both are required on the real API. The old artifact did not need them; the real app does.
- Generation model is `claude-sonnet-4-6`. This is the model the app uses for its own generations. It is separate from whatever model you, Claude Code, are running on.
- We now own the token ceiling. Default 1500, cap 4096. Do not pin it back to 1000. The old 1000-token cap caused avatar truncation, which is fixed by owning the backend.
- `callClaude` in `src/App.jsx` posts to `/api/generate`, keeps a single retry on transient errors (429, 5xx, 529) and network blips, and surfaces the real error message. Keep that behavior.

## Constraints

These were artifact-era limits and no longer apply now that this is a real Vite app: localStorage and sessionStorage are allowed, `<form>` is allowed, and you are not limited to inline styles or a single file. You may split the component and add real state, storage, routing, and CSS as the build grows.

These still hold:

- Keep a single root `export default function App`.
- Keep `parseJSON` tolerant of truncated model output. It tries a strict parse, then repairs a cut-off tail. Do not remove the repair.
- Keep the avatar render guarded on every field, so a partial avatar shows what survived instead of crashing.

## Voice canon (hard rules)

Applies to all user-facing UI text and to every generation prompt the app sends:

- No em-dashes, ever. Use a comma, a period, or a colon.
- Never the "it is not X, it is Y" construction. It reads as an AI tell.
- No filler words like "genuinely" or "honestly".
- Short declarative sentences. Plain language. Keep Oxford commas.
- No manufactured urgency or fake scarcity.
- Prose over bullets in product copy.

## Safety canon (do not regress, this is P0 work already shipped)

- The coverage metric (`copyVelocity` in code) is a neutral diagnostic, not a score. It is labeled "Coverage". Do not reintroduce achievement tiers (Elite, Strong, Building, Loose) or tell the model to "maximize" it. The source course itself says do not optimize this number.
- The Plain and credible and Ambitious voices forbid Taboo Solution frames, shock characterizations, and idea caricatures. Keep those bans when you build the Curiosity depth.
- The compliance gate: when `intake.regulated` is on (health, legal, finance, income claims), generation is blocked until the user acknowledges human review, and every prompt carries a hard compliance instruction (no medical, legal, financial, or income claims, sell the free next step, all output human-reviewed). Do not weaken or bypass this.
- Lead-gen objective sells the free next step (consult, inspection, quote), not the purchase. Keep that in `objectiveLine`.

## Naming and provenance

The framework comes from the CopyCoders "Copy Blocks" course. Their coined terms (Copy Blocks, Copy Velocity, P3C2, C.R.A.V.E.S., Epiphany Threshold) are renamed to house terms in Anvil: Coverage, Polish, insight level, six blocks by their public-domain names. Code identifiers like `copyVelocity` and `cv()` were left intact so nothing breaks. Do not surface the source's trademarks in user-facing copy. A trademark and domain check on the name "Anvil" is still pending before any public launch.

## Build order (current roadmap)

P0 is done: coverage de-gamified, voice caps, compliance gate.

P1, depth that differentiates, port from the source with the safety caps on:
1. Proof engine: 22 proof types across 5 categories, ranked harder-to-fake-is-stronger, with proof paired to its claim and weighted to the size of the promise. Feeds from the avatar.
2. Constraints dissolve: the Acknowledge, Wedge, Elaborate framework, plus side-stepping value and identity objections.
3. Curiosity engine: the Curiosity Quadrant angle generator, Characterizations, Intuition Pumps, Evocative Naming, Anti-Constraints, and Idea Caricatures, all behind the safety caps. Highest quality lift, highest risk. Never ship before the caps are verified.
4. Pain Chain and Promise Ladder as real 4-rung builders, not labels.
5. Conditions split into its 5 named types.

P2, the bigger levers the source ignores:
6. Close the loop: paste results back, propose the next test. Needs storage.
7. Offer-strength check on the Step 0 offer before any copy.
8. A short landing-page and speed-to-lead checklist.

P3, platform enablers:
9. Auth, rate limiting, and a per-user usage cap before public launch. Supabase is the chosen stack.

P1 depth wants more tokens per call, which is why the backend came first. The avatar is the spine that proof, constraints, and curiosity all read from. The full coverage map and reasoning live in `Anvil_CopyBlocks_Coverage_and_Build_Order.md`. The backend steps live in `Anvil_Backend_README.md`.

## How to work here

- Make surgical edits and validate after each change.
- Validation: `npm run build` must pass, and a search of `src` and `api` for the em-dash character (U+2014) must return nothing.
- Proven over projected. State honest limits. If a change would regress a canon rule above, stop and ask.
- Anvil is the fast first part of a human process, not the whole job. Words are a lower lever than offer, creative, audience, landing page, and speed-to-lead. Do not let the tool imply copy is the whole answer.
- Before spending real ad money: trademark check on the name, dental and other regulated compliance review, and attention on the bigger levers.
