# Anvil Backend: Build and Deploy

Goal: turn the Anvil artifact into a live web app with a safe backend that holds your Anthropic key. The plan uses Vercel because it hosts the React app and the serverless function together with no extra config. Netlify and Cloudflare work the same way with small naming changes, noted at the end.

## What you are building

A small relay. The browser calls `/api/generate` on your own site. That function holds the key and forwards the request to Anthropic, then returns the text. The key never reaches the browser. That is the whole backend.

The one critical detail: the real Anthropic API needs two headers the artifact never used, `x-api-key` and `anthropic-version`. The function file already includes them.

## Files in this starter

1. `api_generate.js` goes in your project at `api/generate.js`.
2. `callClaude_patched.js` replaces the `callClaude` function inside the Anvil component.

## Set up Claude Code (recommended)

Claude Code is the agent that will do most of this build with you. You have to install it and launch it yourself. It does not start on its own.

1. Install it. Since you are installing Node.js for Vite anyway, the simplest route is npm:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   Anthropic also offers a native installer (a single command, no Node.js needed) and a Desktop app with no terminal at all. Check the Claude Code docs for the current one-line installer if you prefer one of those.
2. Verify it: `claude --version` should print a version number.
3. Account: Claude Code needs a paid Claude plan (Pro, Max, Team, or Enterprise) or an Anthropic Console account billed per token. The free plan does not work with Claude Code. For this project, sign in with your Enterprise seat on the company account. That covers Claude Code for you, the human.
4. Launch it inside the project: open a terminal, `cd` into the project folder, then run `claude`. The first run opens your browser to sign in.
5. Give it the task:
   "Read CLAUDE.md and Anvil_Backend_README.md, then build the backend and run it locally with vercel dev. Use plan mode and show me the plan before you execute."

You can also do every step below by hand. Either path works.

## Steps

### 1. Get an Anthropic API key
Sign in at console.anthropic.com, create an API key, and copy it. Treat it like a password. It will live only on the server, never in the app. This key is separate from how you sign in to Claude Code. The deployed app calls the API directly, so it needs its own Console key with billing set up. Your Enterprise seat does not cover the app's automated calls. Have an admin create a project-scoped key for Anvil inside the company Console, so the app's spend lands on the company account and can be watched and capped on its own.

### 2. Scaffold a Vite React app
```
npm create vite@latest anvil -- --template react
cd anvil
npm install
```

### 3. Drop in the Anvil component
Rename the Anvil file to `src/App.jsx`. It already starts with `import React, { useState, useMemo, useRef } from "react";`, so it works as is. Make sure `src/main.jsx` renders it:
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

### 4. Add the server function
Create a folder named `api` at the project root, next to `src`, and put `generate.js` in it (from `api_generate.js` in this starter). On Vercel, anything in `api/` automatically becomes a serverless function. No config needed.

### 5. Point the app at the function
Open `src/App.jsx`, find the existing `callClaude` function, and replace it with the one in `callClaude_patched.js`. The only change is that it calls `/api/generate` instead of the Anthropic URL, and it reads `data.text`. Your retry logic stays.

### 6. Test locally
Plain `npm run dev` will not run the `api` function. Use the Vercel CLI so both run together:
```
npm i -g vercel
vercel dev
```
Set the key for local runs when prompted, or create a file named `.env.local` with:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Never commit that file. Add `.env.local` to `.gitignore`.

### 7. Deploy
Push the project to a GitHub repo. In Vercel, import the repo. Vercel detects Vite automatically. Before the first deploy, go to Project Settings, Environment Variables, and add:
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-your-key-here
```
Deploy. You now have a live URL.

### 8. Point your domain
In Vercel, add a domain such as `anvil.promptedforge.ai` and follow the DNS instructions. Your registrar is Namecheap for most things, so add the record there.

## Before you make it public

The function is open to anyone who finds the URL, and every call spends your tokens. Do not skip this.

1. **Rate limit.** Add a per-IP or per-user limit in the function. In-memory counters do not work on serverless because each call can hit a fresh instance, so use a shared store. Vercel KV or Upstash Redis are the common choices and both have free tiers. Limit, for example, 20 generations per IP per hour.
2. **Auth.** Gate the app behind a login so only known users reach the function. You already run Supabase. Use Supabase Auth, then have the function verify the user's token before calling Anthropic.
3. **Usage cap.** Track spend per user in a Supabase table and stop a user who passes a daily or monthly cap. This is also the table the "close the loop" feature will write to later.

A reasonable order: ship privately behind a simple password or Supabase login first, watch real usage, then add rate limiting and caps before opening it up.

## What this unlocks

You now own the token ceiling. The function defaults to 1500 tokens and allows up to 4096. That directly fixes the avatar truncation you hit earlier, and it is the prerequisite for the P1 depth work, since the proof engine, the constraints dissolve, and the curiosity engine all need more room per call than the old 1000-token artifact cap allowed.

## Adapting to Netlify or Cloudflare

The relay logic is identical. Only the file location and the handler signature change.

- **Netlify.** Put the function at `netlify/functions/generate.js` and export a `handler(event)` that reads `JSON.parse(event.body)` and returns `{ statusCode, body }`. The app calls `/.netlify/functions/generate`.
- **Cloudflare Pages.** Put it at `functions/api/generate.js` and export `onRequestPost({ request, env })`, reading the key from `env.ANTHROPIC_API_KEY`. The app calls `/api/generate`, same as Vercel.

The headers, the body shape, and the Anvil-side `callClaude` stay the same across all three.
