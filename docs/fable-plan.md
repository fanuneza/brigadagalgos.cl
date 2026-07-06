# Fable Plan — Audit Findings and Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise brigadagalgos.cl from "solid" to "stunning": fix the few real defects, ship shareable per-dog pages and a minimal blog, and polish typography, hero, and motion so more visitors stay, keep reading, and commit to adopt, foster, or donate.

**Architecture:** Astro 7 static site on Cloudflare Pages. Content collections (adoption-dogs, success-dogs, supporters, blog) drive pages; styling is design tokens plus modular component CSS (no Tailwind); client JS is minimal, per-feature scripts under `src/scripts/`.

**Tech Stack:** Astro 7, TypeScript, vanilla CSS with design tokens, `@fontsource` fonts, `@jdevalk/astro-seo-graph`, Vitest, Playwright, Lighthouse CI.

## Global Constraints

Every task implicitly includes these. Copied from `AGENTS.md`, `docs/site-brief.md`, and `docs/voice-and-tone.md`:

- Static output only; no server runtime. Deploys to Cloudflare Pages.
- Node 22+, npm with committed `package-lock.json`. Never hand-edit dependency versions; use npm commands.
- No Tailwind. Styling stays in `src/styles/tokens.css` + `src/styles/components/*.css`, imported from `src/styles/global.css`.
- Site copy is Chilean Spanish, neutral tuteo ("tú", "escríbenos"). **No voseo** ("intentá", "revisá"), no usted, no em dashes ("—") in site copy, never the verb "encajar" in any form.
- Every adoption mention includes post-adoption support ("Seguimos acompañándote después de la adopción." or a natural variation).
- CTAs are verb-first: "Quiero adoptar", "Puedo ser hogar temporal", "Voy a apoyar un galgo", "Escríbenos".
- One meaningful `h1` per page; unique title + meta description per indexable page (build-enforced by `astro-seo-graph`; `npm run build` fails on violations, including title/description length bounds).
- Lighthouse 100 target on checked pages. No unnecessary client JS; prefer server-rendered or CSS-only solutions.
- GTM is the only GA4 delivery path, loaded only after consent. Never add `gtag.js`.
- Dog galleries max 3 images (schema + UI). No remote image CDNs for dog photos.
- UTF-8 everywhere; repo-relative paths only.
- Reuse shared primitives: `PageLayout`, `TrackedLink`, `ExternalLink`, `WhatsAppLink`, `InstagramLink`.
- The `toolname` / `tooldescription` / `toolparamdescription` attributes on the contact form are **intentional** (declarative agent-tool affordances). Do not remove them.
- Verification before every commit: `npm run format:check && npm run lint && npm run build && npm test`. Run `npm run test:lighthouse` after tasks that touch headings, fonts, CTAs, images, or layout.

---

## Audit summary

### What is already excellent (do not churn)

- Architecture: content collections + typed shaping utils (`dog-content.ts`, `story-card-copy.ts`), shared layouts, shared link primitives, centralized JSON-LD builders.
- Delivery: strict CSP in `public/_headers`, consent-first analytics, AVIF/WebP responsive images, Lighthouse-100 discipline, `light`/`dark` theming.
- Guardrails: source-hygiene tests, a11y tests, consent tests, build-output tests, text-quality checks, SEO validation at build time.
- Identity: the pop-art palette (cyan/magenta/orange + rainbow accents), Barlow Condensed display type, and the rainbow divider are distinctive and consistent. The plan **refines** this identity; it does not rebrand.

### Findings → tasks

