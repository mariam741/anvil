# Anvil Feature Spec: Calibration Mode (Train the Feelers)

Date: June 28, 2026
Status: P1-adjacent. Build it alongside the Curiosity engine, since it reuses the same generation and the same block and insight structure.
One line: a practice mode that trains an operator's judgment, their feelers, instead of replacing it.

## Why this exists

The creative strategist's moat is taste, the human read of what lands. That cannot be offloaded to Anvil without deleting the moat and handing the advantage to the ad platforms, which already predict performance from real spend data. But the course thesis is right that taste is trainable. No competitor and no platform offers to train it. So the move is not to make Anvil judge, it is to make Anvil a coach that builds the operator's judgment over reps. This deepens the moat instead of dissolving it.

## What it is

A short, repeatable drill inside Anvil. The operator is shown two or three angles for a real brief and asked which one lands, before anything is revealed. Then Anvil shows the hidden structure under each, the blocks present, the insight level, the proof match, the avatar fit, so the operator learns to see what they were only sensing. Over many reps, their gut and the structure converge.

The key design rule: the operator commits to a feeling first, with no score visible. The explanation comes after the commit, never before. If a number shows up first, the operator anchors on it and stops training their own read. That is the same trap as the old gamified metric, so the order is load-bearing.

## The flow

1. Pick a brief. Use the current buyer and offer, or a built-in practice set.
2. Anvil generates 2 or 3 angles for the same brief, varied on one dimension, for example insight level or proof strength.
3. The operator picks the one that lands, by feel, before any analysis is shown. Optionally a one-line why.
4. Reveal. Anvil shows the structure under each angle and names what differs.
5. Anvil does not declare a winner. It explains the tradeoffs, since the best angle depends on the market and the moment. Where there is a defensible read, it says so as a perspective, not a verdict.
6. Track convergence over reps, see below.

## What it teaches, mapped to the system

Each drill targets one lever from the framework so the operator builds a specific muscle:
- Insight level: tell a flat angle from an interesting one from an unbelievable one. The goldilocks read.
- Proof match: feel when a big promise is missing the big proof to carry it.
- Avatar fit: feel when an angle speaks to the real buyer versus a generic one.
- Voice and compliance: feel when a hook crosses into hype or a banned frame for a trust market.

## Measuring progress without gamifying it

This is the delicate part, because a training tool wants a progress signal and a progress signal wants to become a score to chase.

- Track the operator's reads over time and show convergence, how often their pre-reveal feel matches the structural read, trending across sessions.
- Frame it as calibration, not a grade. The number measures the operator's growing judgment, not the quality of any ad. It is a learning signal, and it never touches the live generation flow.
- Never surface a calibration number on a real ad. It lives only in practice mode. Real ads carry no judgment score, by canon.

## Guardrails

- Anvil never makes the final creative call, in practice or in production.
- Reveal always follows the operator's committed feel, never precedes it.
- No verdicts. Anvil explains tradeoffs and offers a perspective where defensible.
- Calibration progress is a training signal, isolated from production. It is not the coverage metric and not a quality score.
- Trust-market voice caps apply to the practice angles too, so the operator trains on compliant material.

## Why it is P1-adjacent

It reuses the Curiosity engine's generation and the block, insight, proof, and avatar structures. Build the Curiosity engine first, then this drill is a thin layer on top that presents the same machinery as a coach instead of a generator. Low extra cost, high strategic value.

## What it is worth

- It is a moat-deepening feature. It makes operators better at the one thing that cannot be automated, which makes your operators harder to replace and your platform stickier.
- It is an onboarding and filtering tool. New operators train their feelers fast, and you can see who has them. That serves the operator-filtering thesis directly.
- It is a differentiator no platform or hype course offers. They sell the role or they sell generation. None of them trains the judgment.

## Open questions for later

- Should calibration drills draw on real won-or-lost results once the loop is closed, so the coach learns from outcomes rather than structure alone. That is a stronger version, dependent on P2.
- Should there be a built-in practice library per niche, seeded from the swap layer, so operators train on their actual market.
