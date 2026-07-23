# Brigada Galgos — Product Requirements Document

## Scope

This document lists the functional requirements of the Brigada Galgos website as it exists today, expanded with user stories, acceptance criteria, edge cases, and prioritization. It covers pages, features, content behaviors, and rules that the site enforces. The audience is future maintainers and AI agents.

## Pages and routes

### Public pages

| Route                    | Purpose          | Key content                                                                                                                                      |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                      | Home             | Hero, mission, three main CTAs, featured dogs, success stories, how to help, donation callout, footer                                            |
| `/adoptar/`              | Adoption listing | Filterable dog cards, dog profile lightbox, process explanation, CTAs                                                                            |
| `/adoptar/<slug>/`       | Dog profile      | Full profile page per active dog: gallery, details, per-dog meta description and OG image, breadcrumb, WhatsApp + form CTAs, native share button |
| `/casos-de-exito/`       | Success archive  | Complete build-time collection of adopted galgos, galleries and route back to active adoption                                                    |
| `/por-que-galgos/`       | Why galgos       | Editorial sections, FAQ, selected success stories                                                                                                |
| `/hogar-temporal/`       | Foster program   | Requirements, what Brigada covers, CTA                                                                                                           |
| `/donar/`                | Donations        | Impact amounts, bank details, eSponsor card, transparency notes                                                                                  |
| `/colaboradores/`        | Supporters       | Logo grid of institutions, companies, and people                                                                                                 |
| `/contacto/`             | Contact          | WhatsApp, email, social links, form                                                                                                              |
| `/preguntas-frecuentes/` | FAQ              | Full FAQ grouped by topic                                                                                                                        |
| `/politica-de-cookies/`  | Cookie policy    | Plain explanation of cookies and consent                                                                                                         |
| `/404/`                  | Not found        | Helpful redirect to main pages                                                                                                                   |

### Content-driven routes

| Route         | Purpose      | Key content                                                                          |
| ------------- | ------------ | ------------------------------------------------------------------------------------ |
| `/blog/`      | Blog listing | Published (non-draft) posts, newest first                                            |
| `/blog/<id>/` | Blog post    | Full post body (headings start at `##`; the page renders the only `h1` from `title`) |

Success stories are still rendered only through cards and lightboxes on listing pages; there is no individual success-story detail page. Dog profiles now render at `/adoptar/<slug>/` for every dog with `active !== false` (see the table above). Blog posts with `draft: true` are excluded from both `/blog/` pages and the RSS feed at `/feed.xml`.

### Utility / feed routes

| Route                                   | Purpose                             |
| --------------------------------------- | ----------------------------------- |
| `/feed.xml`                             | RSS feed from the `blog` collection |
| `/schemamap.xml`                        | Schema.org sitemap index            |
| `/schema/post.json`                     | Post schema metadata                |
| `/591c2b87f0b68c44f260215f5d8e9da3.txt` | IndexNow verification file          |
| `/.well-known/api-catalog`              | API catalog                         |

## User stories and acceptance criteria

### Home page

**US-HOME-1: As a visitor, I want to understand immediately what Brigada Galgos does so that I know I am in the right place.**

- **Acceptance criteria:**
  - The hero section states the mission within the first viewport.
  - The three primary CTAs (adopt, foster, donate) are visible above the fold on desktop and within one scroll on mobile.
  - The CTAs use verb-first copy: "Quiero adoptar", "Puedo ser hogar temporal", "Voy a apoyar un galgo" or equivalent.

**US-HOME-2: As a potential adopter, I want to see real galgos looking for a home so that I can imagine adopting one.**

- **Acceptance criteria:**
  - At least one featured adoption dog card is shown on the home page.
  - Each card shows a photo, name, age, weight, and a short character sketch.
  - The card links to `/adoptar/` or opens the dog profile lightbox.

**US-HOME-3: As a visitor, I want to read success stories so that I trust the adoption process.**

- **Acceptance criteria:**
  - Three or fewer success stories are shown as a preview after the adoption, mission, trust and educational content.
  - The preview links to the complete `/casos-de-exito/` archive; it does not fetch additional stories.
  - Stories are displayed in a consistent card format with photo when available, name, and excerpt.

### Adoption page (`/adoptar`)

**US-ADOPT-1: As a visitor, I want to browse all active galgos in adoption so that I can find one that fits my life.**

- **Acceptance criteria:**
  - All dogs with `active: true` in `src/content/adoption-dogs/` are listed.
  - Dogs with `active: false` are not shown.
  - Dogs are sorted by `order` when provided, otherwise by a sensible default (e.g., file order or name).

**US-ADOPT-2: As a visitor, I want to filter dogs by sex and need so that I can narrow down the list.**

