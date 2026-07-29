# Impeccable UX audit

Audit date: 2026-07-29

Scope: all public routes, shared layouts, navigation, consent, active dog
content, adoption/foster/donation/contact journeys, responsive behavior,
theming, accessibility, performance, tests, and design-system usage.

## Audit health

| Dimension         |     Score | Key finding                                                                                      |
| ----------------- | --------: | ------------------------------------------------------------------------------------------------ |
| Accessibility     |       3/4 | Strong semantics, but one serious keyboard failure and incomplete test truth                     |
| Performance       |       4/4 | Lighthouse is 99–100 and the static/image pipeline is excellent                                  |
| Responsive design |       2/4 | Core routes fit at 390px, but the shared shell overflows at 320px and enlarged text magnifies it |
| Theming           |       3/4 | Light/dark tokens are coherent; a small set of literals and untested exceptions remain           |
| Anti-patterns     |       2/4 | Distinctive brand, but repeated eyebrows, card grids, and page-tail grammar feel templated       |
| **Total**         | **14/20** | **Good foundation; address the weak dimensions before adding more surface area**                 |

## Anti-pattern verdict

The site does not look generically AI-generated. Local dog photography, the
Barlow/Barlow Condensed identity, the rainbow divider, humane copy, and the
specific rescue content give it a recognizable voice.

It does, however, reuse a saturated landing-page grammar too often:

- 51 eyebrow references across pages and components;
- five-card and three-card grids used where prioritization or a simple list
  would be clearer;
- the same centered PageHero, divider, section stack, and boxed tail CTA across
  most routes;
- all headings globally uppercased, including quiet and information-dense
  content;
- interactive galleries repeated inside lists, multiplying controls without
  improving the decision.

The result is coherent but over-systematized. Important routes begin to feel
interchangeable even though adoption, fostering, donation, FAQ, and contact
have different user questions.

## Executive summary

No P0 blocker was found. The audit found **7 P1**, **10 P2**, and **5 P3**
issues.

The most important problems are:

1. The fixed consent banner covers core content and CTAs on first visit.
2. The global orange donation CTA competes with adoption, while the navigation
   hides “Por qué galgos” and FAQ behind the footer.
3. The shared shell horizontally overflows at the supported 320px minimum.
4. Adoption profiles repeat generic prose and omit decision-critical,
   structured compatibility information.
5. `/adoptar/` asks visitors to “Postular” before they meet a dog, then gives
   listing cards no equally clear “Conocer” action.
6. The homepage reaches roughly 10,350px and 87 visible interactive elements
   at 390px, largely because each card carries a full gallery.
7. Accessibility tests globally disable three rules, miss several route
   families, and do not catch the confirmed cookie-policy table failure.

## Verified evidence

- `npm run build`: passed; Astro reported 0 diagnostics and 20 valid pages.
- `npm run format:check`: passed.
- `npm run lint`: passed.
- `npm test`: 63 tests passed (21 Vitest and 42 Playwright).
- `npm run test:lighthouse`: passed on home, adopt, contact, donate, and foster.
  Performance scored 0.99–1.00; accessibility, best practices, and SEO scored
  1.00 under the current assertion configuration.
- Full Axe run without the repository exclusions: one serious
  `scrollable-region-focusable` violation on
  `.cookie-policy__table-wrap` in light and dark modes.
- 14 routes inspected at 390×844 and 1440×1000: no page-level horizontal
  overflow, console error, failed request, empty link, or broken loaded image.
- 320px inspection: the document becomes 346px wide on core routes because the
  navbar cannot contract; gallery tracks add off-canvas descendants even when
  visually clipped.
- The Impeccable detector found design-token drift in cookie, form, gallery,
  stepper, navbar, and donation styles. Its empty-image warnings are false
  positives for client-populated/lazy gallery markup and must not be treated as
  defects without runtime evidence.

## Detailed findings

### P1 — Major

#### P1-01: consent obscures the primary task

- **Location:** `src/components/sections/CookieBanner.astro`,
  `src/styles/components/cookie-banner.css`
- **Impact:** first-time visitors lose the middle of the adoption hero, first
  dog row, profile description and CTA group, foster requirements, donation
  methods, or contact choices behind a fixed high-contrast bar.