| #   | Finding                                                                                                                                                                        | Severity        | Task |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ---- |
| F1  | `src/scripts/form.ts` toasts use Argentine voseo ("Intentá", "Revisá") — violates the voice guide; the text-quality checker doesn't catch voice rules                          | Bug             | 1    |
| F2  | `smoke-report.json` is git-tracked despite being gitignored                                                                                                                    | Hygiene         | 2    |
| F3  | Navbar/footer logo `<img>` has both a verbose `alt` and `aria-hidden="true"` (contradictory semantics)                                                                         | A11y nit        | 2    |
| F4  | Web3Forms endpoint + access key hardcoded in two places (`ContactForm.astro`, `form.ts`)                                                                                       | Quality         | 3    |
| F5  | `/feed.xml` publishes a placeholder post whose link (`/blog/placeholder/`) 404s; blog collection has pages promised but none built                                             | Bug             | 4, 5 |
| F6  | No per-dog URLs. Dogs exist only as cards on `/adoptar/`. Sharing a specific dog on WhatsApp/Instagram (the org's primary funnel) is impossible; no per-dog SEO or OG image    | **Biggest win** | 6–9  |
| F7  | `--font-body` lists "Aptos" first, which is never shipped as a webfont; body text silently falls back to system-ui. The tokens comment even claims the body face is Inter      | Design          | 10   |
| F8  | Hero: three equal-width CTAs compete; no reassurance microcopy; on mobile the photo renders below all CTAs, burying the emotional hook                                         | UX              | 11   |
| F9  | No entrance motion anywhere; the page feels static compared to its playful brand                                                                                               | Polish          | 12   |
| F10 | `tokens.css` duplicates the entire dark palette twice (`[data-theme="dark"]` + media query), a documented drift hazard                                                         | Quality         | 13   |
| F11 | `global.css` couples type roles to component class lists (`.page-hero__lead, .hero__lead, .section-body, …`) — every new component must be registered in global selector lists | Quality         | 14   |
| F12 | FAQ page (P1 content, key pre-conversion reading) is reachable only from the footer                                                                                            | UX              | 15   |
| F13 | Docs (`prd.md`, `feature-inventory.md`, `AGENTS.md`) will drift once tasks 4–9 land                                                                                            | Docs            | 16   |

### Explicitly deferred (needs human/org input; do not implement)

- **Adopter quotes / testimonials section.** High-trust win, but the voice guide forbids invented quotes. Needs 2–4 confirmed quotes with first name + city from the org.
- **Press section content.** `PressSection` exists on `/contacto/`; a real press kit needs org assets.
- **Real blog posts.** Task 5 builds the pages; publishing needs real editorial content.
- **Professional hero photography.** The current hero photos are good; a commissioned shot would lift it further. Not a code task.
- **Payment links (Mercado Pago button, etc.).** Site brief marks payment processing out of scope.

---

## Phase A — Correctness and hygiene

### Task 1: Fix voseo toasts and add a voice guard to the text-quality checker

**Files:**

- Modify: `scripts/check-text-quality.mjs`
- Modify: `src/scripts/form.ts:134` and `src/scripts/form.ts:143`

**Interfaces:**

- Consumes: existing `npm run test:text` script (runs `node scripts/check-text-quality.mjs`).
- Produces: a failing exit code (1) whenever voseo forms or "encajar" appear anywhere under `src/`.

- [ ] **Step 1: Add the voice check (this is the failing test)**

In `scripts/check-text-quality.mjs`, after the `mojibakePatterns` declaration, add:

```js
// Voice rules from docs/voice-and-tone.md: Chilean neutral tuteo, no voseo, never "encajar".
// Only applied under src/ so docs and tooling can quote counterexamples.
const voicePatterns = [
  {
    pattern: /[Ii]ntentá|[Rr]evisá|[Pp]odés|[Qq]uerés|[Tt]enés|[Cc]ontanos|[Ee]scribinos|[Aa]poyanos/,
    label: "voseo (la voz del sitio usa tuteo chileno)",
  },
  {
    pattern: /\bencaj(?:a|an|e|en|ar|aría)\b/i,
    label: 'verbo "encajar" prohibido por la guía de voz',
  },
];
```

Then extend the file-scan loop. Replace the existing block:

```js
const text = await readFile(path, "utf8");
for (const pattern of mojibakePatterns) {
  if (pattern.test(text)) {
    failures.push(path);
    break;
  }
}
```

with:

```js
const text = await readFile(path, "utf8");
for (const pattern of mojibakePatterns) {
  if (pattern.test(text)) {
    failures.push(path);
    break;
  }
}
if (path.startsWith("src")) {
  for (const { pattern, label } of voicePatterns) {
    if (pattern.test(text)) {
      failures.push(`${path} (${label})`);
      break;
    }
  }
}
```

- [ ] **Step 2: Run it and verify it fails on the current tree**

Run: `npm run test:text`
Expected: exit code 1, output lists `src/scripts/form.ts (voseo (la voz del sitio usa tuteo chileno))`.

- [ ] **Step 3: Fix the two toasts in `src/scripts/form.ts`**

Line 134, replace:

```ts
showToast(data.message ?? "No pudimos enviar el formulario. Intentá de nuevo.");
```

with:

```ts
showToast(data.message ?? "No pudimos enviar el formulario. Inténtalo de nuevo.");
```

Line 143, replace:

```ts
showToast("Error de red. Revisá tu conexión e intentá de nuevo.");
```

with:

```ts
showToast("Error de red. Revisa tu conexión e inténtalo de nuevo.");
```

- [ ] **Step 4: Verify green**

Run: `npm run test:text`
Expected: exit code 0, no output.

Run: `npm run lint`
Expected: PASS (lint includes the text check).

- [ ] **Step 5: Commit**

```bash
git add scripts/check-text-quality.mjs src/scripts/form.ts
git commit -m "fix: use Chilean tuteo in form toasts and guard voice rules in text check"
```

### Task 2: Untrack `smoke-report.json` and fix decorative logo alt text

**Files:**

- Delete from index (keep gitignored): `smoke-report.json`
- Modify: `src/components/Navbar.astro:27`
- Modify: `src/components/Footer.astro:15`

- [ ] **Step 1: Untrack the report artifact**

```bash
git rm --cached smoke-report.json
```

Expected: `rm 'smoke-report.json'`. The file stays on disk and `.gitignore` already lists it.

- [ ] **Step 2: Make the navbar logo decorative**

The brand link already carries `aria-label="Brigada Galgos - inicio"`. An image with `aria-hidden="true"` must not also carry a descriptive `alt`. In `src/components/Navbar.astro`, replace:

```astro
alt="Logo de Brigada Galgos de la barra de navegación"
```

with:

```astro
alt=""
```

- [ ] **Step 3: Make the footer logo decorative**

The footer brand link contains the visible text "Fundación Brigada Galgos". In `src/components/Footer.astro`, replace:

```astro
alt="Logo de Brigada Galgos del footer"
```

with:

```astro
alt=""
```

- [ ] **Step 4: Verify**

Run: `npm run test:a11y`
Expected: PASS (axe has no violations).

- [ ] **Step 5: Commit**

```bash
git add -A smoke-report.json src/components/Navbar.astro src/components/Footer.astro
git commit -m "chore: untrack smoke report and mark brand logos decorative"
```

### Task 3: Centralize the Web3Forms config in `src/config/site.ts`

The access key is public by design (client-side form service), but it is currently duplicated across the component and hardcoded next to the endpoint in the script.

**Files:**

- Modify: `src/config/site.ts`
- Modify: `src/components/sections/ContactForm.astro:22-23`
- Modify: `src/scripts/form.ts:116`

**Interfaces:**

- Produces: `SITE.web3forms.endpoint: string` and `SITE.web3forms.accessKey: string`.

- [ ] **Step 1: Add the config block**

In `src/config/site.ts`, add inside the `SITE` object (after `facebook`):

```ts
  // Public client-side key for https://web3forms.com; safe to commit.
  web3forms: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "ef1e3d39-d9cf-4778-84c4-91e619f1cfeb",
  },
```

- [ ] **Step 2: Use it in the component**

In `src/components/sections/ContactForm.astro`, add to the frontmatter:

```astro
---
import { SITE } from "../../config/site.ts";
---
```

and replace the two hidden inputs:

```astro
<input type="hidden" name="access_key" value="ef1e3d39-d9cf-4778-84c4-91e619f1cfeb" />
<input type="hidden" name="form_id" value="ef1e3d39-d9cf-4778-84c4-91e619f1cfeb" />
```

with:

```astro
<input type="hidden" name="access_key" value={SITE.web3forms.accessKey} />
<input type="hidden" name="form_id" value={SITE.web3forms.accessKey} />
```

- [ ] **Step 3: Use it in the script**

In `src/scripts/form.ts`, add at the top:

```ts
import { SITE } from "../config/site";
```

and replace:

```ts
      const res = await fetch("https://api.web3forms.com/submit", {
```

with:

```ts
      const res = await fetch(SITE.web3forms.endpoint, {
```

- [ ] **Step 4: Verify**

Run: `npm run build && npm run test:consent`
Expected: build PASS; consent spec PASS. Note the CSP in `public/_headers` already allows `connect-src https://api.web3forms.com`; the endpoint value must not change.

- [ ] **Step 5: Commit**

```bash
git add src/config/site.ts src/components/sections/ContactForm.astro src/scripts/form.ts
git commit -m "refactor: centralize Web3Forms endpoint and access key in site config"
```

---

## Phase B — Blog: make the promise real

### Task 4: Add a `draft` flag to the blog schema and stop publishing the placeholder

**Files:**

- Modify: `src/content.config.ts` (blog schema)
- Modify: `src/content/blog/placeholder.md`
- Modify: `src/pages/feed.xml.ts`

**Interfaces:**

- Produces: `blog` collection entries with `data.draft: boolean` (default `false`). All blog consumers must filter `!data.draft`.

- [ ] **Step 1: Extend the schema**

In `src/content.config.ts`, inside the `blog` schema object add:

```ts
    draft: z.boolean().default(false),
```

- [ ] **Step 2: Mark the placeholder as draft**

In `src/content/blog/placeholder.md`, add to the frontmatter:

```yaml
draft: true
```

- [ ] **Step 3: Filter drafts from the feed**

In `src/pages/feed.xml.ts`, replace:

```ts
const posts = await getCollection("blog");
```

with:

```ts
const posts = await getCollection("blog", ({ data }: CollectionEntry<"blog">) => !data.draft);
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: PASS. Then confirm the placeholder is gone:

Run: `grep -c "<item>" dist/feed.xml || true`
Expected: `0` (no items until a real post exists).

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/blog/placeholder.md src/pages/feed.xml.ts
git commit -m "fix: add blog draft flag and exclude drafts from the RSS feed"
```

### Task 5: Build minimal blog pages (`/blog/` and `/blog/<id>/`)

**Files:**

- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[id].astro`
- Create: `src/styles/components/blog.css`
- Modify: `src/styles/global.css` (import)
- Modify: `src/utils/structured-data.ts:20-29` (breadcrumb label)
- Modify: `src/components/Footer.astro:84-94` (nav link)

**Interfaces:**

- Consumes: `blog` collection with `draft` filter from Task 4; `PageLayout`, `PageHero`, `RainbowDivider`.
- Produces: routes `/blog/` and `/blog/<id>/` (so `/feed.xml` item links resolve).

- [ ] **Step 1: Add the breadcrumb label**

In `src/utils/structured-data.ts`, add to `breadcrumbLabels`:

```ts
  blog: "Blog",
```

- [ ] **Step 2: Create the listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import PageLayout from "../../layouts/PageLayout.astro";
import PageHero from "../../components/PageHero.astro";
import RainbowDivider from "../../components/RainbowDivider.astro";
import InstagramLink from "../../components/InstagramLink.astro";
import { SITE } from "../../config/site.ts";

const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const dateFormatter = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" });
---

<PageLayout
  title="Blog de rescate y adopción de galgos"
  description="Historias de rescate, aprendizajes de convivencia y novedades de los galgos que acompañamos en Chile, contadas por el equipo de Brigada Galgos."
>
  <PageHero
    eyebrow="BLOG"
    h1="Historias y novedades"
    lead="Lo que aprendemos rescatando y acompañando galgos en Chile, contado con calma y sin adornos."
  />
  <RainbowDivider />

  <section class="section-padding">
    <div class="container container--narrow">
      {
        posts.length === 0 ? (
          <div class="blog-empty">
            <p>Todavía no publicamos artículos. Mientras tanto, las novedades de los galgos viven en nuestras redes.</p>
            <InstagramLink url={SITE.instagram} name="Brigada Galgos" location="blog_empty" class="btn btn--secondary">
              Ver novedades en Instagram
            </InstagramLink>
          </div>
        ) : (
          <ul class="blog-list">
            {posts.map((post) => (
              <li class="blog-list__item">
                <article>
                  <h2 class="blog-list__title">
                    <a href={`/blog/${post.id}/`}>{post.data.title}</a>
                  </h2>
                  <p class="blog-list__meta">
                    <time datetime={post.data.pubDate.toISOString()}>{dateFormatter.format(post.data.pubDate)}</time>
                  </p>
                  <p class="blog-list__desc">{post.data.description}</p>
                </article>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 3: Create the post page**

Create `src/pages/blog/[id].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import PageLayout from "../../layouts/PageLayout.astro";
import RainbowDivider from "../../components/RainbowDivider.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const dateFormatter = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" });
---

