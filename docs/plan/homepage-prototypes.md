# Five static homepage prototypes for the Brigada Galgos redesign

## Objective

Produce five self-contained static HTML/CSS/JS homepage prototypes under `prototypes/`, each exploring a distinct visual system over identical real content and the nine-section structure of the redesign brief §8. No changes to the Astro site code. The user picks a direction afterward.

## Settled decisions

- Prototypes live in `prototypes/` at repo root; the Astro build, stylelint (`src/**/*.css`), and `tests/source-hygiene.test.ts` do not scan it. The worker adds `prototypes/` to the ESLint `ignores` list in `eslint.config.mjs` and creates `.prettierignore` containing `prototypes/` — the only two repo-config touches allowed.
- Homepage only. Each prototype implements the nine sections of brief §8 in order: galgo-led opening → active dogs → suitability self-check → rescue journey → foster homes → one complete rescue story → donations → organizational trust → closing adoption action.
- Five distinct visual systems (same content, same section order):
  1. `editorial-documental` — serif display + sans body, narrow reading columns, documentary captions, ink/paper palette.
  2. `calido-domestico` — warm neutrals, restrained roundness, home-life photography leads.
  3. `tipografico-audaz` — oversized condensed display type, monochrome + one accent, grid-breaking composition.
  4. `clinico-transparente` — trust-first, structured fact groups, cool restrained palette, process-led sequencing.
  5. `territorial-chileno` — earthy palette from Chilean landscape, textured bands, horizontal case sequences.
- Copy: real Chilean-Spanish tuteo copy extracted from `src/content/dogs/`, `src/config/site.ts`, and `src/config/faq.ts` — never invented dog facts (brief §10 content integrity).
- Photography: a small curated set of real photos copied from `src/assets/casos/<slug>/` into shared `prototypes/assets/`; prototypes reference them relatively. No stock, no remote images, no external CDNs or webfonts (distinctive system-font stacks per direction).
- Conversion hierarchy per brief §6: adoption primary, foster secondary, donation supporting; one dominant action per section; the three action types visually distinct.
- Mobile-first, WCAG 2.2 AA-minded: semantic HTML, one `h1`, 44px targets, visible focus, status not communicated by color alone, full content usable without JS.
- Existing site code, content collections, schemas, and docs are read-only source material; they must not change.
- Orchestrator model: `kimi-for-coding/k3-256k` (user decision).

## Repository sources

- `AGENTS.md` (invariants)
- `PRODUCT.md` (conversion model)
- `docs/voice-and-tone.md` (copy rules — apply to prototype copy)
- Redesign brief §6 and §8 (conversion hierarchy and homepage section structure, as provided in the task)
- Content sources: `src/content/dogs/`, `src/config/site.ts`, `src/config/faq.ts`, `src/assets/casos/`

## Orchestration

- Orchestrator (recommended): `kimi-for-coding/k3-256k`
- Default worker: `worker-kimi-k27`
- Mode: `sequential`
- Run: `/orchestrate docs/plan/homepage-prototypes.md worker-kimi-k27 sequential`

## Work units

### Unit 1: Content pack and shared assets

Dependencies: none

Scope:

- `prototypes/README.md`, `prototypes/assets/`, `eslint.config.mjs` (ignores only), `.prettierignore` (new)

Required changes:

- Add `prototypes/` to the ESLint `ignores` list in `eslint.config.mjs`; create `.prettierignore` containing `prototypes/`. No other repo file changes.
- Select one featured galgo (`status: "adopcion"`, strong photos) plus 3–4 more active dogs and one `status: "exito"` story from `src/content/dogs/`; copy ≤12 photos total from `src/assets/casos/<slug>/` into `prototypes/assets/`.
- Write `prototypes/README.md`: chosen dogs with their real frontmatter facts (name, sex, age, weight, compatibility), the success-story outline, donation methods and org facts from `src/config/site.ts`, 4–6 FAQ answers from `src/config/faq.ts`, and the five direction names. This file is the single content source for Units 2–6.

Acceptance criteria:

- `prototypes/README.md` contains only facts traceable to repo content; no invented medical or temperament claims.
- `npm run lint` passes with the new ignore entries.

Focused validation:

- `npm run test:source && npx eslint .`

### Unit 2: Prototype `editorial-documental`

Dependencies: Unit 1

Scope:

