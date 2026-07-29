# Astro Best Practices Plan

Plan to bring `brigadagalgos.cl` (Astro 7, static, Cloudflare Pages) in line with current Astro best practices, based on a code review and the official Astro Docs (queried via the Astro Docs MCP).

## How to orchestrate

Each numbered file in this directory is one self-contained task. Execute them by spawning **one subagent per task file**. Each task file contains: goal, current state with exact file paths, Astro docs references, step-by-step changes, and acceptance criteria.

### Branching model

1. **Plan branch (orchestrator):** before spawning any subagent, the orchestrator creates a dedicated branch for the whole plan (e.g. `plan/astro-best-practices`) off `main` and switches to it. All plan work happens on this branch — never directly on `main`.
2. **Wave branches (subagents):** at the start of each wave, the first subagent in that wave creates a wave branch (e.g. `plan/astro-best-practices/wave-1`) off the plan branch. All subagents in the same wave work on that wave branch. When the wave is complete and verified, the orchestrator merges the wave branch back into the plan branch.
3. **Merge to `main`:** the orchestrator merges the plan branch into `main` **only once the whole plan is implemented, tested, and integrated** (see "Integration & final review" below). No intermediate merges to `main`.

### Commit discipline

- Each subagent **commits its own work as soon as its task is finished and verified**, before reporting back or moving on. One commit per task, with a message referencing the task file (e.g. `plan/astro: 01 prefetch strategy`).
- The orchestrator never leaves finished task work uncommitted between waves. If a subagent reports back without committing, the orchestrator commits (or fixes and commits) before spawning the next wave.

Recommended execution flow:

1. **Wave 1 (independent, safe to parallelize):**
   - `01-prefetch-strategy.md`
   - `07-jsonld-dedup.md`
   - `10-blog-article-semantics.md`
   - `11-asset-cleanup.md`
2. **Wave 2 (touch `astro.config.mjs` / `BaseLayout.astro` — run sequentially):**
   - `02-astro-env-schema.md`
   - `03-site-url-consistency.md`
   - `04-fonts-api-migration.md`
3. **Wave 3 (larger refactors, one at a time):**
   - `05-responsive-images.md`
   - `06-gallery-component-refactor.md`
   - `08-view-transition-names.md`
   - `09-svg-components-optimizer.md`

File-conflict map (tasks sharing files must not run in parallel):

- `astro.config.mjs`: tasks 02, 04, 09
- `src/layouts/BaseLayout.astro`: tasks 01, 04, 08
- `src/pages/index.astro`: tasks 05, 07, 08

## Integration & final review (orchestrator, after all tasks)

1. Run the full verification suite and require it green:
   - `npm run format:check`
   - `npm run lint`
   - `npm run build`
   - `npm test`
   - `npm run test:lighthouse` (mandatory — tasks 01, 04, 05, 06, 08 affect performance/semantics)
2. Review the combined diff for cross-task coherence:
   - `astro.config.mjs` merges from tasks 02, 04, 09 compose cleanly (no duplicate keys, imports deduplicated).
   - `BaseLayout.astro` still has exactly one font strategy, one prefetch strategy, one script bootstrap.
   - No task reintroduced hardcoded URLs, absolute filesystem paths, or a second styling system.
3. Update docs if workflows changed: `AGENTS.md`, `docs/spec.md`, `DESIGN.md` (fonts task 04 changes the font pipeline; images tasks 05/06 change the gallery pipeline).
4. Commit any integration fixes and doc updates on the plan branch, then merge the plan branch into `main`. This merge happens only here, after the full suite is green and the combined diff is reviewed — never mid-plan.

## Task index

| File | Theme | Effort | Risk |
| --- | --- | --- | --- |
| 01 | Prefetch strategy | S | Low |
| 02 | `astro:env` schema | S | Low |
| 03 | Site URL consistency | S | Low |
| 04 | Astro Fonts API migration | M | Medium |
| 05 | Responsive images (`layout`, `responsiveStyles`) | M | Medium |
| 06 | Gallery `set:html` → components | L | Medium |
| 07 | Duplicate WebSite JSON-LD | S | Low |
| 08 | View transition names/persist | M | Medium |
| 09 | SVG components + `svgOptimizer` | M | Low |
| 10 | Blog `<article>` semantics | S | Low |
| 11 | Dead asset cleanup | S | Low |

## Non-goals

- No framework islands (React/Vue/etc.) — the site is intentionally pure Astro.
- No Tailwind, no new styling system.
- No adapter / SSR conversion — static output stays.
- No partytown: GTM is consent-gated by design; do not move it off-thread without a product decision.
