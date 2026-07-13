# Anvil Feature Spec: The Structure Library

Date: June 28, 2026
Status: P2. An extension of the Curiosity engine and the awareness stage work.
One line: turn the named ad and email templates into a library of block sequences the user can pick from or have Anvil recommend, filled with the operator's own compliant copy, never the source's.

## What this is, and the copyright line that governs it

The source course ships 28 named templates, 14 for ads and 14 for emails. Each one is a fixed skeleton: a sequence of persuasion moves, plus three worked examples. The skeleton is a pattern. A sequence of moves is not protectable. The example copy is the source's work, and we never reproduce it, paraphrase it closely, or import it.

So the library stores the structure, which is the asset, and never the claims, which are the liability. Every example in those files uses a fabricated mechanism, a fabricated statistic, or an invented authority. The email file says so in its own words. Anvil takes the ordering and discards the copy. The operator's real, compliant blocks get poured into the chosen structure.

Each entry is defined by five fields and nothing else: a name, a block sequence, a one-line intent, the awareness stage it fits, and a claim-risk flag.

## Block shorthand

The six blocks are Pain, Promise, Proof, Constraints, Curiosity, and Conditions. Conditions is the offer wrapper and the call to action. Curiosity is the hook and the reframe. Awareness stages are Unaware, Problem, Solution, Product, and Most aware.

Claim risk marks how strongly the structure pulls toward fabricated claims. Low is safe to suggest anywhere. Med needs the compliance gate. High is off by default for the heaviest compliance tier and never auto-suggested for regulated clients.

## Ad structures (14)

| Structure | Awareness | Block sequence | Intent | Claim risk |
|---|---|---|---|---|
| Before and After | Solution, Product | Curiosity (contrast hook), Pain, Curiosity (turning point), Proof, Promise, Conditions | Show a vivid contrast between the old state and the new | Med |
| Insider Reveal | Problem, Solution | Curiosity (exclusivity hook), Curiosity (hidden info), Proof, Promise, Conditions | Frame the offer as privileged knowledge | High |
| Framework Introduction | Solution | Curiosity (complexity contrast), Pain (overwhelm), Promise (simplicity), Curiosity (named system), Proof, Conditions | Turn chaos into one named, simple system | Low |
| Quick Win | Solution, Product | Curiosity (speed hook), Pain, Curiosity (mechanism), Proof, Promise, Conditions | Promise one fast, concrete first result | Med |
| Industry Authority | Solution, Product | Pain (recognition gap), Promise (authority), Proof, Conditions (timeframe) | Sell the path to being recognized in a field | Low |
| Hidden Cost | Problem | Pain (invisible cost), Curiosity (cost revealed), Promise, Proof, Conditions (urgency) | Make an unseen, ongoing loss visible | Med |
| Identity Shift | Problem, Solution | Constraints (identity), Curiosity (reframe), Pain, Promise, Proof, Conditions | Reframe the problem as an identity mismatch | Med |
| Pattern Interrupt Question | Unaware, Problem | Curiosity (question), Constraints (old belief), Curiosity (true problem), Promise, Proof, Conditions | Shatter an assumption with one question | Med |
| Overlooked Factor | Problem | Curiosity (missing element), Curiosity (hidden cause), Constraints (not your fault), Promise, Proof, Conditions | Reveal the one factor that explains the stall | High |
| Bottleneck Breakthrough | Problem, Solution | Curiosity (bottleneck), Constraints (not your effort), Curiosity (mechanism), Promise, Proof, Conditions | Name the single obstacle blocking results | High |
| Effortless Pivot | Solution | Curiosity (tiny change, big result), Pain (complex failures), Proof, Curiosity (mechanism), Constraints (effort), Conditions | One small change unlocks a big outcome | Med |
| Future Self Regret | Product, Most | Curiosity (future reflection), Pain (regret), Promise (celebrated future), Proof, Conditions (urgency) | Project the reader forward to avoid regret | Low |
| Insider-Outsider Contrast | Solution, Product | Curiosity (elite contrast), Constraints (status), Curiosity (insider method), Promise, Proof, Conditions | Show the gap between how elites and amateurs do it | High |
| Resource Maximizer | Problem, Solution | Constraints (time, money, energy), Promise (more with less), Proof, Curiosity (mechanism), Conditions | More result with less of the scarce resource | Med |

## Email structures (14)

