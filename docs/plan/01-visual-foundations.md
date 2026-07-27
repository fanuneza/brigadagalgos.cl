# Stage 01: Visual foundations

## Objective

Establish the restrained token and global-surface contract that every later stage will consume, without recomposing routes or changing content.

## Required files and documentation to inspect

Read completely before editing:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/spec.md`
- `docs/architecture-map.md`
- `docs/developer-reference.md`

Inspect the current repository through the required jCodeMunch opening sequence, then inspect at minimum:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/components/motion.css`
- The component CSS import topology and all current consumers of radius, shadow, surface, section-spacing, and color tokens
- Relevant source-hygiene and build tests

Do not trust remembered line numbers or selector examples without confirming the current code. Use Astro Docs MCP if any framework-sensitive stylesheet loading behavior is in question.

## Exact scope

- Add or refine semantic tokens for type scale, content widths, gutters, section rhythm, color roles, surfaces, radii, shadows, and motion durations.
- Flatten the global page background and remove decorative body gradients.
- Make “no shadow” the global default and remove the cross-family card elevation/lift block.
- Establish neutral light/dark surface steps and stable action/selection aliases.
- Add narrowly scoped compatibility aliases where removing a legacy token immediately would create uncontrolled breakage.
- Identify and resolve undefined/inconsistent global tokens such as `--line-relaxed` if still present.

## Explicit non-goals

- Do not recompose any route or component.
- Do not change heading case/family rules; stage 02 owns typography application.
- Do not restyle buttons or links; stage 03 owns them.
- Do not change Navbar, Footer, galleries, forms, or route CSS.
- Do not remove compatibility aliases merely for cleanliness when current consumers still need them.
- Do not add dependencies, Tailwind, decorative JavaScript, fonts, or assets.

## Implementation requirements

- Preserve the existing palette while assigning the semantic roles specified in this stage and the index.
- Keep the current 1200px wide container unless evidence demonstrates a safe adjustment.
- Provide reading, compact, and form width roles; compact/standard/generous section spacing; modest control/card/media/panel radii; and exceptional-only shadow roles.
- Retain `light-dark()`, explicit `data-theme`, `color-scheme`, and the current anti-flash model.
- Keep motion content-visible by default and preserve reduced-motion handling.
- Keep compatibility changes explicit and commented only where a temporary migration contract is not obvious.

## Constraints and invariants

- Static Astro output, CSS architecture, local font delivery, responsive image pipeline, CSP, analytics, consent, routes, and content models must remain unchanged.
- Light and dark modes are equally authoritative.
- Neutral text must preserve WCAG AA contrast; do not create paler muted text.
- No absolute filesystem paths may enter repository files.
- Preserve unrelated user changes.

## Relevant tests and visual checks

Run scoped formatting/lint checks for changed files and a production build. Run relevant source-hygiene tests if current selectors/tokens are covered.

Capture `/` and `/adoptar/` at 375px and 1280px in explicit light and dark themes. Check:

- No body glow or multicolor background gradient
- No unexpected overflow or section collapse
- Text, borders, and neutral surface steps remain legible
- No unrelated card still inherits a global lift rule
- No theme flash or image dimming regression

Do not run the full regression suite or Lighthouse; the orchestrator owns those.

## Acceptance criteria

- Semantic tokens cover this plan’s typography, layout, color, depth, radius, and motion policies.
- The page background and shared surfaces are flat and stable in both themes.
- The global unrelated-card elevation selector is gone.
- Existing components continue to render without severe layout breakage.
- Compatibility aliases are minimal, documented where needed, and left for deliberate later removal.

## Required commit message guidance

Commit only this stage’s work in one focused commit with the message:

`style: establish restrained visual foundations`
