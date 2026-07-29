# Astro UX Hierarchy Plan — orchestration contract

Source: `brigada-galgos-audit.md` (conversion-hierarchy audit of the deployed site).

The architecture is sound. This plan does **not** rewrite systems. It fixes **conversion
hierarchy**, **presentation density**, and a small number of **exposed DRY leaks**.

This directory is the complete execution plan. An orchestrator agent can run it end to end
without further design input.

---

## 1. Wave map

Waves are strictly sequential. Tasks inside a wave are strictly parallel and own disjoint files.

| Wave | Branch                | Tasks                                                            | Mode              |
| ---- | --------------------- | ---------------------------------------------------------------- | ----------------- |
| 1    | `wave/1-foundation`   | [T01](01-section-rhythm.md), [T02](02-navigation-and-links.md)   | swarm (2 agents)  |
| 2    | `wave/2-dog-surfaces` | [T03](03-adoption-listing.md), [T04](04-dog-profile.md)          | swarm (2 agents)  |
| 3    | `wave/3-journeys`     | [T05](05-homepage-hierarchy.md), [T06](06-foster-and-contact.md) | swarm (2 agents)  |
| 4    | `wave/4-donation`     | [T07](07-donation.md)                                            | single agent      |
| 5    | `main`                | [T08](08-integration.md)                                         | orchestrator only |

Dependency rationale:

- W1 sets section rhythm, action hierarchy, and the centralized URL/nav sources everything else consumes.
- W2 owns `DogCard` and the dog surfaces, so W3's homepage work can consume the card as-is.
- W3 owns `TrustStatsSection` and `ProcessStepper`, so W4's donation page consumes them as-is.
- W4 is solo because it composes components owned by three earlier waves.
- W5 is integration, cross-route review, full verification, and documentation reconciliation.

---

## 2. Git protocol

Orchestrator, at the start of each wave:

```bash
git checkout main && git pull --ff-only 2>/dev/null || git checkout main
git checkout -b wave/<N>-<slug>
```

All tasks of the wave run **in the working directory, on the wave branch**. No worktrees.
This is safe because file ownership inside a wave is disjoint and declared per task.

Each subagent, after its task passes its own checks, commits **only its owned paths**:

```bash
git add <owned path> [<owned path> ...]      # never `git add -A`, never `git commit -a`
git commit -m "<type>(<scope>): <subject>"
```

If `git commit` fails on `.git/index.lock`, wait 2 seconds and retry (up to 5 times). A
concurrent sibling agent is mid-commit; commits are atomic, so the retry always converges.

Orchestrator, at the end of each wave — after running the wave gate (§4):

```bash
git checkout main
git merge --no-ff wave/<N>-<slug> -m "merge(wave-<N>): <summary>"
git branch -d wave/<N>-<slug>
```

Delete every working branch once merged. Do not open PRs. Do not ask the user to confirm
merges or deletions — the branch protocol is pre-approved.

If a wave gate fails, fix it **on the wave branch** (orchestrator, or a targeted follow-up
agent) before merging. Never merge a red wave.

---

## 3. Subagent dispatch contract

Dispatch one subagent per task file, with `subagent_type: "general-purpose"`.

The prompt must contain **only**:

1. `Read AGENTS.md, then read docs/plan/astro/<task-file>.md and execute it exactly.`
2. The wave branch name, and confirmation that it is already checked out.
3. The literal reminder block below.

```
You are a bounded implementation agent.
- Do not spawn other agents.
- Touch only the files listed as OWNED in your task file. Files listed as READ-ONLY may be
  read but never edited; if you believe one must change, stop and report instead.
- Do not run `npm run build`, `npm test`, `npx playwright test`, or `astro check`. A sibling
  agent may be running in the same directory. Run only the scoped checks in your task file.
- Do not make unrelated improvements, reformat untouched files, or refactor beyond scope.
- Commit once, staging only your owned paths, then report: what changed, what you deliberately
  did not change, and anything the orchestrator must resolve.
```

Report back compactly. No raw logs.

---

## 4. Verification gates

**Per task (subagent, safe under parallelism):**

```bash
npx prettier --check <owned files>
npx eslint <owned .astro/.ts files>
npx stylelint <owned .css files>
npm run test:text
```

**Per wave (orchestrator, exclusive, after all tasks committed):**

```bash
npm run format:check
npm run lint
npm run build
npm test
```

**Final (orchestrator, T08 only):**

```bash
npm run format:check && npm run lint && npm run build && npm test
npm run capture:home && npm run capture:adoptar && npm run capture:donar
npm run test:lighthouse
```

Never claim a gate passed without the command output in hand.

---

## 5. Invariants every task inherits

Non-negotiable. A task that cannot meet its goal without breaking one of these must stop and report.

- **Content model is frozen.** No new fields in `src/content.config.ts`, no new dog frontmatter,
  no invented facts. Use only fields that exist and are populated today.
- **Dog statuses, redirects, hidden-dog rules** in `public/_redirects` stay intact.
- **Structured data** stays generated from `src/utils/structured-data.ts`. Do not inline JSON-LD.
- **Analytics and consent**: GTM-only GA4 after consent. Preserve every `data-track-*` attribute
  and its `location` value when moving markup; if a CTA is removed, remove its event cleanly and
  note it in the report.
- **Outbound links** go through `TrackedLink` / `WhatsAppLink` / `InstagramLink`. Never hand-roll
  `target` / `rel` / tracking attributes.
- **Post-adoption messaging** and humane storytelling stay. This is a density fix, not a copy cull.
- **Progressive enhancement**: every surface must work with JavaScript disabled. Add JS only where
  native HTML/CSS genuinely cannot deliver the behavior.
- **Styling**: `src/styles/global.css` + `src/styles/components/*.css`. No Tailwind, no second
  styling system, no utility-heavy one-off rewrites.
- **Astro-first**: server-rendered components, semantic HTML, one `h1` per page, no heading skips.
- **Lighthouse targets 100** on checked routes. No new client JS, no layout instability.
- **Copy** follows `docs/voice-and-tone.md` — Chilean Spanish, correct accents, UTF-8, no mojibake.
- **No absolute filesystem paths** anywhere in the repo (enforced by `tests/source-hygiene.test.ts`).

---

## 6. Documentation reconciliation

Subagents update docs only where their own change makes an existing statement false, and they
say so in their report. The orchestrator reconciles everything else in T08:

- `DESIGN.md` — section rhythm, typography scale, action hierarchy (W1).
- `docs/prd.md` — page composition and conversion paths (W3, W4).
- `docs/spec.md` — component inventory, analytics events (any wave that adds/removes one).
- `AGENTS.md` — only if a workflow or architectural rule actually changed.

---

## 7. Definition of done

- Every wave branch merged to `main` and deleted.
- One focused commit per task, each touching only that task's owned paths.
- Final gate green: `format:check`, `lint`, `build`, `npm test`, captures, Lighthouse.
- Mobile (390px) and desktop (1280px) reviewed on `/`, `/adoptar/`, `/adoptar/<slug>/`,
  `/hogar-temporal/`, `/contacto/`, `/donar/`.
- T08 report states what changed per route, what was deliberately deferred, and any residual risk.