| Structure | Awareness | Block sequence | Intent | Claim risk |
|---|---|---|---|---|
| Shocking Discovery | Unaware, Problem | Curiosity (discovery), Curiosity (hidden cause), Proof, Promise, Constraints (eliminate), Conditions | Open on an unexpected discovery that reframes the problem | High |
| Contrarian Interruption | Problem, Solution | Curiosity (pattern interrupt), Constraints (old belief), Curiosity (hidden cause), Proof, Promise, Conditions | Challenge a widely held belief, then offer the better way | Med |
| Show Don't Tell Proof | Problem | Proof (a test or demo), Pain (problem link), Curiosity (solution), Promise, Conditions | Prove it with a test the reader can run now | Low |
| Constraint Crusher | Problem, Solution | Constraints (limitation to advantage), Proof, Promise, Curiosity, Conditions | Flip the biggest objection into the advantage | Low |
| Resource Rebel | Problem | Constraints (relatable limit), Curiosity (story, alt approach), Proof, Promise, Conditions | A realistic story of working around a limit | Low |
| Pain Tokenization | Problem | Pain (specific tokens), Curiosity (interrupt), Curiosity (hidden cause), Proof, Promise, Conditions | Name the pain in daily detail, then explain it | Med |
| Pain Pivot | Problem | Pain, Curiosity (pivot), Promise, Proof, Conditions | Resonate with a pain, then pivot to hope | Med |
| Impossible Promise | Solution, Product | Promise (bold), Curiosity (mechanism), Proof, Constraints (eliminate), Conditions | Lead with an audacious but explained promise | High |
| Future Reality | Product | Promise (future state), Curiosity (mechanism), Proof, Constraints (eliminate), Conditions | Paint the achieved future, then bridge to it | Med |
| Identity Shift (email) | Problem, Solution | Constraints (identity), Curiosity (interrupt), Promise, Proof (social), Pain, Curiosity (mechanism), Conditions | Address the limiting self-belief, then the new identity | Med |
| Hidden Opportunity | Solution | Curiosity (opportunity), Promise, Pain (missing out), Proof, Constraints (eliminate), Conditions | Reframe around an overlooked opportunity | High |
| Expert Revelation | Problem | Proof (credentials), Curiosity (interrupt), Pain (cause), Curiosity, Promise, Constraints, Conditions | Lead with real authority, then the surprising cause | Med |
| Recovery Story | Unaware, Problem | Pain (story), Constraints (hopeless), Curiosity (solution), Proof (transformation), Promise, Conditions | A first-person recovery arc, long form | Med |
| Daily Ritual Transformation | Solution | Curiosity (small action, big outcome), Curiosity (hidden mechanism), Proof (over time), Constraints (ease), Conditions | A small daily ritual that compounds | High |

## How it works in Anvil

1. The user picks a structure, or Anvil recommends two or three from the offer, the objective, and the awareness stage. Awareness is the main filter, since the table already maps each structure to where the buyer sits.
2. Anvil generates the chosen structure as a block sequence, filling each slot with the operator's real, compliant blocks from the avatar and the offer. It never uses the source's example copy.
3. The compliance gate applies as always. For regulated clients, High claim-risk structures are hidden or disabled, and the gate must be acknowledged before any structure generates.
4. Several structures are long form, the Recovery Story, the Shocking Discovery, the Daily Ritual. These route to the long-form output mode rather than a short ad, which is why this depends on that work.

## Safety notes specific to this library

- The structure is the only thing stored. No example copy, no fabricated mechanism names, no invented statistics, no borrowed authority figures.
- High claim-risk structures are the ones whose shape pulls hardest toward a fabricated mechanism or a fake proof. They are off by default for the heaviest compliance tier and never auto-suggested for a regulated client. An operator can still reach a Med or Low structure for those clients.
- Expert Revelation requires a real, named, consenting expert. Never fabricate credentials. If there is no real expert, the structure is unavailable.
- The Low claim-risk structures, especially Show Don't Tell Proof, Constraint Crusher, and Resource Rebel, are the safest and most credible for trust markets. Anvil should prefer these when recommending for regulated or local clients.

## Build order placement

Structure library: P2, an extension of the Curiosity engine and the awareness stage. It depends on both, and it gets sharper after close-the-loop, because the library can then rank structures by what actually converted for your operators. That performance ranking is the one template library a competitor cannot hand anyone, since it is built on your operators' real outcomes.
