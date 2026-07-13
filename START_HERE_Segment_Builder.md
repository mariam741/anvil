# Start Here: Building the Segment Builder

Hi Mariam. Great work getting the backend live. This is your next build, and it is the big one, the change that takes Anvil from one avatar to many. This doc tells you what is included, what to build, the one boundary to respect, and what success looks like at each step.

## The one boundary, read this first

Breyden is landing the database tables for the Forge Market merge, so for this whole phase you build everything in memory, in the app's own state. Do not wire any of it to a database yet. When you reach a point where a segment or a persona should be saved and reloaded later, that is his step, not this one.

Two things make this painless:
- Build your in-memory data structures to match the shapes in the data-intent map (included below). That way, when Breyden lands the tables, swapping memory for real storage is a small change, not a rewrite.
- If you want your work to survive a page refresh while testing, add a temporary JSON export and import, or a local file. Mark it clearly as temporary. It is a scaffold, not the real storage.

One more, per Breyden's call: keep the vertical language and compliance rules (the allowed and forbidden words, the tone, the voice caps) in a separate config object, not hardcoded into the engine. Shape it so Anvil can later read a shared vertical language profile from the substrate. Same idea as the data shapes above, build against the contract now so the merge is a swap, not a rewrite.

If a task ever feels like it needs a database, stop and hold it. That is the signal you have reached Breyden's lane.

## What is included, and how to use each one

There are five files including this one. They are not all read the same way. Some you read cover to cover, one you keep open as a lookup, one you read only later. Here is the order and how to use each, so nothing gets read at the wrong time.

**1. This README. Read it fully, first.** It is the map. It tells you what to build, in what order, and where the line is. Start and end here.

**2. Anvil_Segments_and_Angles_Spec.md. Read Part 1 fully, next. This is your main reference.** It is the what and why of everything you are building this phase. Keep it open the whole time. Read Part 2, angle multiplication, once for context so you know what is coming, but do not build it yet.

**3. Anvil_Data_Intent_Map_for_Forge_Market.md. Do not read cover to cover. Use it as a lookup.** Open it when you reach Milestone 1 and are defining your in-memory data structures. Copy the segment and generation shapes from it so your structures match what Breyden will store later. It is a reference you dip into, not a document you read through.

**4. Anvil_Awareness_and_LongForm_Spec.md. Do not open this on day one. Open it at Milestone 3.** When you get there, read only Part 1 and the appendix. That is the awareness input that pairs with each persona. Skip Part 2, long-form, entirely for now. It is a later phase, and reading it early will make it look in scope when it is not.

**5. Anvil_CopyBlocks_Coverage_and_Build_Order.md. Optional, background only.** If you want to see where this fits in the whole plan, the segment builder is item 10, the spine everything else reads from. You do not need it to build anything. Read it if you are curious, skip it if you are heads-down.

Short version: read this, then Segments Part 1, build against the Intent Map as a lookup, open Awareness Part 1 at Milestone 3, and treat the Build Order as background.

## What you are building, and why it matters

Right now Anvil has one avatar. One buyer description goes in, one set of ads comes out. You are replacing that single step with a method that cuts one product into several distinct, real buyers, each with its own pain, its own proof, and its own hook, so each one gets its own different ad.

Here is the leap, made concrete. Take a dental practice selling implants. Today Anvil has one avatar, "people who want implants," and writes one generic implant ad. The segment builder splits that into distinct people:
- The retiree who wants to eat normally again and stop worrying about a denture slipping.
- The professional who is self-conscious in photos and in meetings.
- The person who has worn a failing bridge for years and is afraid of the procedure itself.

Same product, three real buyers, three different ads. Different pain to lead with, different proof that reassures each one, a different hook. That is the difference between a copy generator and a tool that understands a market.

Why this is the spine, and why it is the highest-value thing to build: every other part of Anvil reads from the segment. The proof engine picks proof for a specific buyer. The curiosity engine and angle work generate hooks for a specific buyer. The structures fill with a specific buyer's language. If the input is one flat avatar, everything downstream is generic. If the input is a set of distinct, real buyers, everything downstream gets sharper at once. This one change raises the ceiling on the whole tool.

And it is not easy to copy. A generic tool can produce one avatar from a prompt. What is hard is producing several real, non-overlapping buyers that each need a different ad, keeping the variety honest rather than cosmetic, and doing it with the trust-market guardrails on. The method below, the say-it test, the gate, the find-do-not-install rule, is what makes the variety real instead of fifteen reworded versions of the same ad. That discipline is the moat, and it is what you are building in.

Here it is in three milestones, each one building on the last.