- **Acceptance criteria:**
  - Filter chips are available for sex (Macho / Hembra) and current need (Adopción / Hogar temporal / Adopción u hogar temporal).
  - Selecting a filter updates the visible cards without a full page reload.
  - Multiple filters can be active at the same time.
  - If no dogs match the selected filters, an empty state is shown.

**US-ADOPT-3: As a visitor, I want to view a dog's full profile so that I can decide whether to contact Brigada.**

- **Acceptance criteria:**
  - Clicking a dog card opens a lightbox with the full profile.
  - The lightbox shows up to 3 gallery images.
  - The lightbox shows details, character sketch, and current need.
  - The lightbox provides a clear WhatsApp CTA and a link to the adoption form.

### Why galgos page (`/por-que-galgos`)

**US-WHY-1: As a potential adopter, I want to understand if a galgo fits my lifestyle so that I can make an informed decision.**

- **Acceptance criteria:**
  - The page answers common lifestyle questions (apartment life, exercise, children, other animals, experience).
  - Answers are honest and avoid overpromising (uses "muchos", "la mayoría", or "caso a caso" where appropriate).
  - FAQ structured data is present.

**US-WHY-2: As a visitor, I want to see real success stories on this page so that I feel encouraged.**

- **Acceptance criteria:**
  - Exactly 3 success stories are shown per build.
  - The selection is random per build to surface different dogs over time.
  - Each story is 260 characters or fewer and explicitly mentions the adoption outcome.

### Foster page (`/hogar-temporal`)

**US-FOSTER-1: As a potential foster, I want to understand what is expected of me so that I can decide if I can help.**

- **Acceptance criteria:**
  - The page clearly states what Brigada covers (veterinary care, vaccines, antiparasitics, food when confirmed).
  - The page clearly states what the foster provides (safe space, daily walks, patience, calm routine).
  - The tone is inviting and does not guilt-trip.

**US-FOSTER-2: As a potential foster, I want an easy way to start the conversation so that I can ask questions.**

- **Acceptance criteria:**
  - A WhatsApp CTA is present and clearly labeled.
  - The CTA copy invites questions, not only decisions.

### Donate page (`/donar`)

**US-DONATE-1: As a potential donor, I want to know how my money will be used so that I can trust the organization.**

- **Acceptance criteria:**
  - The page lists concrete impact amounts tied to outcomes (food, vaccines, veterinary care, exams, etc.).
  - It states clearly that there is no state funding and that the team is all-volunteer.
  - It states that donations are not used for salaries, paid advertising, buying dogs, or office rent.

**US-DONATE-2: As a potential donor, I want to choose how to give so that I can use my preferred method.**

- **Acceptance criteria:**
  - Bank transfer details are displayed with a copy action.
  - A recurring donation option via eSponsor is linked.
  - Both one-time and recurring giving feel useful and concrete.

### Collaborators page (`/colaboradores`)

**US-COLLAB-1: As a visitor, I want to see who supports Brigada Galgos so that I can trust the organization.**

- **Acceptance criteria:**
  - All supporters from `src/content/supporters/` are displayed.
  - Each supporter shows a logo with accessible alt text (`logoAlt`).
  - Logos are local images processed by Astro assets.
  - Supporters are ordered consistently (by `order` field and `kind`).

### Contact page (`/contacto`)

**US-CONTACT-1: As a visitor, I want to contact Brigada easily so that I can ask questions or start the adoption process.**

- **Acceptance criteria:**
  - WhatsApp, email, and social links are visible.
  - A contact form is present with validation for required fields.
  - The form emits analytics events for invalid, success, and error states.

**US-CONTACT-2: As a visitor, I want to feel comfortable reaching out even if I am not ready to decide.**

- **Acceptance criteria:**
  - The copy invites questions, not only decisions.
  - No field asks for sensitive personal data beyond what is needed for contact.

### FAQ page (`/preguntas-frecuentes`)

**US-FAQ-1: As a visitor, I want to find answers to common questions quickly so that I do not need to contact the team for basic information.**

- **Acceptance criteria:**
  - Questions are grouped by topic (about galgos, adoption, foster, donations, guarantees).
  - Each question can be expanded to show the answer.
  - FAQ structured data is present for SEO.
  - The answer format follows the voice and tone guide: direct answer first, then reassurance or next steps.

### Cookie policy (`/politica-de-cookies`)

**US-COOKIE-1: As a visitor, I want to understand what cookies and trackers are used so that I can make an informed consent choice.**

- **Acceptance criteria:**
  - The page explains what cookies and trackers are used (GTM/GA4 after consent, Cloudflare Web Analytics, consent cookie).
  - It describes how to change or withdraw consent.
  - The language is plain and readable, not legalistic.

## Content rules

- Dog profiles must include: name, sex, age, weight, details, current need, character sketch, and gallery.
- Success stories must be 260 characters or fewer and explicitly mention the adoption outcome.
- Hidden dogs need a reason and a date; they expire after 90 days.
- Supporter logos must be local images with accessible alt text.
- Blog posts require title, pub date, author, description, and optional category/hero image.

