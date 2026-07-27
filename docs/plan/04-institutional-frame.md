# Stage 04: Institutional frame

## Objective

Turn the Navbar and Footer into a stable, restrained institutional frame while preserving all navigation, theme, drawer, legal, cookie, social, and tracking behavior.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: “Header and navigation,” “Footer,” “Navigation and footer,” rainbow/color policy
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/feature-inventory.md`
- `docs/spec.md`
- `docs/developer-reference.md`

After the required jCodeMunch opening sequence, inspect:

- `src/components/Navbar.astro`
- `src/styles/components/navbar.css`
- `src/scripts/navbar.ts`
- `src/components/Footer.astro`
- `src/styles/components/footer.css`
- `src/components/RainbowDivider.astro`
- `src/styles/components/rainbow-divider.css`
- `src/layouts/PageLayout.astro`
- `src/scripts/theme.ts`
- `tests/nav.spec.ts`, analytics/consent tests, and relevant a11y/smoke tests

## Exact scope

- Flatten the sticky header, remove backdrop blur and toolbar-like pill containers, and use a quiet bottom border.
- Use text/underline navigation state; keep donation as the only filled desktop header action.
- Make theme/menu controls at least 44px square with modest radius.
- Preserve and visually regroup the mobile drawer without changing its semantics.
- Remove Footer glow, simplify its brand/social/action treatments, and move to a mission-led unequal-column composition.
- Preserve RUT, contact, navigation, legal links, cookie preferences, site credit, and social/external semantics.
- Choose the audit’s single restrained rainbow signature location, preferably the Footer; remove or neutralize repeated site-frame usage without deleting route instances owned by later stages.

## Explicit non-goals

- Do not change navigation order, route destinations, donation tracking, cookie behavior, theme persistence, or external-link primitives.
- Do not change PageLayout structure unless required for the verified frame behavior.
- Do not restyle route-level headers or CTA sections.
- Do not perform a cross-site search-and-delete of every RainbowDivider; route owners and final integration handle residual instances.

## Implementation requirements

- Header shadow, if retained, appears only after scroll and remains extremely subtle.
- Drawer focus trap/return, `inert`, Escape, backdrop, scroll locking, and no-layout-shift behavior must remain intact.
- The Footer’s legal identity must remain easy to locate and must not become low-contrast.
- Social icons become simple accessible links and must not compete with conversion actions.
- Cookie-preferences control remains functional and visible.
- Site frame appearance is identical across routes and equally intentional in both themes.

## Constraints and invariants

- Preserve consent, analytics, CSP, link tracking, theme anti-flash, and PageLayout shell behavior.
- Avoid fixed elements obscuring focus or content.
- No new client dependencies or decorative JavaScript.
- Maintain 44px targets, visible focus, keyboard operation, and WCAG AA.

## Relevant tests and visual checks

Run scoped format/lint, build, `tests/nav.spec.ts`, and relevant analytics-consent/a11y checks.

Visually inspect header states (top/scrolled, desktop/mobile, drawer open/closed) and Footer on at least `/`, `/donar/`, and `/contacto/` in both themes. Test keyboard opening, focus cycling, Escape, focus return, backdrop close, theme toggle, cookie preferences, and all Footer links.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Donation is the only filled desktop header action.
- Brand, active navigation, and theme controls no longer use pill styling.
- Drawer accessibility behavior is unchanged and targets meet 44px.
- Footer is informative without reading as another large CTA.
- RUT, legal/contact details, cookie control, credit, and link semantics remain present.
- The institutional frame introduces no glow, decorative blur, or route-specific variation.

## Required commit message guidance

Create one focused commit:

`style: simplify the institutional site frame`
