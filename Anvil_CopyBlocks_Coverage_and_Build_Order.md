# Anvil x Copy Blocks: Coverage Map and Build Order

Date: June 26, 2026
Purpose: Map the full Copy Blocks system (the source course) against what Anvil implements today, mark every piece, and turn the gaps into a sequenced build order for the next version.

## How to read this

Status legend:

- **KEPT**: implemented well, in spirit and depth.
- **PARTIAL**: present as a label or a one-line signpost, but the actual machinery is missing.
- **DROPPED**: not in Anvil at all.
- **HYPE**: present, but it carries the source's supplement and biz-op DNA and must be cut or capped for trust markets.
- **ADDED**: Anvil built it beyond the source.

Trust markets = dental, roofing, faith-based, K-12, local SMB. The source's native voice is built for supplements and money-making offers. Anything ported in must be reframed for trust markets, which means capping how outlandish it can get and killing taboo and shock devices.

---

## Quick scorecard

Anvil today captures the skeleton of Copy Blocks and roughly a fifth of the depth. It keeps all six blocks by name, the polish pass, the velocity metric, and the templates. It drops almost all of the craft machinery that makes the system hard to copy: the proof taxonomy, the constraint-dissolving framework, and the entire curiosity engine. It also adds real value the source never had: the avatar, placement-aware output, A/B sets, the voice safety layer, and an offer-finding front door.

The strategic point from the pressure test holds. The depth Anvil dropped is the only thing that separates it from raw ChatGPT and from the originators, who already sell AI bots trained on this same framework. Porting that depth, safely, is the prize.

---

## 1. Governing principles (deck p2)

| Principle | Status | Note |
|---|---|---|
| Clarity comes first | PARTIAL | The Plain and credible voice enforces plainness. Good, keep it. |
| 80 percent science, 20 percent art | Implied | Anvil leans fully automated. Fine, but the human-in-the-loop posture should be explicit in the UI. |
| Throw away the ladder (do not optimize the score) | **VIOLATED** | The source explicitly says chasing a Copy Velocity number means you missed the point. Anvil turned it into scored tiers. This is the clearest correction to make. |

---

## 2. Coverage by block

### Pain (deck p4)
| Element | Status | Port note |
|---|---|---|
| "The thing they do not want" | KEPT | Avatar pains feed this. |
| Pain Chain, 4 rungs (general view, specific aspects, how it shows up in life, deep emotion) | PARTIAL | Anvil signpost says "layered pain" but does not build the 4 rungs. Make it a real 4-step builder. |

### Promise (deck p6)
| Element | Status | Port note |
|---|---|---|
| "The thing they want" | KEPT | Avatar dreamOutcomes feed this. |
| Promise Ladder, 4 rungs (parallel to Pain Chain) | PARTIAL | Same as Pain. Label only. Build the rungs. |

### Proof (deck p8-9)
| Element | Status | Port note |
|---|---|---|
| Proof follows the claim (Proof Braid, "siamese twin") | DROPPED | Auto-pair each proof to the claim it backs. |
| Proof Balance Scale (big promise needs big proof) | DROPPED | Weight proof to the size of the promise. |
| 22 proof types across 5 categories | DROPPED | This is the single richest dropped asset. Make proof types selectable, pulling from avatar proofTrusted and proofGaps. |
| Rule: harder to fake is stronger; experiential strongest; psychological most underused | DROPPED | Bake the ranking into the picker so it nudges toward stronger proof. |

The five categories for reference: Psychological (5), Experiential (6), Empirical (3), Credible (5), Social (3).

### Constraints (deck p11-13)
| Element | Status | Port note |
|---|---|---|
| Beliefs, values, identity objections | PARTIAL | Avatar captures objections and beliefs. Not yet used as a structured block. |
| The 3 big constraints (Money, Time, Effort) | KEPT | Avatar carries the constraints object. |
| Resonance Hierarchy (Experiences to Beliefs to Values to Identity; side-step value and identity) | DROPPED | Use it to decide when to avoid an objection versus dissolve it. |
| A.W.E. framework (Acknowledge, Wedge, Elaborate) to dissolve a belief | DROPPED | This is a genuine differentiator. A normal prompt does not do AWE. Build it as a guided dissolve. |

