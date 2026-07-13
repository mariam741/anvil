# Anvil data-intent map, for the Forge Market merge

Date: July 3, 2026
From: Sabeel, prepared for Breyden
Purpose: natural-language data intents for the upcoming Anvil build pieces, so you can decide fit against existing Forge tables versus new ones. Intents only, no schema. The model and the provisioning lanes are yours. Mariam is holding DB integration per your note.

One framing note before the list. Most of these pieces are not their own tables. They are attributes of a small number of real entities: the segment, the generation, and the result. Writing a table per feature would force a collapse later, so this map is grouped by the real entity, and each piece is flagged as its own entity, a child of one, or an attribute of one. Three entities look new, segments, generations, and results, plus two reference or training stores, structures and calibration, and a compliance record that hangs off a generation.

---

## 1. Segment map, likely its own cluster

Intent: capture how a brand's market is sliced, and which personas were composed from it, so any downstream generation can target one persona.

What it holds, in plain terms:
- Scope: which brand or client this map belongs to. A brand has many segments over time.
- Outcomes: the WHAT. Each outcome has a name, a primary lens (type, location, function, moment, or severity), and a set of sub-outcomes. Sorted by want, not by type.
- Demographics: the WHO. Named groups (buyer, gender, age, race or ethnicity, identity) each holding a set of values.
- Facets: the WHY. Five families (belief, identity, state, value, occasion) each holding a set of values.
- Personas: composed selections. Each persona is a coordinate of one outcome plus chosen demographics plus one or two facets, with a generated name and a one-line description.

Shape note: this is relational by nature, a brand has many segments, a persona references outcome plus demographics plus facets. It could also live as a brand-scoped document if you prefer document over relational. Your call. It is the spine, so whatever it lives in, generations need to reference a persona from it.

## 2. Generation, likely its own table, and the parent of most other pieces

Intent: capture one act of generating creative and everything that shaped it, so it can be reviewed, reused, and later measured.

What one generation ties together:
- The target: which persona or segment it was generated for.
- The inputs: the offer, the objective, the voice, the awareness stage, the platform.
- The chosen structure: which named structure from the library was used.
- The output: the blocks produced and the finished ad or asset variants.
- Provenance: who generated it and when.

Flag: the next several roadmap pieces are attributes or child rows of a generation, not tables of their own. Listing them so the fit is clear:

- Proof engine output: which proof types were selected and how they were placed. A child of the generation, not its own table.
- Curiosity and angle output: the angles generated and which the operator chose. A child of the generation.
- Constraints handling: which objections were addressed and how. An attribute of the generation.
- Pain and promise rungs: the built structures. Attributes of the generation.
- Awareness stage: a single field on the generation, drawn from a fixed set of five.

## 3. Result, likely its own table, this is the loop

Intent: capture measured results against a generation or a shipped ad, so the tool can learn and rank what worked.

What it holds:
- Which generation or which specific ad variant it refers to.
- The metric pasted back by the operator, and the outcome.
- Any next-test suggestion produced from it.
- When it was recorded.

Note: this is the entity that makes close-the-loop and the eventual structure ranking possible. It is also the natural join point for the parked create-manage seam later, since a manage-side tool would write results here.

## 4. Structure library, reference data, shared, not per brand

Intent: hold the catalog of ad and email structures the engine can choose from.

What it holds:
- The 28 named structures, each as a block sequence.
- Tags per structure: awareness stage it fits, channel, and claim-risk level.

Shape note: this is a fixed catalog shared across all brands, so it reads as a lookup table or static config, not per-brand user data. A generation references a structure from here.

## 5. Calibration, training data, deliberately walled off

Intent: capture an operator's judgment-training reps, kept separate from production.

What it holds:
- Which operator.
- Each drill: the angles shown, the operator's pre-reveal choice, and the reveal.
- Convergence over time, as a training signal.

Canon note, worth carrying into the model: this never touches production and never scores real ads. It should not be joinable to generations as a quality score. Its own small store, isolated by design.

## 6. Compliance preflight, mostly a check, plus a small audit record

Intent: record the compliance review and human acknowledgment for a generation, which also gives the human-in-the-loop paper trail trust markets need.

What it holds:
- Which generation.
- What was flagged by the rule check.
- What the human reviewer acknowledged, and when.
- A reference to the rule set or version used.

Shape note: the rules themselves are reference data. The review outcome is a field or child record on the generation, not a standalone entity.

---

## Summary for the fit-versus-new call

- New entities that look like their own tables: segment map (or cluster), generation, result.
- Reference or training stores: structure library (shared catalog), calibration (isolated training).
- Attributes or child rows of a generation, not new tables: proof output, curiosity and angle output, constraints handling, pain and promise rungs, awareness stage, and the compliance review record.

Most of the roadmap is attributes of a generation, which should keep the new-table count low and make the Forge Market fit cleaner. Over to you on how these map to existing tables and the provisioning lanes.