## Milestone 1: The three input layers (WHAT, WHO, WHY)

This is where a market gets described richly enough to slice. The three layers are three different questions about the same buyer, and together they are complete, there is no fourth.

Build the inputs so a user can define:
- **WHAT they want, the outcomes.** The end state they are buying, a pain gone or a result wanted, sorted by want not by type. Sorting by want is the move that matters: pest control sorted by pest is wrong, nobody wants "less mosquito," but sorted by want, get them out, protect the house, get my backyard back, the same product shows up for two different buyers who need two different ads. Each outcome has a primary lens (type, location, function, moment, or severity) and a few sub-outcomes.
- **WHO they are, the demographics.** Traits a stranger could tick from across the room. Ask buyer first, since the payer may not be the user, a wife buying for a husband, an owner buying for the practice, and getting that wrong aims every later ad at the wrong face. Then gender, age as a life stage, race or ethnicity only where it changes the product's job, and visible identity facts.
- **WHY they are here, the facets.** What is going on inside, and the deepest layer. Five families: belief (a theory they already hold), identity (a chosen self-label), state (what is true for them right now), value (what matters in the buy), and occasion (the event that put them in-market).

Hold all of it in app state, shaped like the segment intent in the data-intent map.

**Checkpoint 1, success looks like:** you can enter a full WHAT-WHO-WHY for one product and see it held in state. You are not done. Next you turn these selections into personas.

## Milestone 2: Compose personas (one product becomes many avatars)

This is the milestone where one avatar becomes many, and it is the heart of the whole build. A persona is a coordinate: one outcome, plus demographics, plus one or two facets, with a generated name and a one-line description. Cross the retiree demographic with the "eat normally again" outcome and the "afraid of the procedure" state, and you have a specific person a specific ad can speak to.

The reason this produces real variety and not cosmetic duplicates is the two rules. Apply them at every step:
- **The say-it test.** Would a real customer say this out loud. If not, it is a marketer's abstraction, not a buyer.
- **The gate.** Only keep a persona if it would need a meaningfully different ad. If two would run the same ad, they are the same persona, merge them.

The power move is stacking. Any real person holds one facet from each family at once. Stack two and you find a pocket nobody targets, the vegetarian who just had a baby, the lifter who just turned fifty. Stack three or more and you have described one person in a forum thread, with no volume, so block that. A stack is real only if enough people sit in it and it needs a different ad than either facet alone.

**Checkpoint 2, success looks like:** one product produces several distinct, named personas on screen, each one a buyer you could picture and write a different ad for. This is the moment Anvil goes from one avatar to many. Holler when you hit this one, it is the milestone worth a look together. You are not done. Next you make each persona produce its own ads.

## Milestone 3: Each persona generates its own ad set (end to end)

This is the payoff, where the many buyers become many different ads, not one ad reworded. Wire each persona into the existing generation flow, so it produces its own ads shaped by that persona's outcome, facets, and awareness stage. The retiree persona should lead with a different pain and a different proof than the afraid-of-the-procedure persona, because the segment feeding the generator is different. Follow the generation shape in the data-intent map, target persona, offer, objective, voice, awareness, output, all in memory.

Awareness stage is the small sibling input here. Read Part 1 and the appendix of the awareness spec so you know how a persona plus an awareness stage changes which block leads and how direct the call to action is.

**Checkpoint 3, success looks like, and this is the finish line for the phase:** pick a persona, generate, and get ads written for that specific persona. Pick a different persona, get different ads. Multiple avatars, multiple distinct ad sets, all in one session.

## Rules to carry from the specs, non-negotiable

These are what keep Anvil safe for trust markets like dental and faith. Build them in from the start, not later.

- **Find, do not install.** Echo a belief the customer already holds. Never invent one. Write the customer's belief, not the marketer's.
- **A few strong slices beat many fake ones.** The gate and the say-it test are how you avoid fake variety. When unsure, ask "would this need its own ad?" If no, merge it.
- **Compliance caps stay on.** No fabricated mechanisms, statistics, or authorities ever enter a segment or a hook. For trust clients, prefer the safe angle families, analytical, honest narrative, and problem-reframe.
- **The human judges, the tool proposes.** Anvil widens the field and pre-sorts. The operator picks what lands. Never show a score that implies the tool chose the winner.

## Where to go for detail, and what to skip for now

- Full detail on every layer is in the segments spec. It is your main reference.
- Angle multiplication (item 11) comes right after this. You can leave room for it, but do not build it yet.
- Anything about saving to a database is Breyden's next step. Build in memory, shaped to the intent map.

Take it one milestone at a time, and holler at Checkpoint 2. That is the one that shows the whole idea working.