<PageLayout title={post.data.title} description={post.data.description}>
  <article class="blog-post section-padding">
    <div class="container container--narrow">
      <p class="eyebrow">BLOG</p>
      <h1>{post.data.title}</h1>
      <p class="blog-post__meta">
        Por {post.data.author} ·
        <time datetime={post.data.pubDate.toISOString()}>{dateFormatter.format(post.data.pubDate)}</time>
      </p>
    </div>
  </article>
  <RainbowDivider />
  <section class="section-padding blog-post__section">
    <div class="container container--narrow">
      <div class="blog-post__body">
        <Content />
      </div>
      <p class="blog-post__back">
        <a href="/blog/">Volver al blog</a>
      </p>
    </div>
  </section>
</PageLayout>
```

Editorial rule (add to `docs/content-model.md` in Task 16): post bodies must start headings at `##`; the page renders the only `h1` from `title`.

- [ ] **Step 4: Create the styles**

Create `src/styles/components/blog.css`:

```css
/* ── Blog listing ─────────────────────────────────────────────────── */
.blog-empty {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.blog-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-7);
}

.blog-list__title {
  font-size: var(--font-size-xl);
}

.blog-list__title a {
  color: var(--color-text);
  text-decoration: none;
}

.blog-list__title a:hover {
  color: var(--color-primary-700);
}

.blog-list__title a:focus-visible {
  outline: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-focus);
}

.blog-list__meta,
.blog-post__meta {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.blog-list__desc {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  line-height: var(--line-base);
}

/* ── Blog post ────────────────────────────────────────────────────── */
.blog-post {
  padding-bottom: var(--space-6);
}

.blog-post h1 {
  font-size: var(--type-section-title);
  text-wrap: balance;
}

.blog-post__section {
  padding-top: var(--space-7);
}

.blog-post__body {
  display: grid;
  gap: var(--space-4);
  line-height: var(--line-loose);
}

.blog-post__body h2 {
  margin-top: var(--space-5);
  font-size: var(--font-size-xl);
}

.blog-post__body h3 {
  margin-top: var(--space-4);
  font-size: var(--font-size-lg);
}

.blog-post__body img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.blog-post__back {
  margin-top: var(--space-7);
}
```

In `src/styles/global.css`, add after the `donation-cards.css` import:

```css
@import url("./components/blog.css");
```

- [ ] **Step 5: Add the footer link**

In `src/components/Footer.astro`, in the "Navegar" list, insert after the Colaboradores item:

```astro
<li><a href="/blog/" class="footer__link">Blog</a></li>
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: PASS, and `dist/blog/index.html` exists. With only the draft placeholder present, no `dist/blog/placeholder/` directory is generated.

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/blog src/styles/components/blog.css src/styles/global.css src/utils/structured-data.ts src/components/Footer.astro
git commit -m "feat: add blog listing and post pages with empty state"
```

---

## Phase C — Per-dog profile pages (the headline feature)

The org's funnel is "see a dog → message on WhatsApp". Today a supporter cannot share a link to one dog. These tasks add `/adoptar/<slug>/` pages with per-dog titles, descriptions, OG images, and breadcrumbs, and wire the listing cards to them.

### Task 6: Profile data helpers with unit-tested meta description clamping

**Files:**

- Modify: `src/utils/dog-content.ts`
- Test: `tests/dog-content.test.ts` (extend the existing Vitest file)

**Interfaces:**

- Produces: `clampAtWordBoundary(text: string, max: number): string` and `buildDogMetaDescription(data: { name: string; details: string }): string` exported from `src/utils/dog-content.ts`. `buildDogMetaDescription` returns 70–155 chars for realistic inputs (the SEO validator enforces bounds at build time).

- [ ] **Step 1: Write the failing tests**

Append to `tests/dog-content.test.ts`:

```ts
import { clampAtWordBoundary, buildDogMetaDescription } from "../src/utils/dog-content";

describe("clampAtWordBoundary", () => {
  it("returns short text untouched", () => {
    expect(clampAtWordBoundary("Hola", 20)).toBe("Hola");
  });

  it("clamps at a word boundary and appends an ellipsis", () => {
    const result = clampAtWordBoundary("Un galgo tranquilo que busca una familia paciente", 30);
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const result = clampAtWordBoundary("Llegó desde Maipú, y hoy descansa tranquilo en su cama", 20);
    expect(result).not.toMatch(/[,;:.]…$/);
  });
});

describe("buildDogMetaDescription", () => {
  it("mentions the dog name and stays within SEO bounds", () => {
    const description = buildDogMetaDescription({
      name: "Turrón",
      details:
        "A Turrón lo arrojaron desde una camioneta en Isla de Maipo y hubo que operar su fractura. Hoy está recuperado, pero necesita un ambiente tranquilo, sin niños pequeños, sin gatos y sin perros machos.",
    });
    expect(description).toContain("Turrón");
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(155);
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run tests/dog-content.test.ts`
Expected: FAIL with "clampAtWordBoundary is not a function" (or missing export).

- [ ] **Step 3: Implement the helpers**

