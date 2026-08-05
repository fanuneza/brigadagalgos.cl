# Static prototype `brigada-documental`: adapt the Stitch design for Brigada Galgos

## Objective

Produce a standalone static HTML+CSS prototype at `prototypes/brigada-documental/` that adapts the Stitch "Brigada Documental" design (from `/home/fabian/Descargas/stitch_witnessing_brigada_galgos.zip`) to Brigada Galgos, applying every correction in the design audit: keep the documentary realism (cream surfaces, burnt red, olive, hairlines, Chivo, square forms, editorial grid), remove the intelligence-agency framing, use real site content and local photography. Homepage only; the rest of the site is not redesigned.

## Settled decisions

- **Placement**: `prototypes/brigada-documental/` containing `index.html`, `styles.css`, nothing else. The directory is already excluded from prettier (`.prettierignore:1`) and eslint (`eslint.config.mjs:15`). The existing prototypes, launcher (`prototypes/index.html`), and `prototypes/README.md` are **not** modified.
- **Source of design**: the ZIP's `DESIGN.md` token system and `code.html` layout ideas, corrected per the audit in the task prompt. The existing prototypes are not a source of anything.
- **Content**: real site content only. Sources of truth: `src/content/dogs/luciano.md`, `turron.md`, `fito.md`, `blue.md`, `mora.md`; `src/config/faq.ts` (verbatim FAQ answers); `src/config/site.ts` (org facts, external URLs); donation facts from `src/scripts/copy-data.ts` / `src/components/sections/DonationCards.astro`. Voice per `docs/voice-and-tone.md`. Never invent stats, dates, costs, or quotes; anything unavailable is marked _contenido pendiente_.
- **Images**: local assets only, from `prototypes/assets/<slug>/` (luciano, turron, fito, blue, mora), referenced relatively as `../assets/<slug>/<file>`. No Stitch CDN hotlinks, no downloaded Stitch imagery.
- **Fonts**: Chivo + Courier Prime via Google Fonts CDN `<link>` (as in the ZIP's `code.html`). Chivo carries all prose, headings, and CTAs; Courier Prime is restricted to metadata (dates, locations, captions, status labels, bank details).
- **Structure**: the audit's recommended homepage structure, eight sections:
  1. **Hero**: mission line ("Rescatamos, rehabilitamos y reubicamos galgos en Chile para que puedan vivir, por fin, como los perros de familia que siempre merecieron ser."), brief reassurance, three CTAs: `Quiero adoptar` (adoption form), `Puedo ser hogar temporal` (foster section), `Voy a apoyar a un galgo` (donation section). Reduced hero height, dog framed close, no live timestamp, no coordinates as primary content.
  2. **Galgos que buscan familia**: Luciano (featured), Turron, Fito, Blue. Colour photography by default. Name dominates; each card has age, one concrete behaviour from its `characterSketch`/`personalityBehavior`, home considerations where confirmed (`homeGuidance`), and a `Conocer a <nombre>` CTA.
  3. **¿Un galgo podria vivir contigo?**: verbatim FAQ answers (ejercicio, departamento, companero).
  4. **Asi funciona la adopcion**: four steps from the FAQ, plus the not-a-judgment reassurance, the trial period, post-adoption support, and what happens if the match does not work.
  5. **Hogar temporal**: what Brigada covers vs what the foster provides; foster quote marked _contenido pendiente_.
  6. **Bitacora de rescate**: Mora's real story. This is the one section where the archival aesthetic runs at full strength (field-header with tracking line, monospaced metadata, slight desaturation on images allowed) - in Spanish, warm framing (`El rescate de Mora`), confirmed facts only, ending on the adoption outcome.
  7. **Tu aporte sostiene cada recuperacion**: concrete outcomes (alimento, controles veterinarios, traslados, tratamientos), bank transfer details and eSponsor link, the no-state-funding / all-volunteer statement, and `Como usamos tu aporte` framing for transparency.
  8. **Cierre**: real outcomes note (Mora adopted by her foster family) plus the contact invitation ("Escribenos. Nos encanta hablar de galgos...") and final CTAs.
- **Navigation** (anchor links, visitor-oriented, per audit): Adoptar, Hogar temporal, Galgos, Donar, Conocenos. No ARCHIVE/THE WORK/RESCUES labels.
- **Banned from the main flow** (audit): ARCHIVE, FIELD REPORT, OPERATION, STATUS: SECURED, SUBJECT, DOSSIER, OBSERVATION LOG, REQUEST FULL FILE, AUTHORIZE DONATION, REVIEW EXPENDITURES, ACTIVE CASES, dominant ID numbers, live timestamp, grayscale-by-default with hover reveal.
- **Accessibility corrections baked into the CSS** (from the audit's risk list): no `#8a726b` (outline) for text - text uses `#1c1b1b` or `#56423c` on cream; captions at least 12px with adequate contrast; visible `:focus-visible` on every interactive element; no hover-only state changes; text over photography sits on a scrim or solid band; hairlines may be 0.5pt decoratively but functional borders at least 1px; `prefers-reduced-motion` respected; uppercase restricted to eyebrows and short labels, Spanish accents preserved (`ADOPCION`).
- **No automated tests, validation, or verification** for the prototype (user decision). The deliverables are the files themselves.
- **Out of scope / must not change**: nothing under `src/`, `public/`, `docs/` (except this plan file), existing prototypes, `package.json`, or any config is touched. No Tailwind anywhere (the ZIP's Tailwind CDN is dropped; plain CSS only). No JavaScript except, optionally, a mobile-nav toggle - the timestamp script from the ZIP is not carried over.

## Repository sources

- `AGENTS.md` (invariants: no absolute paths, no Tailwind, UTF-8, voice rules)
- `docs/voice-and-tone.md` (copy owner)
- `src/content/dogs/luciano.md`, `turron.md`, `fito.md`, `blue.md`, `mora.md`
- `src/config/faq.ts`, `src/config/site.ts`, `src/scripts/copy-data.ts`, `src/components/sections/DonationCards.astro`
- ZIP reference (read-only): `/home/fabian/Descargas/stitch_witnessing_brigada_galgos.zip` -> `DESIGN.md`, `code.html`, `screen.png`

## Orchestration

- Orchestrator (recommended): `kimi-k3-256k`
- Default worker: `worker-kimi-k27`
- Mode: `sequential`
- Run: `/orchestrate docs/plan/stitch-brigada-documental-prototype.md worker-kimi-k27 sequential`

## Work units

### Unit 1: Token system and component CSS

Dependencies: none

Scope:

- `prototypes/brigada-documental/styles.css` (new)

Required changes:

- Implement the adapted design system as plain CSS custom properties and component classes: cream surfaces (`#fcf9f8`, container steps `#f7f2f2`/`#f1edec`), ink `#1c1b1b`, muted `#56423c`, burnt red `#9d3d1c` (actions/active states), olive `#59614e` + `#dde6ce` (tags/metadata chips), hairline `rgba(28,27,27,0.3)`.
- Type scale from the ZIP (`display-lg` 48px/800 Chivo, `headline-lg` 32px/700, body 16px/1.6, `field-note` 14px and `caption` 12px Courier Prime) with fluid downsizing on mobile.
- Components: sticky nav, hero with scrim, buttons (square, solid primary / 1px-border secondary, instant inversion on hover), dog cards with olive metadata tag, field-header section titles with tracking line, staggered image grids (0/48/96px offsets, desktop only), journal/metadata blocks, donation detail lists, footer.
- Apply the accessibility corrections listed in Settled decisions (contrast-safe text colors, `:focus-visible`, at least 1px functional borders, reduced-motion guard, no hover-only reveals).

Acceptance criteria:

- File parses as valid CSS; no Tailwind, no remote CSS other than the font links (which live in the HTML).
- Every interactive style has a `:focus-visible` rule; no text color/background pair below 4.5:1 for body text.

### Unit 2: Homepage markup with real content

Dependencies: Unit 1

Scope:

- `prototypes/brigada-documental/index.html` (new)

Required changes:

- `lang="es-CL"`, single `h1`, Google Fonts links for Chivo + Courier Prime, link to `styles.css`.
- Implement the eight sections and nav from Settled decisions, pulling real content from the repository sources listed above. Copy follows `docs/voice-and-tone.md` (first-person plural, tuteo, verb-first CTAs, no em dashes, no "encajar").
- Images referenced from `../assets/<slug>/` with meaningful `alt` text, width/height, `loading="lazy"` except the hero.
- Journal section (Mora) is the only place with full archival styling; copy stays warm and factual.

Acceptance criteria:

- All eight sections present in order; three hero CTAs present.
- The banned vocabulary list is absent from the main copy.
- Courier Prime classes are applied only to metadata elements (captions, dates, bank details, status labels).
- No external URLs except the Google Fonts links and the org's real external links from `src/config/site.ts`; no absolute filesystem paths.

### Unit 3: Review pass against the audit

Dependencies: Unit 2

Scope:

- `prototypes/brigada-documental/` (both files, fixes only)

Required changes:

- Walk the audit's ten priority changes one by one and confirm each is reflected; fix any miss (for example uppercase overuse, a clinical dog description, an abstract donation line, metadata treated as primary content).
- Verify voice compliance against `docs/voice-and-tone.md` final checklist (tuteo, no em dashes, no banned cliches, support mentioned with adoption).

Acceptance criteria:

- Each of the audit's ten priority changes has a corresponding, visible artifact in the prototype.
- No copy invented beyond the repository sources; any gap is marked _contenido pendiente_.

## Concurrency

- `sequential` - all units touch the same two files.

## Stop conditions

- Any proposal to add sections beyond the eight, to restyle other pages, or to modify anything outside `prototypes/brigada-documental/`.
- Missing real content that the worker is tempted to invent (stats, dates, costs, quotes) - mark _contenido pendiente_ instead, and surface it to the user.
- Any conflict between the ZIP's design and the audit (the audit wins).

## Commit

- `Add brigada-documental static prototype adapting Stitch design` (only when the user asks for a commit).