- `prototypes/editorial-documental/` (`index.html`, `styles.css`, optional `script.js`)

Required changes:

- Self-contained static homepage implementing the nine brief-§8 sections with Unit 1 content; serif display + sans body system stack; narrow reading columns; documentary photo captions; ink/paper palette; role-distinct adoption/foster/donation actions.

Acceptance criteria:

- All nine sections present in brief order; exactly one `h1`; adoption CTA dominant; foster one weight below; donation as quiet band.
- Renders correctly at 360px and 1280px; full content usable with JS disabled; no external network requests.

Focused validation:

- Serve `prototypes/` and open the page at 360px and 1280px; check heading order and focus visibility manually.

### Unit 3: Prototype `calido-domestico`

Dependencies: Unit 1

Scope:

- `prototypes/calido-domestico/` (`index.html`, `styles.css`, optional `script.js`)

Required changes:

- Same contract as Unit 2; warm neutral palette, restrained roundness, home-life photography leads composition.

Acceptance criteria:

- Same contract as Unit 2, visually distinct from it.

Focused validation:

- Serve `prototypes/` and open the page at 360px and 1280px; check heading order and focus visibility manually.

### Unit 4: Prototype `tipografico-audaz`

Dependencies: Unit 1

Scope:

- `prototypes/tipografico-audaz/` (`index.html`, `styles.css`, optional `script.js`)

Required changes:

- Same contract as Unit 2; oversized condensed display type, monochrome + single accent, grid-breaking composition; type remains readable with Spanish accents and long dog names.

Acceptance criteria:

- Same contract as Unit 2, visually distinct from Units 2–3.

Focused validation:

- Serve `prototypes/` and open the page at 360px and 1280px; check heading order and focus visibility manually.

### Unit 5: Prototype `clinico-transparente`

Dependencies: Unit 1

Scope:

- `prototypes/clinico-transparente/` (`index.html`, `styles.css`, optional `script.js`)

Required changes:

- Same contract as Unit 2; trust-first layout, structured fact groups, cool restrained palette, rescue-process section given lead weight.

Acceptance criteria:

- Same contract as Unit 2, visually distinct from Units 2–4.

Focused validation:

- Serve `prototypes/` and open the page at 360px and 1280px; check heading order and focus visibility manually.

### Unit 6: Prototype `territorial-chileno`

Dependencies: Unit 1

Scope:

- `prototypes/territorial-chileno/` (`index.html`, `styles.css`, optional `script.js`)

Required changes:

- Same contract as Unit 2; earthy palette, textured bands, horizontal case sequence for the rescue journey.

Acceptance criteria:

- Same contract as Unit 2, visually distinct from Units 2–5.

Focused validation:

- Serve `prototypes/` and open the page at 360px and 1280px; check heading order and focus visibility manually.

### Unit 7: Index page and verification pass

Dependencies: Units 2–6

Scope:

- `prototypes/index.html`, `prototypes/README.md`

Required changes:

- Add a simple index page linking the five prototypes with one-line direction summaries.
- Verify each prototype: nine sections, one `h1`, keyboard-focus visibility, no external requests, no broken asset paths, 44px targets on CTAs.
- Update `prototypes/README.md` with how to serve and view the prototypes.

Acceptance criteria:

- All five prototypes pass the checklist; `npm run lint` and `npm run test:source` green.

Focused validation:

- `npm run lint && npm run test:source`; manual browser pass over all five pages at 360px.

## Full validation

- `npm run lint && npm run test:source && npm run build` (site must remain untouched and green)
- Manual: serve `prototypes/` (e.g. `npx serve prototypes`) and verify all five pages at mobile and desktop widths.

## Concurrency

- `sequential`. Units 2–6 are file-independent but kept sequential for review simplicity.

## Stop conditions

- If real content is insufficient for a section (e.g. no foster account text exists), the worker marks it "contenido pendiente" rather than inventing copy, and stops to report.
- Any request to reuse webfonts or external assets requires user approval (the brief forbids stock imagery and CDNs; local font files would need a new decision).
- Choosing the winning direction is the user's call after delivery — not part of this plan.

## Commit

- One commit per unit: `prototype: content pack and shared assets`, `prototype: editorial-documental direction`, `prototype: calido-domestico direction`, `prototype: tipografico-audaz direction`, `prototype: clinico-transparente direction`, `prototype: territorial-chileno direction`, `prototype: index and verification`.