Append to `src/utils/dog-content.ts`:

```ts
const META_DESCRIPTION_MAX = 155;

export function clampAtWordBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,;:.]+$/, "")}…`;
}

export function buildDogMetaDescription(data: { name: string; details: string }): string {
  const base = `${data.name} está en adopción con Brigada Galgos. ${data.details}`;
  return clampAtWordBoundary(base, META_DESCRIPTION_MAX);
}
```

- [ ] **Step 4: Run and verify pass**

Run: `npx vitest run tests/dog-content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/dog-content.ts tests/dog-content.test.ts
git commit -m "feat: add meta description helpers for dog profile pages"
```

### Task 7: The `/adoptar/[slug]/` page with per-dog OG image and breadcrumb name

**Files:**

- Modify: `src/utils/structured-data.ts` (breadcrumb name overrides)
- Modify: `src/layouts/BaseLayout.astro` and `src/layouts/PageLayout.astro` (pass-through prop)
- Create: `src/pages/adoptar/[slug].astro`
- Create: `src/styles/components/dog-profile.css`
- Modify: `src/styles/global.css` (import)

**Interfaces:**

- Consumes: `buildAdoptionDogCards`, `buildDogMetaDescription` (Task 6), `SharedPhotoGallery`, `SharedGalleryLightbox`, `WhatsAppLink`, `TrackedLink`, `AdoptionProcess`, `PageLayout`.
- Produces: routes `/adoptar/<slug>/` for every dog with `active !== false`; `BaseLayout`/`PageLayout` accept optional `breadcrumbNames?: Record<string, string>`.

**Route note:** Astro merges `src/pages/adoptar.astro` (route `/adoptar/`) with `src/pages/adoptar/[slug].astro` (route `/adoptar/<slug>/`) without conflict. Do not move `adoptar.astro`.

- [ ] **Step 1: Support breadcrumb name overrides**

In `src/utils/structured-data.ts`:

Add to `StructuredDataInput`:

```ts
  breadcrumbNames?: Record<string, string>;
```

Change the breadcrumb call inside `buildStructuredDataGraph` from:

```ts
graph.push(buildBreadcrumbList(siteUrl, pathSegments));
```

to:

```ts
graph.push(buildBreadcrumbList(siteUrl, pathSegments, input.breadcrumbNames));
```

And change `buildBreadcrumbList` to:

```ts
export function buildBreadcrumbList(
  siteUrl: string,
  pathSegments: string[],
  nameOverrides?: Record<string, string>
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
      ...pathSegments.map((seg, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: nameOverrides?.[seg] ?? breadcrumbLabels[seg] ?? seg,
        item: `${siteUrl}/${pathSegments.slice(0, i + 1).join("/")}/`,
      })),
    ],
  };
}
```

- [ ] **Step 2: Thread the prop through the layouts**

In `src/layouts/BaseLayout.astro`, add to `Props`:

```ts
  breadcrumbNames?: Record<string, string>;
```

destructure it:

```ts
const { title, description, ogImage = SITE.ogImagePath, schema, breadcrumbNames } = Astro.props;
```

and pass it into the default graph:

```ts
const defaultSchema = buildStructuredDataGraph({
  canonicalUrl,
  title,
  description,
  imageUrl: ogImageUrl,
  logoUrl,
  pathname: Astro.url.pathname,
  breadcrumbNames,
});
```

In `src/layouts/PageLayout.astro`, add `breadcrumbNames?: Record<string, string>;` to `Props`, destructure it, and forward it:

```astro
<BaseLayout
  title={title}
  description={description}
  ogImage={ogImage}
  schema={schema}
  breadcrumbNames={breadcrumbNames}
/>
```

- [ ] **Step 3: Create the profile page**

Create `src/pages/adoptar/[slug].astro`:

```astro
---
import { getCollection } from "astro:content";
import { getImage } from "astro:assets";
import PageLayout from "../../layouts/PageLayout.astro";
import RainbowDivider from "../../components/RainbowDivider.astro";
import SharedPhotoGallery from "../../components/SharedPhotoGallery.astro";
import SharedGalleryLightbox from "../../components/SharedGalleryLightbox.astro";
import AdoptionProcess from "../../components/sections/AdoptionProcess.astro";
import WhatsAppLink from "../../components/WhatsAppLink.astro";
import TrackedLink from "../../components/TrackedLink.astro";
import InstagramLink from "../../components/InstagramLink.astro";
import { SITE } from "../../config/site.ts";
import { buildAdoptionDogCards, buildDogMetaDescription } from "../../utils/dog-content";
import { getInstagramHandleLabel } from "../../utils/instagram";

