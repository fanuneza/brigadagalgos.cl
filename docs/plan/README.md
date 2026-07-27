# Visual-polish implementation plan

This directory is the execution source for the Brigada Galgos visual-polish project. It divides the work into small, reviewable implementation stages while preserving `AGENTS.md` and current project documentation as repository-wide authority.

## Shared design direction

The visual north star is **editorial restraint with photographic primacy**. Keep Barlow, Barlow Condensed, the established brand palette, local photography, static rendering, and the existing content architecture. Make photography, proportion, typography, whitespace, alignment, and practical information carry the presentation. Decorative CSS must become exceptional rather than routine.

Across every stage:

- Use Barlow Condensed selectively for page titles, major section titles, dog names, and large confirmed statistics; use Barlow for supporting hierarchy and prose.
- Use cyan for links, focus, selection, and navigation emphasis; magenta for branding and rare editorial emphasis; orange for primary conversion; green for confirmed positive/completed states; and purple only as a rare illustrative accent.
- Prefer flat neutral surfaces, quiet borders, modest radii, and separators. Remove routine gradients, glows, shadows, hover lift, photographic rotation, pill styling, and repeated multicolor treatments.
- Give each content type its own composition: photographic dog profiles, editorial success stories, structured guidance, evidence strips, financial panels, channel rows, and chronological processes.
- Allow one visually dominant action per grouping while preserving every existing route, destination, tracking attribute, consent rule, and shared link primitive.
- Treat light and dark modes, mobile and desktop composition, WCAG 2.2 AA, 44px targets, reduced motion, progressive enhancement, static output, responsive images, and Lighthouse performance as non-negotiable.

## Working contract

- The Sol-5.6 orchestrator owns dependency management, agent selection, dispatch, conflict resolution, integration review, final testing, representative visual checks, Lighthouse validation, and documentation consistency.
- Every stage must be completed by a fresh agent that begins with no assumed repository context.
- Before editing, every stage agent must read `AGENTS.md` completely, its assigned stage file completely, and the project documentation listed in that stage. Each stage file contains the design context needed for its own work.
- Every stage agent must run the required jCodeMunch opening sequence and inspect the current repository. Paths in these files are verified planning anchors, not permission to skip discovery.
- Astro Docs MCP is mandatory before changing any current Astro API or framework-sensitive behavior.
- A stage agent must not expand its scope to fix unrelated visual residue. Record it for the orchestrator instead.
- Stages are rerunnable: inspect the integrated state first, apply only unmet acceptance criteria, and never duplicate tokens, selectors, markup, tests, or compatibility shims. If a stage is already fully satisfied, report that evidence to the orchestrator instead of creating an empty or destructive commit.
- Each completed stage produces exactly one focused commit using the guidance in its stage file.
- Stage agents run only scoped checks. They do not own final integration, the full regression suite, cross-site Lighthouse, or the final documentation pass.
- Baseline and comparison screenshots are review artifacts. Store them outside the repository unless the orchestrator explicitly establishes a tracked artifact convention.

## Orchestrator preflight

Before dispatching implementation stages, the orchestrator must:

1. Confirm the worktree state and preserve unrelated user changes.
2. Read `AGENTS.md`, this index, every stage file, and the project documentation referenced by those stages.
3. Resolve and refresh the jCodeMunch index if needed.
4. Inspect `package.json`, current scripts, and the current test topology; do not infer command names.
5. Select one current active dog profile route for repeated profile checks.
6. Capture baseline screenshots in explicit light and dark themes at representative mobile and desktop widths for `/`, `/adoptar/`, the selected dog profile, `/hogar-temporal/`, `/donar/`, `/casos-de-exito/`, `/por-que-galgos/`, `/contacto/`, and `/colaboradores/`.
7. Record any pre-existing check failures before implementation.
8. Decide the integration branch/commit strategy. Do not ask stage agents to rewrite or squash another stage’s commit.

## Stage order and dependencies

| Stage | Name                                                                         | Depends on              | May run in parallel after dependencies       | Suggested routing               |
| ----- | ---------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- | ------------------------------- |
| 01    | [Visual foundations](./01-visual-foundations.md)                             | Preflight               | No                                           | Sol review or experienced Terra |
| 02    | [Typography, rhythm, and page heroes](./02-typography-rhythm-page-heroes.md) | 01 integrated           | No; it shares `global.css` with 03           | Experienced Terra               |
| 03    | [Actions and links](./03-actions-and-links.md)                               | 02 integrated           | No; finish the shared global selectors first | Terra                           |
| 04    | [Institutional frame](./04-institutional-frame.md)                           | 03 integrated           | 05 and 06                                    | Terra                           |
| 05    | [Gallery and photography system](./05-gallery-photography.md)                | 03 integrated           | 04 and 06                                    | Experienced Terra               |
| 06    | [Form system](./06-form-system.md)                                           | 03 integrated           | 04 and 05                                    | Experienced Terra               |
| 07    | [Success-story presentation](./07-success-stories.md)                        | 02, 03, 05 integrated   | 10, 12, 13, 15, 16                           | Terra                           |
| 08    | [Homepage identity and evidence](./08-homepage-identity-evidence.md)         | 02–05 and 07 integrated | 10, 12, 13, 14, 15, 16                       | Experienced Terra               |
| 09    | [Homepage guidance and conversion](./09-homepage-guidance-conversion.md)     | 08 integrated           | 10, 11, 12, 13, 14, 15, 16                   | Terra                           |
| 10    | [Adoption listing](./10-adoption-listing.md)                                 | 02, 03, 05 integrated   | 07, 08, 12–16                                | Experienced Terra               |
| 11    | [Dog profile](./11-dog-profile.md)                                           | 10 integrated           | 09, 12–16                                    | Experienced Terra               |
| 12    | [Foster route](./12-foster-route.md)                                         | 02–04 and 06 integrated | 07–11, 13–16                                 | Terra                           |
| 13    | [Donation route](./13-donation-route.md)                                     | 02–04 integrated        | 07–12, 14–16                                 | Experienced Terra               |
| 14    | [Why galgos route](./14-why-galgos-route.md)                                 | 02–05 and 07 integrated | 09–13, 15, 16                                | Terra                           |
| 15    | [Contact route](./15-contact-route.md)                                       | 02–04 and 06 integrated | 07–14, 16                                    | Experienced Terra               |
| 16    | [Collaborators and supporter trust](./16-collaborators-supporter-trust.md)   | 02–04 integrated        | 07–15                                        | Terra                           |

