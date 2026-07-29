# T08 — Integration, cross-route review, and final verification

**Wave 5** · branch `main` · **orchestrator only — do not delegate this to a subagent**

By this point W1–W4 are merged to `main` and every wave branch is deleted. Seven commits landed
from seven bounded agents that never saw each other's work. This task is where the site becomes
coherent.

## 1. Commit review

For each of the seven task commits:

```bash
git log --oneline main
git show --stat <sha>
git show <sha>
```

Check:

- The commit touched **only** the paths its task file declared as owned. A stray edit to a file
  owned by another task is the highest-priority thing to find here.
- No `git add -A` collateral: no `dist/`, no `test-results/`, no `package-lock.json` churn, no
  reformatted-but-unrelated files.
- Constraints held: no schema change, no invented facts, no altered statistics, no new client
  JavaScript, no hand-rolled `target`/`rel`, no absolute filesystem paths.
- Copy is correct Chilean Spanish with intact accents and no mojibake.

Fix violations directly on `main` with a follow-up commit. Do not re-dispatch an agent for a
one-line fix.

## 2. Cross-route coherence review

The individual tasks were correct in isolation. Verify the seams:

- **Section weights.** T01's vocabulary should be applied consistently across `/`, `/adoptar/`,
  `/hogar-temporal/`, `/contacto/`, `/donar/`. If two routes used the same weight to mean
  different things, normalize it now.
- **Action hierarchy.** Walk each route and count the primary buttons. Any route with more than
  one competing primary action failed the audit's core goal — fix it.
- **The adoption funnel end to end.** Home featured card → `/adoptar/` listing card → profile →
  application. Each step must have exactly one obvious next action, and the ClientRouter image
  morph (`transitionName={`dog-photo-${id}`}`) must still work from listing to profile.
- **Duplicate content across routes.** With the homepage compressed and `/donar/` deduplicated,
  check nothing now appears twice at full weight anywhere, and that nothing valuable was dropped
  from _both_ places by two agents who each assumed the other kept it. This is the most likely
  failure mode of parallel waves — check it explicitly for: rescue process, trust statistics,
  adoption process, and foster process.
- **Navigation.** With T02's centralized nav, confirm the navbar and footer still expose every
  route, including any whose homepage entry point got smaller.
- **Analytics.** Collect the removed/relocated events from all seven reports. Confirm no orphaned
  `data-track-*` attributes remain, no duplicate `location` values were introduced, and every
  surviving CTA still fires.

## 3. Full verification

```bash
npm run format:check
npm run lint
npm run build
npm test
```

Then visual capture:

```bash
npm run capture:home
npm run capture:adoptar
npm run capture:donar
```

Review the produced screenshots. If `capture/` baselines now differ intentionally, update them and
say so explicitly in the final report — never silently.

Then Lighthouse:

```bash
npm run test:lighthouse
```

The site targets 100 across categories on checked routes. Semantics regressions (heading order,
button/link accessible names, label associations) are the likely failures after this much markup
movement, and they pass `build` while failing Lighthouse. Fix, re-run, do not rationalize.

## 4. Manual responsive review

At **390px** and **1280px**, in both light and dark themes:

`/` · `/adoptar/` · `/adoptar/<slug>/` · `/hogar-temporal/` · `/contacto/` · `/donar/`

Confirm per route: one dominant action, no horizontal overflow, no orphaned headings, focus
visible on every interactive element, and the page reads as a sequence rather than a stack.

Then **disable JavaScript** and repeat on `/adoptar/`, `/adoptar/<slug>/`, and `/donar/`: all dogs
listed, galleries showing their first image, bank data fully readable, forms submittable.

## 5. Documentation reconciliation

Only where the code made an existing statement false:

- `DESIGN.md` — section/card/action weights (T01 wrote the first version; make it match what
  shipped).
- `docs/prd.md` — homepage composition, adoption conversion path, donation page structure.
- `docs/spec.md` — component inventory, removed components, the final analytics event table.
- `AGENTS.md` — only if a workflow or architectural rule genuinely changed. The homepage rule
  ("`FeaturedAdoptionDogs` immediately after the hero divider") should still be true; if the
  section list around it changed, update that paragraph.
- `README.md` — only if a human-facing description became wrong.

Commit as:

```
docs: reconcile documentation with the UX hierarchy pass
```

## 6. Branch cleanup

```bash
git branch                    # expect: main only
git branch -d wave/1-foundation wave/2-dog-surfaces wave/3-journeys wave/4-donation 2>/dev/null
git status                    # expect: clean
```

Every wave branch must be gone. No stray task branches, no uncommitted files.

## 7. Final report

State, honestly:

- What changed per route, in one line each.
- Which audit findings (1–6) are fully addressed, and which are partially addressed with the
  reason.
- Gate results with actual outcomes — if Lighthouse dropped below 100 anywhere, say the score and
  the route rather than omitting it.
- Anything deliberately deferred, and what it would take to finish.
- Residual risk: content that now depends on fields not populated for every dog, capture baselines
  updated, analytics events removed.

## Definition of done

`main` is green on `format:check`, `lint`, `build`, `npm test`, captures reviewed, Lighthouse run,
all wave branches deleted, working tree clean, documentation reconciled, report delivered.
