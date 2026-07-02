# START HERE

Welcome, and congratulations on the degree. You are picking up a real product called Anvil that is going to market in July 2026. This page is a five-minute read. It tells you what to open, in what order, the exact first commands, and what "done" looks like for your first task. Everything else lives in the other docs, which this page points to.

## What Anvil is, in two lines

Anvil is an ad-generation tool by Prompted Forge. A user describes their buyer and offer, and Anvil writes finished ads, A/B test sets, and Google search ads, tuned to a voice and an objective. It is a React app that calls Claude to generate the copy.

## The files, in the order to open them

1. **This page.** You are here.
2. **CLAUDE.md.** The rulebook. Put it at the root of the repo. Claude Code reads it automatically every session, so you do not have to memorize it. It holds the API shape, the voice rules, the safety rules, and the roadmap.
3. **Anvil_Backend_README.md.** Step-by-step to build and deploy the backend. This is your first task.
4. **Anvil_CopyBlocks_Coverage_and_Build_Order.md.** The roadmap after the backend, with the reasoning behind each piece.
5. **anvil.jsx.** The current app. It becomes `src/App.jsx`.
6. **api_generate.js** and **callClaude_patched.js.** The two code pieces the README tells you where to place.

## Before you start, install these

- Node.js, the LTS version, from nodejs.org.
- Git, and a GitHub account.
- A free Vercel account, for hosting.
- An Anthropic API key from console.anthropic.com. Treat it like a password.
- Claude Code, and a paid Claude plan (Pro, Max, Team, or Enterprise) or an Anthropic Console account to use it. The free plan does not work with Claude Code. The backend README shows how to install and launch it. Use it. It reads CLAUDE.md and does most of the setup with you.

## The efficient path: let Claude Code drive

You can run every command yourself, and the README lists them all. But the fastest way, and the one that matches how this project has been built, is to let Claude Code do the setup while you review each step.

1. Create an empty folder, run `git init`, and drop in all the files from the list above.
2. Open Claude Code inside that folder.
3. Tell it: "Read CLAUDE.md and Anvil_Backend_README.md, then build the backend and get it running locally with vercel dev. Use plan mode first and show me the plan before you execute."
4. Read its plan, approve or adjust, then let it work. Watch the diffs. Approve changes as they land.

If you would rather do it by hand, the README has the exact commands. Either way the destination is the same.

## Your first task: deploy the backend

This is one task with two checkpoints. The first is a quick confidence check. The second is the actual finish line. Do not stop at the first.

Checkpoint 1, the spine works (local):
- `vercel dev` runs with no errors.
- The app opens in your browser.
- You fill in an offer, click generate, and real ad copy comes back.

When that ad appears, the whole spine is wired correctly: the project, the component, the function, and the key are all working together. That is your signal you are on track. You are not done. Next, deploy it.

Checkpoint 2, it is live (the finish line):
- The API key is only in `.env.local`, which is gitignored, and nowhere in `src`.
- The repo is pushed to GitHub and imported into Vercel.
- The app's `ANTHROPIC_API_KEY` is set in Vercel project settings.
- The deployed URL loads and generates an ad.

The task is done when checkpoint 2 is true, the live URL generating an ad, not when the local one does. Once it is live, open the coverage and build-order doc and start P1, which begins with the proof engine.

## The three non-negotiables

These are in CLAUDE.md in full. They matter enough to repeat here.

1. **The key stays on the server.** Never put the Anthropic key in `src` or anywhere the browser can read it. This is the whole reason the backend exists.
2. **Do not weaken the safety rules.** The compliance gate for regulated clients and the voice caps are load-bearing, not polish. If a change would make it easier to produce risky claims, stop. Ask before touching them.
3. **Validate after every change.** Run `npm run build`, and make sure no em-dashes crept into the code or copy. Review the diff before it lands.

## How to work, day to day

- Use Claude Code's plan mode for anything bigger than a small edit. Propose, review, approve, execute.
- Make small changes and validate each one. Do not batch ten changes and hope.
- Anvil is the fast first part of a human's process, not the whole job. Words are a smaller lever than the offer, the creative, the audience, and the landing page. Keep that in mind so the tool stays honest about what it does.

## If you get stuck

- Run `claude doctor` if Claude Code itself misbehaves.
- The README has a troubleshooting section, and the real test of the backend is your first `vercel dev` run. If it errors, paste the error to Claude Code and let it fix it.
- If you are ever unsure whether a change crosses a safety line, that is the moment to ask, not to ship.

Welcome aboard. Start with CLAUDE.md, then the backend README. The backend is a clean, contained first task with a clear finish line. Ship that, and the roadmap takes you from there.