“Integrated” means the orchestrator has reviewed and incorporated the dependency commit; the mere existence of a stage commit is insufficient.

## Ownership and conflict boundaries

- Stages 01–03 are serialized because they intentionally touch `src/styles/tokens.css` and/or `src/styles/global.css`.
- Stage 04 owns `Navbar`, `Footer`, their CSS, and the final restrained rainbow signature. Route agents must not restyle the site frame.
- Stage 05 owns shared gallery markup, scripts, and CSS. Route agents consume its ratio/control API and may set route-specific variants without duplicating gallery behavior.
- Stage 06 owns shared form states and form behavior. Foster and contact agents compose those primitives but do not create divergent validation systems.
- Stage 07 owns `StoryCard.astro` and the base story presentation in `stories.css`. Homepage agents only own homepage-specific story composition.
- Stage 08 owns the homepage hero, featured adoption preview, mission, and homepage evidence strip.
- Stage 09 owns the homepage why/process/help/donation ending sequence.
- Stage 10 owns adoption listing cards, filters, and listing-specific facts/actions.
- Stage 11 owns profile-only layout and utilities. It must not regress the listing contract established by stage 10.
- Stage 13 owns donation copy controls and financial panels; no other stage changes confirmed financial data.
- Stage 16 owns the collaborators route and supporter presentation only. Homepage statistics belong to stage 08; footer legal identity belongs to stage 04.

If a necessary change crosses an ownership boundary, the stage agent must stop that part, document the needed follow-up, and let the orchestrator resolve or reassign it.

## Integration checkpoints

### Checkpoint A: foundation contract

After stages 01–03, the orchestrator reviews the combined token/global diff, resolves compatibility aliases, builds the site, and compares `/` and `/adoptar/` in both themes at mobile and desktop sizes. Do not dispatch route work while global typography or control regressions remain unexplained.

### Checkpoint B: shared systems

After stages 04–06, the orchestrator reviews header/footer stability, gallery variants, form states, theme behavior, progressive enhancement, and existing interaction tests. This checkpoint establishes the reusable contracts all route stages must consume.

### Checkpoint C: story and adoption primitives

After stages 07, 10, and 11, the orchestrator verifies that active dogs, profiles, and adopted stories are visually distinct; galleries, filters, sharing, tracking, and content rules remain intact; and shared CSS has not crossed ownership boundaries.

### Checkpoint D: route composition

After stages 08, 09, and 12–16, the orchestrator resolves CSS/import conflicts, checks that route compositions feel related without reverting to one card silhouette, and performs representative light/dark and responsive comparisons before final validation.

## Final orchestrator responsibilities

Only after every accepted stage is integrated, the Sol-5.6 orchestrator must:

1. Review the complete diff against this index, every accepted stage, `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, and relevant files under `docs/`.
2. Resolve conflicts and remove compatibility aliases or obsolete overrides only when proven safe.
3. Verify analytics, consent, routing, content schemas, structured data, redirects, image processing, and theme anti-flash behavior did not change unintentionally.
4. Perform cross-site light/dark and responsive reviews at 320, 375, 430, 768, 1024, 1280, and 1440+ px, plus keyboard, 200% zoom, reduced-motion, and representative no-JavaScript checks.
5. Run the complete repository-required validation from `AGENTS.md` and `package.json`, including formatting, linting, build, unit/source-hygiene tests, Playwright, accessibility coverage, and any defined browser regression suites.
6. Run Lighthouse on `/`, `/adoptar/`, one active `/adoptar/[slug]/`, `/hogar-temporal/`, `/donar/`, `/casos-de-exito/`, and `/contacto/`; preserve the project’s established 100 targets.
7. Review final before/after screenshots for `/`, `/adoptar/`, one dog profile, `/hogar-temporal/`, `/donar/`, `/casos-de-exito/`, `/por-que-galgos/`, `/contacto/`, and `/colaboradores/` in both themes.
8. Update current documentation only where the implemented visual system makes it inaccurate. Keep `AGENTS.md` operational and human-facing docs appropriately concise.
9. Produce a final report containing the implemented visual direction, changed files grouped by stage, representative before/after screenshots, validation commands/results, Lighthouse and accessibility results, light/dark and responsive verification, remaining risks, and recommendations intentionally deferred because they would change product scope, content, structure, or architecture.

The orchestrator must not hide failed checks, waive Lighthouse regressions, or fold unrelated cleanup into the visual-polish series.