- **Evidence:** reproduced on all core desktop and mobile captures.
- **Recommendation:** keep accept/reject parity and consent defaults, but use a
  compact non-obstructive placement and reserve layout space where necessary.
  Test every core route before and after a decision.
- **Task:** T01.

#### P1-02: global action hierarchy contradicts the adoption goal

- **Location:** `src/components/Navbar.astro`, `src/components/Footer.astro`,
  `src/config/site.ts`
- **Impact:** orange “Apóyanos” remains the strongest action above the fold on
  every route, competing with “Quiero adoptar” or “Postular”. Education routes
  that reduce adoption anxiety are absent from the primary navigation.
- **Recommendation:** keep donation reachable but subordinate it using the
  existing action vocabulary; prioritize adoption, living-with-galgos
  education, and FAQ in the route architecture.
- **Task:** T02.

#### P1-03: 320px reflow failure in the shared shell

- **Location:** `src/styles/components/navbar.css`,
  `src/components/Navbar.astro`, shared container assumptions
- **Impact:** people using a narrow device or zoomed layout must pan
  horizontally; controls can sit partly outside the viewport.
- **Standard:** WCAG 1.4.10 Reflow.
- **Evidence:** 320px viewport produced a 346px document width on every core
  route.
- **Recommendation:** allow brand text and controls to contract deliberately,
  then add a 320px and enlarged-text regression.
- **Task:** T02 and T15.

#### P1-04: accessibility coverage is not telling the whole truth

- **Location:** `tests/a11y.spec.ts`,
  `tests/a11y-disabled-rules.json`, `.lighthouserc.cjs`
- **Impact:** a green badge can coexist with untested profiles, FAQ, blog,
  cookie policy, dark mode, and three globally disabled rule families.
- **Recommendation:** remove stale blanket exclusions, cover route templates
  and themes, and require a documented local exception for any future disable.
- **Task:** T03.

#### P1-05: cookie-policy table is not keyboard-scrollable

- **Location:** `src/components/sections/CookiePolicyArticle.astro`,
  `src/styles/components/cookie-policy.css`
- **Impact:** keyboard users cannot reach and horizontally scroll the table on
  narrow screens.
- **Standard:** WCAG 2.1.1 Keyboard; Axe
  `scrollable-region-focusable`.
- **Recommendation:** make the wrapper focusable with an accessible label and
  visible focus, or restructure the table for narrow layouts.
- **Task:** T03.

#### P1-06: dog profiles lack enough confirmed decision support

- **Location:** active entries in `src/content/dogs/`,
  `src/content.config.ts`, `src/pages/adoptar/[slug].astro`
- **Impact:** users cannot quickly judge children, cats, other dogs, home
  environment, energy, current location, or special care. Generic
  `currentNeed: "Adopción"` adds little, while `details` and
  `characterSketch` often repeat.
- **Evidence:** Blue repeats “amigable y sociable con otros perritos y
  animales” in both fields; location exists in content but is dropped from the
  card model and profile.
- **Recommendation:** add optional, source-backed compatibility/care fields
  with explicit unknown and case-by-case states. Never infer a positive claim
  from absence.
- **Task:** T04 and T06.

#### P1-07: the adoption flow asks for commitment before orientation

- **Location:** `src/pages/adoptar.astro`, `src/components/DogCard.astro`
- **Impact:** the hero sends visitors to an external Google form before they
  see dogs or understand the process, while standard listing cards rely on a
  small name link instead of an obvious dog-specific next step.
- **Recommendation:** make “Ver galgos” the first-page action, use explicit
  “Conocer a [nombre]” actions, and present application expectations before
  the external handoff.
- **Task:** T05.

### P2 — Minor but meaningful

#### P2-01: excessive interaction density on home and listings

Full galleries inside repeated cards create arrows, dots, zoom targets, and
links for every dog/story. At 390px the homepage exposed about 87 interactive
elements and measured roughly 10,350px tall. Simplify list media to one strong
photo and keep the complete gallery on the profile/lightbox. **Tasks:** T05,
T07, T12.

#### P2-02: gallery and filter targets are visually small

