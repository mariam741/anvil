# Anvil Feature Spec: Segments and Angle Multiplication

Date: July 1, 2026
Status: P1. The segment builder is the spine upgrade, item 10. Angle multiplication extends the Curiosity engine, item 11.
One line: replace the single avatar step with a real audience-slicing method, then turn each fact it produces into many candidate hooks, with the trust-market caps and the find-do-not-install rule built in.

## Why this exists

Anvil's depth all reads from one place, the avatar. Today that is a single step, so the quality of everything downstream is capped by how good that one input is. The source material includes a full slicing method and an angle engine that sit underneath the templates and feed them. Porting both turns the weakest link, the spine, into a strength, and gives the Curiosity engine a disciplined way to generate many angles from one fact.

Two rules govern the whole spec, and they are the trust-market guardrails:
- The compliance gate and voice caps apply to everything here. Hype-leaning angle families are capped for trust voices and off for the heaviest tier.
- Find, do not install. Echo a belief the customer already holds. Never install a belief they do not. This is the line between honest persuasion and manipulation, and it is non-negotiable for dental, roofing, and faith clients.

## Part 1. The segment builder (WHAT, WHO, WHY)

Replace the single avatar step with three layers. A segment is one outcome, crossed with a demographic, crossed with a facet or two.

**WHAT they want, the outcomes.** The end state they are buying, a pain gone or a result wanted, not the mechanism. Sort by want, never by type. Push past the mechanism to the thing they would feel. Aim for four to seven outcomes. A mechanism can graduate into an outcome only when the market lives in it and would say the word out loud.

**WHO they are, the demographics.** Traits a stranger could tick from across the room. Ask buyer first, since the payer may not be the user, and getting that wrong aims every later ad at the wrong face. Then gender, age as life stage, race or ethnicity only where it changes the product's job, and visible identity facts.

**WHY they are here, the facets.** What is going on inside. Five families: belief (a theory already in their head, controls the argument), identity (a chosen self-label, controls vocabulary and hard-nos), state (what is true right now, controls the problem you lead with), value (what matters in the buy, controls the promise), and occasion (the event that put them in-market, controls the why-now).

Two tests apply at every layer:
- The say-it test. Would a real customer say this out loud.
- The gate. Only make a slice if it would need a meaningfully different ad. If two slices run the same ad, merge them.

**The power move is stacking.** Any real person holds one facet from each family at once. Stack two and you find a pocket nobody targets. Stack three or more and you have described one person in a forum thread, with no volume. A stack is real only if enough people sit in it and it needs a different ad than either facet alone.

**The biggest trap is belief.** Write the customer's belief, not the marketer's. You find beliefs, you do not install them. This is the same rule as the governing find-do-not-install rule above, applied to the belief facet specifically.

The output is a small set of named segments, each a coordinate of outcome plus demographics plus facets, with a one-line description. These become the spine the proof, constraints, curiosity, and angle layers all read from.

## Part 2. Angle multiplication

Once a segment produces facts, one fact becomes many hooks. This is the disciplined version of the Curiosity engine. The principle: you do not change minds with new information, you change how people attend to information they already have. One fact, wrapped in different angles, is many psychological entry points.

Nine angle families:
- Discovery and revelation. New discovery, lost wisdom, missing piece, root cause, paradox.
- Temporal and urgency. Breaking news, trend, future warning, countdown, before and after.
- Authority and credibility. Expert, insider, crossover expert, unlikely teacher, regional.
- Conflict and controversy. Contrarian, myth-busting, David versus Goliath, vindication.
- Narrative and story. Case study, journey, cautionary tale, redemption arc, documentary.
- Analytical and logic. Comparison, test, reverse engineering, elimination, diagnostic.
- Social and identity. Tribal, class secret, generational, movement.
- Emotional and psychological. Confession, permission, protective, pattern interrupt.
- Problem reframe. Wrong question, almost worked, what went wrong, which type are you.

The flow: take a fact from the segment, generate several angle variants across families, and present them for the operator to judge. Anvil widens the field, the operator picks what lands. The tool never declares a winner.

**The caps, applied here specifically.** Several angle families pull hard toward hype and fabricated claims: conspiracy and hidden framing under conflict, breaking-news and countdown under temporal, fabricated-authority framing under authority. For trust voices these are capped, and for the heaviest compliance tier they are off. The safe, strong families for trust markets are analytical (comparison, test, diagnostic), narrative (honest case study, cautionary tale), and problem-reframe. Anvil should prefer these when recommending for a regulated or local client.

## How it connects to the rest

- The segment builder is the spine. The proof engine, the constraints dissolve, the curiosity engine, and angle multiplication all read from it. Improving it raises the ceiling on all of P1.
- Angle multiplication feeds the structure library. A chosen structure is a block sequence, and angle multiplication supplies the candidate hooks that fill the curiosity slots.
- Awareness stage filters both. A segment plus an awareness stage tells Anvil which angles and which structures fit, since a cold unaware buyer and a most-aware buyer need different entry points.
- Review and forum mining (build order item 20) feeds the segment builder real buyer language, so the spine runs on voice-of-customer rather than guesswork.

## Guardrails, gathered in one place

- The compliance gate applies to every segment and every angle. Regulated clients see the safe families only.
- Find, do not install. Echo existing beliefs. The belief-install, uninstall, and replace tooling from the source is deliberately left out for trust markets.
- No fabricated mechanisms, statistics, or authorities enter a segment or a hook. The segment stores the customer's real language and the client's real facts.
- Stacking stops at two facets for real pockets. Three or more is a no-volume trap, not a segment.

## Build order placement

- Segment builder: P1 item 10. Dependency: avatar. The highest-value single upgrade, since it is the spine.
- Angle multiplication: P1 item 11. Dependency: Curiosity engine and segment builder.
- Fed later by review and forum mining, P3 item 20, and carried by the two-call avatar chain, P3 item 19.