export async function getStaticPaths() {
  const dogs = await getCollection("adoption-dogs", ({ data }) => data.active !== false);
  return dogs.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const [dog] = await buildAdoptionDogCards([entry]);
const metaDescription = buildDogMetaDescription(entry.data);

const firstImage = entry.data.gallery[0];
const ogImage = firstImage
  ? (await getImage({ src: firstImage, width: 1200, height: 630, format: "jpeg", fit: "cover" })).src
  : undefined;
---

<PageLayout
  title={`${dog.name}, galgo en adopción`}
  description={metaDescription}
  ogImage={ogImage}
  breadcrumbNames={{ [entry.id]: dog.name }}
>
  <section class="dog-profile section-padding">
    <div class="container">
      <p class="dog-profile__back">
        <a href="/adoptar/#galgos">Ver todos los galgos en adopción</a>
      </p>
      <div class="dog-profile__layout">
        <div class="dog-profile__gallery">
          <SharedPhotoGallery name={dog.name} photos={dog.pictures} id={dog.id} loadingPriority="eager" />
        </div>
        <div class="dog-profile__info">
          <p class="eyebrow">GALGO EN ADOPCIÓN</p>
          <h1>{dog.name}</h1>
          <div class="dog-card__chips dog-profile__chips">
            <span class="chip chip--sex">{dog.sex}</span>
            <span class="chip chip--age">{dog.age}</span>
            <span class="chip chip--weight">{dog.weight}</span>
            <span class="chip chip--need">{dog.currentNeed}</span>
          </div>
          <p class="dog-profile__details">{dog.details}</p>
          <p class="dog-profile__sketch">{dog.characterSketch}</p>
          {
            dog.instagramUrl && (
              <InstagramLink url={dog.instagramUrl} name={dog.name} location="dog_profile" class="dog-social-link">
                <img src="/icons/instagram.svg" alt="" aria-hidden="true" />
                <span>{getInstagramHandleLabel(dog.instagramUrl)}</span>
              </InstagramLink>
            )
          }
          <div class="dog-profile__ctas">
            <WhatsAppLink
              text={`Hola, me interesa ${dog.name} y quisiera saber más sobre su adopción`}
              location="dog_profile"
              label={`Me interesa ${dog.name}`}
              class="btn btn--primary"
              data-dog-name={dog.name}
            >
              Me interesa {dog.name}
            </WhatsAppLink>
            <TrackedLink
              href={SITE.adoptionForm}
              class="btn btn--secondary"
              newTab
              trackEvent="cta_click"
              trackLabel={`Postular por formulario - ${dog.name}`}
              trackLocation="dog_profile"
              trackDestination={SITE.adoptionForm}
              trackCategory="adoption"
            >
              Postular por formulario
            </TrackedLink>
          </div>
          <p class="dog-profile__support">
            Te preguntamos por tu rutina y tu casa para que {dog.name} esté seguro, no para juzgarte. Y seguimos acompañándote
            después de la adopción.
          </p>
        </div>
      </div>
    </div>
  </section>

  <RainbowDivider />
  <AdoptionProcess />

  <SharedGalleryLightbox slot="afterShell" ariaLabel={`Galería de ${dog.name}`} />
</PageLayout>

<script>
  import "../../scripts/init-shared-gallery";
</script>
```

- [ ] **Step 4: Create the styles**

Create `src/styles/components/dog-profile.css`:

```css
.dog-profile__back {
  margin-bottom: var(--space-5);
  font-size: var(--font-size-sm);
}

.dog-profile__layout {
  display: grid;
  gap: var(--space-7);
  align-items: start;
}

.dog-profile__info {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
}

.dog-profile__info h1 {
  font-size: var(--type-section-title);
}

.dog-profile__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.dog-profile__details,
.dog-profile__sketch {
  font-size: var(--type-lead);
  line-height: var(--line-loose);
  color: var(--color-text-muted);
}

.dog-profile__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.dog-profile__support {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  max-width: 34rem;
}

@media (min-width: 1024px) {
  .dog-profile__layout {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
}
```

In `src/styles/global.css`, add after the `blog.css` import:

```css
@import url("./components/dog-profile.css");
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: PASS. `dist/adoptar/turron/index.html` (and one directory per active dog) exists. The SEO validator confirms unique titles/descriptions; if it reports a description length violation for a specific dog, adjust that dog's `details` opening sentence, not the helper.

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/adoptar src/styles/components/dog-profile.css src/styles/global.css src/utils/structured-data.ts src/layouts/BaseLayout.astro src/layouts/PageLayout.astro
git commit -m "feat: add per-dog adoption profile pages with per-dog SEO and OG images"
```

### Task 8: Link the listing cards to the profiles and add a browser test

**Files:**

- Modify: `src/components/sections/AdoptionGrid.astro:42` (name becomes a link) and `:58-66` (secondary link)
- Modify: `src/styles/components/dog-card.css` (link styles, append)
- Create: `tests/dog-profile.spec.ts`

**Interfaces:**

- Consumes: routes from Task 7.
- Produces: `.dog-card__name-link` anchor inside every adoption card.

- [ ] **Step 1: Write the failing browser test**

Create `tests/dog-profile.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("dog profile opens from the adoption grid", async ({ page }) => {
  await page.goto("/adoptar/");
  const firstLink = page.locator("[data-adoption-card] .dog-card__name-link").first();
  const name = (await firstLink.textContent())?.trim();
  await firstLink.click();
  await expect(page).toHaveURL(/\/adoptar\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toHaveText(name ?? "");
  await expect(page.getByRole("link", { name: new RegExp(`Me interesa ${name}`) })).toBeVisible();
});
```

Run: `npx playwright test tests/dog-profile.spec.ts`
Expected: FAIL (no `.dog-card__name-link` yet).

- [ ] **Step 2: Turn the card name into a link and add a profile CTA**

In `src/components/sections/AdoptionGrid.astro`, replace:

```astro
<h3 class="story-card__name dog-card__name">{dog.name}</h3>
```

with:

```astro
<h3 class="story-card__name dog-card__name">
  <a
    href={`/adoptar/${dog.id}/`}
    class="dog-card__name-link"
    data-track-event="dog_profile_click"
    data-track-label={dog.name}
    data-track-location="dog_card"
    data-track-destination={`/adoptar/${dog.id}/`}
  >
    {dog.name}
  </a>
</h3>
```

Then, directly above the existing `WhatsAppLink` CTA, add:

```astro
<a href={`/adoptar/${dog.id}/`} class="btn btn--ghost dog-card__profile-link">
  Conocer a {dog.name}
</a>
```

- [ ] **Step 3: Style the links**

Append to `src/styles/components/dog-card.css`:

```css
.dog-card__name-link {
  color: inherit;
  text-decoration: none;
}

.dog-card__name-link:hover {
  color: var(--color-primary-700);
}

.dog-card__name-link:focus-visible {
  outline: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-focus);
}

.dog-card__profile-link {
  align-self: start;
}
```

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/dog-profile.spec.ts tests/filter-chips.spec.ts`
Expected: both PASS (filters must keep working; they key off `data-adoption-card`, `data-sex`, `data-age-type`, which are untouched).

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/AdoptionGrid.astro src/styles/components/dog-card.css tests/dog-profile.spec.ts
git commit -m "feat: link adoption cards to per-dog profile pages"
```

### Task 9: Native share button on dog profiles

Sharing is the point of these pages. `navigator.share` opens the OS share sheet (WhatsApp first on most Chilean phones); the fallback copies the URL.

**Files:**

- Create: `src/scripts/share-dog.ts`
- Modify: `src/pages/adoptar/[slug].astro` (button + script import)
- Modify: `src/styles/components/dog-profile.css` (append)

- [ ] **Step 1: Create the script**

Create `src/scripts/share-dog.ts`:

```ts
import { dispatchAnalytics } from "../utils/analytics";

function initShareButtons(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-share-dog]").forEach((button) => {
    button.addEventListener("click", async () => {
      const name = button.dataset.shareDog ?? "";
      const url = window.location.href;
      dispatchAnalytics({ event: "dog_share_click", dog_name: name, page_url: url });

      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: `Conoce a ${name}, un galgo en adopción con Brigada Galgos`,
            url,
          });
        } catch {
          // The person closed the share sheet; nothing to do.
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        const live = document.querySelector<HTMLElement>("[data-share-live]");
        if (live) live.textContent = "Enlace copiado. Compártelo donde quieras.";
      } catch {
        // Clipboard unavailable; the URL bar remains the fallback.
      }
    });
  });
}

document.addEventListener("astro:page-load", initShareButtons);
```

If `dispatchAnalytics` requires a fixed payload type, extend its accepted event map the same way existing events like `story_click` are registered in `src/utils/analytics.ts` / `src/types/global.d.ts`.

- [ ] **Step 2: Add the button to the profile page**

In `src/pages/adoptar/[slug].astro`, inside `.dog-profile__ctas` after the `TrackedLink`, add:

```astro
<button type="button" class="btn btn--ghost dog-profile__share" data-share-dog={dog.name}>
  Compartir a {dog.name}
</button>
```

and after the `.dog-profile__ctas` div add:

```astro
<p class="dog-profile__share-live" data-share-live aria-live="polite"></p>
```

Then extend the script block at the bottom of the file:

```astro
<script>
  import "../../scripts/init-shared-gallery";
  import "../../scripts/share-dog";