### Curiosity (deck p15-21): the engine of good hooks, and the most dangerous to port raw
| Element | Status | Port note |
|---|---|---|
| Idea plus Frame (what you say, how you present it) | PARTIAL | Anvil generates hooks but does not separate idea from frame. |
| Curiosity = the gap between Pain and Promise | PARTIAL | Implicit. Make it explicit in the generator. |
| Curiosity Quadrant (market vs your view, problem vs solution; general vs specific) | DROPPED | The best structured angle generator in the system. Build it. Pulls from avatar marketAngles. |
| Epiphany Threshold, insight dial 0-10 (goldilocks 6-9) | PARTIAL, HYPE | Anvil has "insight level." The dial is fine as a concept but must be capped low for trust markets. Never expose a "go more outlandish" control to a dental account. |
| 58 frames; the 3 favorites (Quiz, WMTD, Taboo Solution) | DROPPED, partly HYPE | Quiz and WMTD frames are safe and useful. Taboo Solution frames are HYPE. Port the safe frames, forbid taboo for regulated and local. |
| Characterizations (naming a mechanism or system) | DROPPED | Strong and safe when reframed. "Same-day roof report" not "weird roofer trick." |
| Intuition Pumps (natural, mechanical, force, association metaphors; market-specific) | DROPPED | Safe and high value. Build a market-aware metaphor helper. |
| Evocative Naming (how much the name reveals) | DROPPED | Safe. A naming-tuning helper. |
| Anti-Constraints (bake objection handling into the name) | DROPPED | Safe and smart. Ties to the Constraints block. |
| Idea Caricatures (stretch a core idea via loose associations) | DROPPED, HYPE risk | Powerful for hooks, but this is exactly the machine that produced "tribal dragon berry." Port with a hard outlandish cap and a compliance gate. |

### Conditions (deck p23, bonus)
| Element | Status | Port note |
|---|---|---|
| 5 types: Qualifications, Conversion Triggers, Risk Reversal, Value Adds, Terms and Structures | PARTIAL | Anvil treats Conditions as one "offer wrapper" signpost. Break it into the 5 named types, each a small picker. |

---

## 3. Cross-cutting tools

| Tool | Status | Note |
|---|---|---|
| Copy Blocks Equation (Promise x (Proof x Curiosity) / Constraints x Conditions = Value) | DROPPED | This is Hormozi's value equation reframed. It is offer-centric, which is the top lever. Use it as the spine of the offer-strength check, not as a number on screen. |
| C.R.A.V.E.S. polish (Clear, Relevant, Accurate, Visual, Expressive, Specific) | KEPT | Anvil's "Polish." Good. |
| Copy Velocity = (blocks / words) x 100 | KEPT, but **MISUSED** | Anvil's "Block Density," gamified into tiers. The source says do not optimize it. De-gamify. |
| Helicopter and canyon metaphor | N/A | Mnemonic only. Nothing to build. |

---

## 4. What Anvil added beyond the source (keep all of it)

| Addition | Why it matters |
|---|---|
| Buyer avatar and research pass | The source pushes avatar research to a separate paid product. Anvil fills that gap. This is real differentiation. Pasted market language is the part the free incumbents cannot replicate from your inputs. |
| Placement-aware output (Meta, TikTok, YouTube Shorts, Google RSA with validation) | The source is placement-blind. |
| A/B test lab | Teaches test-one-variable discipline. |
| Voice safety layer (3 voices) | Load-bearing. It is the gate that stops the source's hype DNA from reaching a dental or faith client. |
| Step 0 offer finder | Offer is the top lever. This is the most valuable single thing Anvil does. |

---

## 5. Build order

Priority is leverage times safety, sequenced by dependency. Effort is rough: S is hours, M is a day, L is multiple days.

### P0. Corrections (do first, small, high integrity)

