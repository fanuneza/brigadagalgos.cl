# UX adoption plan

This plan turns the 2026-07-29 Impeccable audit into a sequence of small,
reviewable changes. It preserves the existing design system, Chilean Spanish
voice, static Astro architecture, content collections, analytics consent
rules, and the homepage rule that adoption is the single primary action.

The evidence and severity model live in [audit.md](audit.md). Every executable
unit is a self-contained file in [tasks/](tasks/).

## Outcome

The finished program should make it easier to:

1. discover a dog who may be suitable;
2. understand compatibility, care, process, and post-adoption support;
3. move from interest to a qualified conversation without a blocking overlay
   or premature form handoff;
4. find foster, donation, and contact paths without competing with adoption;
5. use the complete journey with a keyboard, a narrow viewport, enlarged text,
   reduced motion, or dark mode;
6. measure the funnel without loading analytics before consent.

This is not a redesign. It uses the current palette, typography, spacing,
weights, cards, buttons, content model conventions, and local photography.

## Orchestration contract

The orchestrator owns integration and final decisions. A task agent owns only
the files and outcome named in its task file.

For every wave:

1. Start from a clean, current `main`.
2. Create the wave integration branch named in the wave table.
3. Create one task branch and one isolated worktree per task, based on the wave
   branch. Use the branch name from the task file.
4. Give exactly one subagent each task file. Task agents must not spawn other
   agents, broaden scope, or revert unrelated changes.
5. Every task agent must run its required checks and commit its work before
   handoff. An uncommitted task is incomplete.
6. If a wave is marked **swarm**, run its tasks in parallel. If it is marked
   **serial**, run them in listed order.
7. The orchestrator reviews every task diff and cherry-picks the accepted
   commits into the wave branch in the integration order shown below.
8. Run the wave gates on the integrated wave branch. Fix integration defects
   there with a clearly named orchestrator commit.
9. Merge the reviewed wave branch into `main`.
10. Remove task worktrees and delete task and wave branches only after
    `git branch --merged main` proves their commits are in `main`.

Routine implementation choices are already resolved in the task files. Do not
pause to ask the user. If source material cannot support a new factual claim,
use an explicit unknown/case-by-case state or omit the claim; never invent it.

## Waves

| Wave                     | Integration branch                | Mode   | Tasks   | Integration order  |
| ------------------------ | --------------------------------- | ------ | ------- | ------------------ |
| 1. Trustworthy shell     | `ux/wave-01-trustworthy-shell`    | Swarm  | T01–T03 | T01, T02, T03      |
| 2. Adoption data         | `ux/wave-02-adoption-data`        | Serial | T04     | T04                |
| 3. Adoption journey      | `ux/wave-03-adoption-journey`     | Swarm  | T05–T07 | T05, T06, T07      |
| 4. Decision support      | `ux/wave-04-decision-support`     | Swarm  | T08–T11 | T08, T09, T10, T11 |
| 5. Cross-site coherence  | `ux/wave-05-cross-site-coherence` | Serial | T12–T13 | T12, T13           |
| 6. Measurement and gates | `ux/wave-06-measurement-gates`    | Serial | T14–T15 | T14, T15           |

Do not begin a wave until the preceding wave is merged into `main`. Wave 3
depends on the content API created in Wave 2. Wave 5 deliberately runs after
all route-specific work so it can remove repetition without causing parallel
conflicts.

## Task index

| ID  | Task                                                                   | Primary outcome                                              |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| T01 | [Consent without obstruction](tasks/01-consent-without-obstruction.md) | Consent remains compliant but stops covering decisions       |
| T02 | [Navigation and narrow reflow](tasks/02-navigation-and-reflow.md)      | Adoption-led IA and no 320px shell overflow                  |
| T03 | [Accessibility truth](tasks/03-accessibility-truth.md)                 | Real WCAG coverage with no blanket exclusions                |
| T04 | [Adoption decision data](tasks/04-adoption-decision-data.md)           | Confirmed compatibility and care metadata                    |
| T05 | [Adoption listing](tasks/05-adoption-listing.md)                       | Lower interaction density and clearer dog selection          |
| T06 | [Dog profiles](tasks/06-dog-profiles.md)                               | Individual, decision-ready profiles                          |
| T07 | [Homepage funnel](tasks/07-homepage-funnel.md)                         | A shorter, adoption-first narrative                          |
| T08 | [FAQ discovery](tasks/08-faq-discovery.md)                             | Scannable, reachable answers at moments of doubt             |
| T09 | [Foster confidence](tasks/09-foster-confidence.md)                     | Human proof and clearer commitment expectations              |
| T10 | [Donation confidence](tasks/10-donation-confidence.md)                 | Less repetition, stronger proof, faster donation             |
| T11 | [Contact routing](tasks/11-contact-routing.md)                         | Fewer detours before a real conversation                     |
| T12 | [Secondary surfaces](tasks/12-secondary-surfaces.md)                   | Stories, blog, collaborators, and 404 support adoption       |
| T13 | [Visual grammar](tasks/13-visual-grammar.md)                           | Fewer repeated eyebrows/cards without new tokens             |
| T14 | [Funnel measurement](tasks/14-funnel-measurement.md)                   | Consent-safe signals for adoption intent                     |
| T15 | [UX regression gates](tasks/15-ux-regression-gates.md)                 | Repeatable reflow, accessibility, visual, and journey checks |

## Global invariants

Every task must preserve these:

- No new colors, typefaces, spacing steps, radii, shadows, button variants, or
  styling framework.
- No Tailwind, remote dog imagery, client-side framework, or unnecessary
  hydration.
- One primary adoption action per route. Repeating the same action later is
  allowed; a competing primary action is not.
- The homepage remains a three-dog preview, not the full catalogue.
- Dog status, hidden-dog expiry, redirect coverage, and gallery caps remain
  enforced by the canonical schema and source-hygiene tests.
- External organizational URLs stay in `src/config/site.ts`.
- No new factual claims without evidence already in repository content.
- Correct Chilean Spanish, accents, and post-adoption support language.
- All interactive behavior works without analytics consent.
- Existing unrelated work is preserved.

## Wave gates

Each wave must finish with:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

Run `npm run test:lighthouse` for Waves 1, 3, 4, 5, and 6. Run the visual
captures named in each task. A task may run a narrower check during
implementation, but the orchestrator runs the complete wave gate.

## Final orchestrator review

After Wave 6, the orchestrator performs a fresh review on `main`, not merely a
test run:

1. Compare the implementation against every P1 and P2 finding in
   [audit.md](audit.md); record any intentionally deferred P3 item.
2. Walk the adoption journey on 320px, 390px, 768px, 1024px, and 1440px in
   light and dark modes.
3. Walk it with keyboard only, reduced motion, and enlarged text.
4. Test first visit with no consent, then reject, then accept, and confirm that
   the primary task stays visible in every state.
5. Verify `/`, `/adoptar/`, every active dog profile, FAQ, foster, donation,
   contact, stories, blog, cookie policy, and 404.
6. Confirm that dog facts and monetary claims still match their source
   content.
7. Inspect analytics payloads before and after consent.
8. Run all wave gates one final time.
9. Commit any integration-only corrections, merge the last wave to `main`,
   and delete merged working branches.

Completion means the experience is measurably easier to use and the repository
contains the tests that prevent the audited failures from returning.