</script>
```

- [ ] **Step 3: Style the live region**

Append to `src/styles/components/dog-profile.css`:

```css
.dog-profile__share-live {
  min-height: 1.5em;
  font-size: var(--font-size-sm);
  color: var(--color-primary-700);
}
```

- [ ] **Step 4: Verify**

Run: `npm run build && npx playwright test tests/dog-profile.spec.ts`
Expected: PASS. Manually confirm in `npm run preview` that clicking "Compartir a …" in a desktop browser without Web Share copies the link and announces "Enlace copiado…".

- [ ] **Step 5: Commit**

```bash
git add src/scripts/share-dog.ts src/pages/adoptar src/styles/components/dog-profile.css
git commit -m "feat: add native share button to dog profile pages"
```

---

## Phase D — Visual polish

### Task 10: Ship a real body typeface (Barlow) to match the display face

Barlow (non-condensed) is the same superfamily as the Barlow Condensed display face: one type family across the whole site, warm and slightly rounded, and clearly deliberate. Today the body stack starts with "Aptos", which never loads.

**Files:**

- Modify: `package.json` via npm (new dependency `@fontsource/barlow`)
- Modify: `src/styles/global.css:1-2` (imports)
- Modify: `src/styles/tokens.css:69-77` (comment + `--font-body`)

- [ ] **Step 1: Install the font**

```bash
npm install @fontsource/barlow
```

- [ ] **Step 2: Import the weights**

In `src/styles/global.css`, add before the Barlow Condensed imports:

```css
@import url("@fontsource/barlow/400.css");
@import url("@fontsource/barlow/600.css");
```

(400 covers body text; 600 covers `--weight-semi` UI labels. Bold body text at 700 will synthesize rarely enough not to matter; add `@fontsource/barlow/700.css` only if `npm run test:lighthouse` or visual review shows heavy synthetic bolding.)

- [ ] **Step 3: Update the token and its comment**

In `src/styles/tokens.css`, replace:

```css
--font-body: "Aptos", "Segoe UI Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

with:

```css
--font-body: "Barlow", "Segoe UI Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

and update the typography comment block above it: `Body: Barlow — same superfamily as the display face; warm, legible, deliberate.` (replace the stale "Body: Inter" line).

- [ ] **Step 4: Verify**

Run: `npm run build && npm run test:lighthouse`
Expected: build PASS; Lighthouse stays 100 on checked pages (Barlow latin 400+600 adds roughly 50 KB of woff2, loaded with `font-display: swap`; body text is not the LCP element). If performance drops, drop the 600 import and let 400 + synthetic weights carry it.

Visually compare `/`, `/adoptar/`, `/donar/` at 1440 px and 390 px with `npm run capture:local` against `.cache/parity/` references; text metrics shift slightly, layout must not break.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css src/styles/tokens.css
git commit -m "feat: ship Barlow as the body typeface to pair with Barlow Condensed"
```

### Task 11: Hero hierarchy — one clear primary action, photo earlier on mobile

Today the three hero CTAs render with near-equal weight, and on a phone the photo appears below all of them. Make "Quiero adoptar" unmistakably primary, keep the other two paths present but quieter, surface the photo right after the lead on mobile, and add the reassurance line the voice guide calls for.

**Files:**

- Modify: `src/components/Hero.astro`
- Modify: `src/styles/components/hero.css`

- [ ] **Step 1: Restructure the hero markup**

In `src/components/Hero.astro`, move the CTA block out of `.hero__text` so the grid can reorder it on mobile, and add the support line. Replace the full `<section>` body with:

```astro
<section class="hero section-padding" data-track-section="hero">
  <div class="container hero__grid">
    <div class="hero__text">
      <h1>Rescatamos, rehabilitamos y reubicamos galgos en Chile</h1>
      <p class="hero__lead">
        Acompañamos a galgos rescatados hasta encontrar una familia que entienda su ritmo: suelen ser tranquilos en
        casa, regalones y profundamente agradecidos.
      </p>
    </div>

    <picture class="hero__photo">
      <source
        media="(min-width: 768px)"
        srcset={heroSources.landscapeAvifSrcSet}
        sizes="(min-width: 1200px) 528px, (min-width: 1024px) calc(50vw - 72px), calc(100vw - 48px)"
        type="image/avif"
      />
      <source
        media="(min-width: 768px)"
        srcset={heroSources.landscapeWebpSrcSet}
        sizes="(min-width: 1200px) 528px, (min-width: 1024px) calc(50vw - 72px), calc(100vw - 48px)"
        type="image/webp"
      />
      <source srcset={heroSources.portraitAvifSrcSet} sizes="calc((100vw - 48px) / 1.75)" type="image/avif" />
      <img
        srcset={heroSources.portraitWebpSrcSet}
        sizes="calc((100vw - 48px) / 1.75)"
        src={heroSources.portraitFallbackSrc}
        alt="Galgo rescatado mirando hacia adelante"
        class="hero__img"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width={portraitSrc.width}
        height={portraitSrc.height}
      />
    </picture>

    <div class="hero__actions">
      <div class="hero__ctas">
        <TrackedLink
          href="/adoptar/"
          class="btn btn--primary hero__cta-primary"
          trackEvent="cta_click"
          trackLabel="Quiero adoptar"
          trackLocation="hero"
          trackDestination="/adoptar/"
          trackCategory="adoption"
        >
          Quiero adoptar
        </TrackedLink>
        <TrackedLink
          href="/hogar-temporal/"
          class="btn btn--secondary"
          trackEvent="cta_click"
          trackLabel="Puedo ser hogar temporal"
          trackLocation="hero"
          trackDestination="/hogar-temporal/"
          trackCategory="foster"
        >
          Puedo ser hogar temporal
        </TrackedLink>
        <TrackedLink
          href="/donar/"
          class="btn btn--secondary"
          trackEvent="cta_click"
          trackLabel="Voy a apoyar un galgo"
          trackLocation="hero"
          trackDestination="/donar/"
          trackCategory="donation"
        >
          Voy a apoyar un galgo
        </TrackedLink>
      </div>
      <p class="hero__support">
        No necesitas tener todo resuelto antes de escribirnos. Seguimos contigo después de la adopción.
      </p>
    </div>
  </div>
</section>
```

The frontmatter (imports, `heroSources`) stays unchanged.

- [ ] **Step 2: Update the hero CSS**

In `src/styles/components/hero.css`:

Replace the `.hero__ctas` rules (lines 42–52) with:

```css
.hero__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hero__ctas {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.hero__ctas .btn--primary,
.hero__ctas .btn--secondary {
  width: 100%;
}

.hero__cta-primary {
  box-shadow: var(--shadow-md);
}

.hero__support {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  max-width: 34rem;
}
```

Replace the desktop `@media (min-width: 1024px)` block with:

```css
@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    grid-template-areas:
      "text photo"
      "actions photo";
    align-items: center;
  }

  .hero__text {
    grid-area: text;
    align-self: end;
  }

  .hero__photo {
    grid-area: photo;
  }

  .hero__actions {
    grid-area: actions;
    align-self: start;
  }

  .hero__ctas {
    flex-flow: row wrap;
    max-width: 38rem;
  }

  .hero__ctas .btn--primary,
  .hero__ctas .btn--secondary {
    width: auto;
  }
}
```

Mobile source order is now text → photo → actions, so the galgo appears right after the lead and before the buttons. Desktop keeps text+actions left, photo right.

- [ ] **Step 3: Verify**

Run: `npm run build && npm test && npm run test:lighthouse`
Expected: all PASS. The hero image keeps `fetchpriority="high"` + eager loading, so LCP is unaffected. Check `npm run capture:home` at 390 px and 1440 px: photo between lead and CTAs on mobile; no overlap on desktop.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/styles/components/hero.css
git commit -m "feat: rank hero CTAs, surface photo earlier on mobile, add reassurance line"
```

### Task 12: CSS-only scroll reveals (progressive, reduced-motion safe)

Cards fade-and-rise as they enter the viewport using CSS scroll-driven animations. Zero JS, no CLS (opacity + `translate` only), no effect for `prefers-reduced-motion` users or browsers without `animation-timeline` (they simply see the static page).

**Files:**

- Create: `src/styles/components/motion.css`
- Modify: `src/styles/global.css` (import)

- [ ] **Step 1: Create the motion stylesheet**

Create `src/styles/components/motion.css`:

```css
/* Scroll-driven entrance reveals. Uses the `translate` property, never
   `transform`, so the shared hover lift (which uses transform) still works
   while the fill-mode keeps the final keyframe applied. */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .story-card,
    .dog-card,
    .card,
    .donation-card,
    .donation-amount,
    .req-card,
    .stat-card,
    .channel-card,
    .supporter-card,
    .impact-card {
      animation: reveal-rise both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
}