1. **De-gamify Block Density.** Relabel to "Coverage." Remove the Loose, Building, Strong, Elite ladder and any achievement framing. Show it as a neutral diagnostic with a one-line note that it is a thinking aid, not a quality score. Effort: S. Dependency: none. Source-mandated.
2. **Hard safety caps on the hype dial.** Cap the insight and caricature outlandishness for the Plain and credible voice. Forbid Taboo Solution frames and shock characterizations for local and regulated. Add a compliance gate for health, legal, and financial claims that blocks generation until acknowledged. Effort: M. Dependency: none. This must land before any Curiosity depth ships.

### P1. Depth that differentiates (the prize), ported safe

3. **Proof engine.** The 22 types across 5 categories as a picker, ranked by "harder to fake is stronger," with the Proof Braid pairing each proof to its claim and the Balance Scale matching proof weight to promise size. Feeds from avatar proofTrusted and proofGaps. Effort: M to L. Dependency: avatar. Highest quality lift with lowest safety risk.
4. **Constraints dissolve.** Resonance Hierarchy logic to decide avoid versus dissolve, plus an A.W.E. builder (Acknowledge, Wedge, Elaborate). Feeds from avatar objections, beliefs, triedBefore. Effort: M. Dependency: avatar. Strong differentiator, safe.
5. **Curiosity engine.** Curiosity Quadrant angle generator, Characterizations, Intuition Pumps (market-aware metaphors), Evocative Naming, Anti-Constraints, and Idea Caricatures, all behind the P0 caps. Effort: L. Dependency: P0 caps, avatar. Biggest quality lift, highest safety risk, do not ship before P0.
6. **Pain Chain and Promise Ladder as real builders.** Turn the two labels into 4-rung guided structures. Effort: M. Dependency: none.
7. **Conditions split.** Break the single Conditions signpost into the 5 named types, each a small picker. Effort: S. Dependency: none.

### P2. Beyond the source: the bigger levers (from the pressure test)

8. **Close the loop.** Let the user paste back ad results so Anvil proposes the next test. This turns a generator into an optimizer and is the only feature here that compounds. Effort: M to L. Dependency: backend (P3) for storage. Highest strategic value.
9. **Offer-strength check.** Upgrade Step 0 to score and tighten the front-door offer against the value equation before any copy is written. Effort: M. Dependency: none.
10. **Lever checklist.** Add a short landing-page and speed-to-lead checklist plus a sharper creative brief, so the tool stops implying copy is the whole job. Effort: S. Dependency: none.

### P3. Platform enablers

11. **Backend and web app.** A small serverless proxy holds the API key, removes the 1000-token artifact cap, and adds auth, rate limiting, and a usage table. Effort: M. Dependency: none, but it unblocks the quality ceiling for P1 and the storage for P2.
12. **Two-call avatar chain.** Split the avatar into two richer calls so it stops truncating and carries real depth. Effort: M. Dependency: backend recommended so each call has room.

---

## 6. Sequencing and dependencies

- P0 is independent and immediate. Do it now. It costs almost nothing and fixes the one thing the source explicitly warns against, plus the safety gap.
- P1 depth wants more tokens per call than the 1000-token artifact cap allows. The proof picker, the AWE builder, and the curiosity engine all generate more structured output. So the backend in P3 should land before or alongside P1 for full quality. If you stay in the artifact for now, ship P1 in smaller multi-call steps.
- The avatar is the spine. Proof, Constraints, and Curiosity all read from it, so the avatar chain (P3 item 12) raises the ceiling on all of P1.
- Close the loop (P2 item 8) needs storage, so it follows the backend.

## 7. One-paragraph recommendation

Do P0 this week. It is the cheapest, most honest work and it removes the two things that undercut the tool's credibility: a gamified metric the creators told you not to chase, and an unguarded hype dial in trust markets. Then decide the platform question. If Anvil is going to be a real rung in the Operator ladder, build the backend (P3) and use the freed token budget to port the depth in P1, which is the only path that separates Anvil from both ChatGPT and the framework's originators. Keep P2 in view the whole time, because the loop and the offer check are where the actual money lever lives, above the copy.