Carousel arrows are 40px, dots are 24px, and filter chips are 36px high.
Lighthouse currently passes target-size because spacing helps, so this is not
reported as a confirmed WCAG failure. It is still harder to operate for motor
and one-handed mobile users. **Tasks:** T02, T05.

#### P2-03: the homepage repeats routes after already presenting them

Featured dogs, mission, “why galgos”, stories, a three-card help grid, and a
donation band form a long sequence. “Adoptar” is introduced in the hero,
featured listing, and help cards before the footer. The final third dilutes the
adoption decision. **Task:** T07.

#### P2-04: FAQ is a long wall of answers

The questions are clear and linkable, but there is no table of contents,
topic navigation, progressive disclosure, or contextual deep-linking from
profiles/process steps. The route is also absent from the main navigation.
**Tasks:** T02, T08.

#### P2-05: foster route explains well but proves little

The route has no dog or foster-home photography, no real foster story, and no
visible answer to the emotional concern about saying goodbye. Three requirement
cards and two responsibility boxes carry most of the page. **Task:** T09.

#### P2-06: donation route is concrete but visually repetitive

Transfer, subscription, four amount boxes, four impact rows, four exclusions,
and three other-help items repeat the same claims. There is no local dog image
or case-linked proof beside the decision. **Task:** T10.

#### P2-07: contact creates five detours before the form

Adopt, foster, donate, press, and other-question cards give equal visual weight.
The last row is imbalanced on desktop, and the first card is covered by consent
on mobile. Users who already chose a topic must scan routes before reaching
the form. **Task:** T11.

#### P2-08: card and eyebrow grammar is overused

The detector count and source inventory show 51 eyebrow references and several
identical card grids. The system is coherent, but route-specific information
loses hierarchy. **Task:** T13.

#### P2-09: secondary content does not consistently return to active adoption

Blog and stories contain useful proof, but conversion cues are inconsistent;
collaborators prioritizes organizational structure over what that support
changes for a dog; 404 presents five plain links without a clear first choice.
**Task:** T12.

#### P2-10: UX success is measured mostly as clicks, not a funnel

Existing event helpers are consent-aware, but the repository lacks a single
documented sequence from dog discovery to profile, contact/form intent, and
outbound application. **Task:** T14.

### P3 — Polish

1. `src/pages/donar.astro` contains “a traves” without the accent. **T10.**
2. `src/styles/global.css` repeats the `a:not([class])` selector. **T13.**
3. The unused `TrustStatsSection` full variant and stale `/donar/` comment
   remain documented in `docs/plan/open-decisions.md`. **T13.**
4. Several literal colors and off-ramp type sizes bypass existing tokens in
   cookie, form, gallery, navbar, donation, and stepper CSS. Use the nearest
   current token; do not add tokens merely to preserve drift. **T13.**
5. Dark mode works semantically but has no visual-regression coverage on the
   main journeys. **T15.**

## Positive findings to preserve

- The site has a clear product position and humane, specific Chilean Spanish
  voice.
- Local photography is central on adoption and story surfaces.
- Astro produces static output with optimized AVIF/WebP variants.
- Consent correctly prevents GTM from loading before acceptance.
- One H1, metadata, internal links, and alt text are validated for all built
  pages.
- Focus styles, skip link, native dialog lightbox, reduced-motion handling,
  labels, live regions, and semantic landmarks are already present.
- Adoption support after handoff appears throughout the relevant copy.
- Donation amounts and exclusions are unusually concrete and trustworthy.
- The design tokens and hierarchy vocabulary are documented and broadly used.
- The build, lint, source hygiene, Playwright suite, and Lighthouse baseline
  are healthy.

## Recommended Impeccable sequence

1. **P1 `/impeccable harden`**: consent, 320px reflow, and accessibility truth.
2. **P1 `/impeccable clarify`**: adoption data, application sequencing, FAQ,
   and contact routing.
3. **P2 `/impeccable distill`**: homepage, list galleries, donation, and card
   repetition.
4. **P2 `/impeccable layout`**: route-specific hierarchy without changing the
   design system.
5. **P3 `/impeccable polish`**: cross-theme and cross-route consistency after
   the functional work lands.

Re-run the audit after Wave 6 and compare against this baseline.