@keyframes reveal-rise {
  from {
    opacity: 0;
    translate: 0 14px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}
```

- [ ] **Step 2: Import it**

In `src/styles/global.css`, add after the `dog-profile.css` import:

```css
@import url("./components/motion.css");
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build && npm test && npm run test:lighthouse`
Expected: all PASS. Lighthouse CLS stays 0 (elements keep their layout box; only paint properties animate). In `npm run preview`, scroll `/` and `/adoptar/`: cards rise in as they enter; with OS reduced-motion enabled, nothing animates.

- [ ] **Step 4: Commit**

```bash
git add src/styles/components/motion.css src/styles/global.css
git commit -m "feat: add CSS-only scroll reveals for cards, reduced-motion safe"
```

### Task 13: Consolidate light/dark tokens with `light-dark()`

`src/styles/tokens.css` repeats the whole dark palette in two blocks that must be hand-synced. `light-dark()` defines each color once. **Browser floor:** `light-dark()` is Baseline 2024 (Chrome 123+, Firefox 120+, Safari 17.5+). Older browsers would lose themed colors entirely. If that floor is unacceptable, skip this task; everything else in the plan stands alone.

**Files:**

- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Rewrite the theme mechanism**

At the top of `:root`, replace `color-scheme: light;` with:

```css
color-scheme: light dark;
```

and add immediately after the `:root { … }` block:

```css
:root[data-theme="light"] {
  color-scheme: light;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}
```

- [ ] **Step 2: Fold every themed token into `light-dark()`**

Inside `:root`, replace each themed declaration with a single `light-dark(light, dark)` value. The dark values come verbatim from the current `[data-theme="dark"]` block:

```css
/* Brand */
--color-primary: light-dark(#00bcd4, #24d7ea);
--color-primary-700: light-dark(#006d78, #7eeaf4);
--color-primary-100: light-dark(#cff4f8, #123940);

--color-secondary: light-dark(#e91e8c, #ff4ead);
--color-secondary-700: light-dark(#b8156d, #ff8fcb);
--color-secondary-100: light-dark(#fcdcec, #42152d);

/* Action / CTA */
--color-accent-warm: light-dark(#ffa726, #ffb547);
--color-accent-warm-700: light-dark(#a85400, #ffd08a);
--color-accent-warm-100: light-dark(#ffe7c2, #442b10);

/* Tertiary */
--color-rainbow-green: #43a047;
--color-rainbow-green-700: light-dark(#2e7d32, #a5d6a7);
--color-rainbow-purple: #8e24aa;

/* Neutrals */
--color-bg: light-dark(#fff, #101217);
--color-surface: light-dark(#f5f6f8, #171b22);
--color-surface-2: light-dark(#eceef2, #222833);
--color-border: light-dark(#dadde3, #343b48);
--color-text: light-dark(#1f2328, #f4f7fb);
--color-text-muted: light-dark(#424a54, #c7d0dc);
--color-text-inverse: light-dark(#fff, #101217);

/* Semantic always-dark surfaces */
--color-footer-bg: light-dark(#1f2328, #0d0f14);
--color-cta-band-bg: #b8156d;
--color-cookie-bg: #1d2126;

/* Foreground on brand colors */
--on-secondary: light-dark(var(--color-text-on-dark), #101217);

/* Shadows */
--shadow-sm:
  0 1px 2px light-dark(rgba(15, 23, 42, 0.06), rgba(0, 0, 0, 0.4)),
  0 1px 1px light-dark(rgba(15, 23, 42, 0.04), rgba(0, 0, 0, 0.28));
--shadow-md:
  0 4px 12px light-dark(rgba(15, 23, 42, 0.08), rgba(0, 0, 0, 0.5)),
  0 2px 4px light-dark(rgba(15, 23, 42, 0.04), rgba(0, 0, 0, 0.3));
--shadow-lg:
  0 16px 32px light-dark(rgba(15, 23, 42, 0.12), rgba(0, 0, 0, 0.6)),
  0 4px 8px light-dark(rgba(15, 23, 42, 0.06), rgba(0, 0, 0, 0.4));
--shadow-focus: 0 0 0 3px light-dark(rgba(0, 188, 212, 0.35), rgba(36, 215, 234, 0.45));
```

Unlisted tokens (`--color-text-on-dark`, `--color-text-on-brand`, `--on-primary`, `--on-accent-warm`, `--on-rainbow-*`, semantic colors, typography, spacing, layout, radius, motion, z-index) stay exactly as they are.

In the buttons block, fold the dark overrides the same way:

```css
--btn-secondary-bg: light-dark(var(--color-primary-100), rgba(36, 215, 234, 0.1));
--btn-secondary-bg-hover: light-dark(#b6e8ee, rgba(36, 215, 234, 0.18));
--btn-secondary-fg: light-dark(#0f3940, #7eeaf4);
--btn-secondary-border: light-dark(var(--color-primary-700), rgba(36, 215, 234, 0.5));
--btn-ghost-bg-hover: light-dark(var(--color-surface), var(--color-surface-2));
```

Note `--color-primary-100` and `--color-primary-700` are themselves `light-dark()` values now, so `--btn-secondary-bg`'s light branch must reference the raw light values instead to avoid double-flipping: use `light-dark(#cff4f8, rgba(36, 215, 234, 0.1))` and `light-dark(#006d78, rgba(36, 215, 234, 0.5))`.

- [ ] **Step 3: Delete both dark blocks**

Remove the entire `:root[data-theme="dark"] { … }` token block and the entire `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }` block (they are now redundant; the two tiny `color-scheme` rules from Step 1 replace them).

- [ ] **Step 4: Verify thoroughly (visual-regression risk)**

Run: `npm run lint && npm run build && npm test`
Expected: all PASS, including `tests/a11y.spec.ts` (contrast) and `tests/analytics-consent.spec.ts`.

Manual check in `npm run preview`: toggle the navbar theme button through dark → light → back on `/`, `/adoptar/`, `/donar/`; verify the cookie banner, footer, and magenta CTA band look identical to before in both themes. Run `npm run capture:local` and diff against `.cache/parity/` light-mode references.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css
git commit -m "refactor: define theme tokens once with light-dark()"
```

### Task 14: Decouple type roles from component selector lists in `global.css`

`global.css` assigns type roles by enumerating component classes (e.g. `.page-hero__lead, .hero__lead, .section-body, .adoption-intro__lead, …`). Every new component must be appended to a global list, and forgetting produces silently inconsistent type. Replace the lists with role classes that components opt into.

**Files:**

- Modify: `src/styles/global.css:124-236`
- Modify (add a role class to markup): `src/components/Hero.astro`, `src/components/PageHero.astro`, `src/components/StoriesSection.astro`, `src/components/HelpCards.astro`, `src/components/ProcessStepper.astro`, `src/components/DonationBanner.astro`, `src/components/MissionSection.astro`, `src/components/RequirementCard.astro`, `src/components/sections/AdoptionIntro.astro`, `src/components/sections/AdoptionProcess.astro`, `src/components/sections/SupportersIntro.astro`, `src/components/sections/SupportersCtaSection.astro`, `src/components/sections/WhyGalgosEditorial.astro`, `src/components/sections/WhyGalgosSection.astro`, `src/components/sections/TrustStatsSection.astro`, `src/components/sections/ImpactSection.astro`, `src/components/sections/ContactChannels.astro`, `src/components/sections/DonationCards.astro`, `src/components/sections/FaqSection.astro` (only the ones that appear in the current selector lists — grep before editing)

**Approach (mechanical, verify after each group):**

- [ ] **Step 1: Define role classes in `global.css`**

Add below the existing lists (do not remove the lists yet):

```css
/* ── Type roles ─────────────────────────────────────────────────────
   Components opt in by adding the role class in markup. These replace
   the legacy per-component selector lists above. */
.t-section-title {
  font-size: var(--type-section-title);
}

.t-lead {
  font-size: var(--type-lead);
  line-height: var(--line-loose);
  color: var(--color-text-muted);
}

.t-lead-strong {
  font-size: var(--type-lead-strong);
  line-height: var(--line-snug);
  color: var(--color-text);
}

.t-card-body {
  font-size: var(--type-body);
  line-height: var(--line-base);
  color: var(--color-text-muted);
}

.t-card-title {
  font-size: var(--type-card-title);
}

.t-ui-title {
  font-size: var(--type-ui-title);
}

.t-small-muted {
  font-size: var(--type-body-small);
  line-height: var(--line-base);
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Migrate one selector list at a time**

For each legacy list in `global.css` (lines 124–146, 154–162, 209–236 in the current file), grep the enumerated class (e.g. `rg -l "hero__lead" src`), add the matching role class next to it in the component markup (e.g. `class="hero__lead t-lead"`), and once **every** member of that list carries the role class, delete the legacy list. The `.eyebrow` aliases (`.stories__eyebrow`, `.help-cards__eyebrow`, `.stepper__eyebrow`, `.mission__eyebrow`) migrate the same way: components use `class="eyebrow"` directly and the alias list is deleted (keep the standalone `.eyebrow` rule and its margin variant).

- [ ] **Step 3: Verify with screenshots after each list migration**

Run: `npm run build && npm run capture:local`
Expected: rendered pages visually identical to `.cache/parity/` references at 390/810/1200/1440. Run `npm test` at the end.

- [ ] **Step 4: Commit (one commit per migrated list is fine)**

```bash
git add src/styles/global.css src/components
git commit -m "refactor: replace global type-role selector lists with opt-in role classes"
```

---

## Phase E — Cross-links and closing sweep

### Task 15: Surface the FAQ inside the adoption and foster journeys

The FAQ answers the exact objections that stall adoption decisions, but it is only reachable from the footer.

**Files:**

- Modify: `src/components/sections/AdoptionTailCta.astro`
- Modify: `src/components/sections/FosterPostular.astro`

- [ ] **Step 1: Add the FAQ line to the adoption tail CTA**

In `src/components/sections/AdoptionTailCta.astro`, after the `WhatsAppLink` closing tag and before `</div>`, add:

```astro
<p class="cta-card__aside">
  ¿Dudas sobre costos, departamento, niños u otros animales?
  <a href="/preguntas-frecuentes/">Revisa las preguntas frecuentes</a>
</p>
```

Add the supporting style to `src/styles/global.css`, inside the TAIL CTA CARD section after `.cta-card__actions`:

```css
.cta-card__aside {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Add the FAQ line to the foster flow**

In `src/components/sections/FosterPostular.astro`, locate the closing CTA area (the section ends with the "Puedo ser hogar temporal" button and a WhatsApp line; read the file first) and add the same pattern immediately after the final CTA element:

```astro
<p class="cta-card__aside">
  Antes de postular también puedes
  <a href="/preguntas-frecuentes/">revisar las preguntas frecuentes</a>.
</p>
```

If the container there is not a `.cta-card`, the class still only sets size and color, so it is safe standalone.

- [ ] **Step 3: Verify**

Run: `npm run build && npm test`
Expected: PASS. The SEO graph's internal-link validation confirms `/preguntas-frecuentes/` resolves.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/AdoptionTailCta.astro src/components/sections/FosterPostular.astro src/styles/global.css
git commit -m "feat: cross-link FAQ from adoption and foster journeys"
```

### Task 16: Documentation sync and full verification sweep

**Files:**

- Modify: `docs/prd.md` (page inventory + P2 list), `docs/feature-inventory.md` ("Not yet implemented" list + routes), `docs/content-model.md` (blog `draft` field + "post bodies start at ##" rule), `AGENTS.md` (blog collection rules; dog-status workflow), `README.md` (blog + dog pages in "Qué se puede hacer")

- [ ] **Step 1: Update the docs to match shipped reality**

- `docs/prd.md`: move "Individual blog post pages" and "Individual dog … detail pages" out of the P2 list; add `/blog/`, `/blog/<id>/`, `/adoptar/<slug>/` to the page inventory; update the line "There are no individual dog or blog detail pages at the time of writing."
- `docs/feature-inventory.md`: same route additions; remove the two shipped items from "Not yet implemented".
- `docs/content-model.md`: document `draft` on blog posts and the "headings start at `##`" body rule; document that adoption dogs now render a profile page at `/adoptar/<slug>/`.
- `AGENTS.md`, section "Moving a Dog to Success": add a step —

```markdown
4. Add a permanent redirect for the retired profile URL in `public/_redirects`:
```

/adoptar/name/ /adoptar/ 301

```
Profile URLs are shared on social media and must not 404 after the dog is adopted.
```

Also note in the Blog section of `AGENTS.md` that `/blog/` pages now exist and drafts (`draft: true`) are excluded from pages and feed.

- `README.md`: add "Leer el blog" and per-dog profile mentions where the site's capabilities are listed.

- [ ] **Step 2: Full verification (mirrors `docs/checklist.md` phase 11)**

```bash
npm run format:check
npm run lint
npm run build
npm test
npm run test:lighthouse
```

Expected: all PASS, Lighthouse 100 on checked pages.

- [ ] **Step 3: Commit**

```bash
git add docs AGENTS.md README.md
git commit -m "docs: sync PRD, feature inventory, content model, and agent guidance with shipped features"
```

---

## Self-review notes

- Task order matters within phases C (6 → 7 → 8 → 9) and B (4 → 5); phases are independent of each other except Task 16, which runs last.
- Interfaces defined once and reused: `SITE.web3forms` (Task 3), `draft` filter (Tasks 4–5), `clampAtWordBoundary`/`buildDogMetaDescription` (Tasks 6–7), `breadcrumbNames` prop (Task 7), `.dog-card__name-link` (Task 8 test + markup), role classes `t-*` (Task 14).
- Anything ambiguous at execution time (exact insertion points in files not fully quoted here, e.g. `FosterPostular.astro`) is marked "read the file first"; all other steps contain the literal code.
- New Spanish copy in this plan was written against `docs/voice-and-tone.md`: tuteo, verb-first CTAs, no em dashes, no "encajar", post-adoption support mentioned alongside adoption CTAs.