## Edge cases

### Adoption page filters

- **No active dogs:** If no dogs are active, show an empty state that invites the visitor to contact Brigada or check back later.
- **No filter matches:** If filters return no results, show a message that lets the visitor reset filters or adjust criteria.
- **JavaScript disabled:** The filter chips should degrade gracefully; if filters are client-side only, the full unfiltered list remains visible.

### Dog lightbox

- **Missing gallery image:** The lightbox should handle a missing or broken image gracefully without crashing.
- **Single-image dog:** The lightbox should not show navigation arrows if only one image exists.
- **No WhatsApp response:** The CTA opens WhatsApp; it does not depend on a server response.

### Success stories

- **Story exceeds 260 characters:** The build fails (`source-hygiene.test.ts`) so the violation is caught before deploy.
- **Story does not mention adoption:** The build fails.
- **Fewer than 3 success stories:** The `/por-que-galgos` page should handle fewer stories without breaking layout.

### Hidden dogs

- **Missing `hiddenSince` or `hiddenReason`:** The build fails with a clear Zod error.
- **Hidden dog older than 90 days:** `source-hygiene.test.ts` fails.
- **Dog reactivated:** Set `active: true` and optionally remove `hiddenSince`/`hiddenReason`.

### Contact form

- **Invalid submission:** Show field-level errors and emit `contact_form_invalid`.
- **Successful submission:** Show confirmation and emit `contact_form_success`.
- **Submission failure:** Show a helpful error and emit `contact_form_error`.
- **No JavaScript:** The form should still submit if the underlying HTML form is functional.

### Analytics and consent

- **Consent already given:** The banner should not reappear on the next visit.
- **Consent rejected:** GTM must not load; known GA/GTM cookies are cleared.
- **Consent changed:** The dataLayer updates with the new Consent Mode v2 state.

### Donations

- **Copy action fails:** The bank details remain visible and selectable for manual copying.
- **eSponsor unavailable:** The eSponsor card still displays the link; Brigada's direct bank details are the fallback.

### Theme

- **No stored preference:** Respect `prefers-color-scheme`.
- **ClientRouter transition:** The theme persists across page transitions without a flash.
- **LocalStorage cleared:** The theme falls back to `prefers-color-scheme` on next load.

## Prioritization

### Must-have (P0)

These are core to the site's purpose and must be maintained for every release:

- Home page with mission and primary CTAs.
- Adoption page listing active dogs with filters and lightbox.
- Contact page with WhatsApp, email, and form.
- Content collection validation for dogs, stories, supporters, and blog.
- Consent-first analytics (GTM/GA4 only after explicit consent).
- Responsive images and accessible markup.
- Build, format, lint, and test passing.

### Should-have (P1)

These support the core goals and should be kept healthy:

- Why galgos page with FAQ and success stories.
- Foster page with clear requirements and CTA.
- Donate page with bank details and eSponsor link.
- Collaborators page with supporter logos.
- FAQ page with grouped questions and structured data.
- Cookie policy page.
- RSS feed and sitemap.
- Lighthouse 100 target for checked pages.

### Nice-to-have (P2)

These can be deferred or improved incrementally:

- Individual success story detail pages.
- Search across content.
- More advanced analytics (funnel tracking, A/B testing).
- Multi-language support.
- Server-side form handling.
- Admin dashboard for content editors.

## Analytics and privacy

- GTM and GA4 load only after explicit consent.
- Consent state updates the dataLayer with Consent Mode v2.
- Rejection clears known GA/GTM cookies.
- Events are tracked for CTAs, navigation, social links, galleries, filters, forms, and consent actions.

## SEO and sharing

- Every indexable page has a unique title, meta description, canonical URL, and OG image.
- JSON-LD is generated for Organization, WebSite, WebPage, BreadcrumbList, and FAQPage.
- Sitemap is generated automatically; RSS is generated from the blog collection.

## Performance

- Target Lighthouse 100 for checked pages.
- Images are generated as AVIF/WebP with responsive srcsets.
- CSS is inlined only when it improves performance (`inlineStylesheets: "auto"`).
- Prefetch is enabled on hover.

## Non-functional requirements

- Static build only; no server runtime.
- Node 22+ with npm and committed lockfile.
- Formatted, linted, and tested before delivery.
- No absolute filesystem paths in repo files or docs.
- UTF-8 preserved everywhere.

## Related documents

- `docs/site-brief.md` — product intent and success metrics
- `docs/spec.md` — technical specification
- `docs/feature-inventory.md` — current pages and features
- `docs/content-model.md` — content schemas and editorial rules
- `docs/architecture-map.md` — component and content flow
- `AGENTS.md` — operational guidance
- `docs/developer-reference.md` — detailed technical reference

## Last updated

2026-07-06
