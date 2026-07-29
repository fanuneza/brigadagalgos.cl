# Brigada Galgos — Content Model

## Scope

This document describes the content collections, schemas, editorial rules, and workflows for the Brigada Galgos website. It is a companion to `src/content.config.ts`, which remains the canonical schema definition.

## Content collections

The site uses Astro content collections. Each collection is a directory of Markdown files with YAML frontmatter. Schemas are defined in `src/content.config.ts` and validated at build time.

## Dogs (`src/content/dogs/`)

All dogs live in a single `dogs` collection, discriminated by the `status` field: `"adopcion"` for dogs available for adoption and `"exito"` for adoption success stories. The schema is a Zod discriminated union on `status`, so each variant validates only its own fields.

### Fields

| Field             | Type    | Applies to | Description                                                                        |
| ----------------- | ------- | ---------- | ---------------------------------------------------------------------------------- |
| `name`            | string  | both       | Name of the galgo                                                                  |
| `status`          | enum    | both       | `"adopcion"` or `"exito"` (discriminator)                                          |
| `gallery`         | image[] | both       | Up to 3 local images (required for `adopcion`; defaults to empty for `exito`)      |
| `instagramUrl`    | URL     | both       | Optional Instagram post/profile for this dog                                       |
| `sex`             | enum    | `adopcion` | `Macho` or `Hembra`                                                                |
| `age`             | string  | `adopcion` | Descriptive age (e.g., "3 años")                                                   |
| `weight`          | string  | `adopcion` | Descriptive weight (e.g., "22 kg")                                                 |
| `details`         | string  | `adopcion` | Longer profile description                                                         |
| `currentNeed`     | enum    | `adopcion` | `Adopción`, `Hogar temporal`, or `Adopción u hogar temporal` (default: `Adopción`) |
| `characterSketch` | string  | `adopcion` | Short character summary for cards                                                  |
| `location`        | string  | `adopcion` | Optional; where the dog is located                                                 |
| `adoptionFacts`   | object  | `adopcion` | Optional decision data, with explicit compatibility and confirmed care facts       |
| `order`           | integer | `adopcion` | Optional manual sort order                                                         |
| `active`          | boolean | `adopcion` | Default `true`; set `false` to hide                                                |
| `hiddenSince`     | date    | `adopcion` | Date the dog was hidden                                                            |
| `hiddenReason`    | string  | `adopcion` | Why the dog is hidden                                                              |
| `story`           | string  | `exito`    | Adoption success story                                                             |

### Rules

- `gallery` accepts at most 3 images.
- Adoption variant:
  - If `active: false`, both `hiddenSince` and `hiddenReason` are required.
  - Hidden entries remain in the collection but are excluded from the public listing.
  - Hidden entries older than 90 days fail `tests/source-hygiene.test.ts`.
  - Every dog with `active !== false` renders a profile page at `/adoptar/<slug>/`, with its own meta description (via `buildDogMetaDescription`), OG image (first gallery image), and breadcrumb name override.
  - Active profiles must include `adoptionFacts.compatibility` for children, cats, female dogs, and male dogs. Each uses one of `sí`, `no`, `caso a caso`, or `sin información confirmada`. Never turn a general description such as “se lleva bien con todos” into a guarantee for a specific group.
  - Add `homeGuidance`, `exerciseNeeds`, `medicalOrSafetyNeeds`, and `personalityBehavior` only when the profile copy confirms them. Keep `location` as the current place or care setting.
- Success variant:
  - `story` must be 260 characters or fewer.
  - `story` must explicitly mention the adoption outcome (enforced with `/adopt/i`).
  - Keep stories general enough to avoid invented facts, but specific enough to avoid sounding templated.
  - Card summaries are derived from `story` via `src/utils/dog-content.ts`. The 260-character default should stay aligned with the content rule unless the product requirement changes.
  - Success entries power the home preview, the complete `/casos-de-exito/` archive and selected stories on `/por-que-galgos/`.

### Examples

Adoption dog:

```yaml
---
name: "Bruno"
status: "adopcion"
sex: "Macho"
age: "4 años"
weight: "24 kg"
details: "Bruno llegó con miedo a los ruidos fuertes. Hoy busca una familia tranquila."
currentNeed: "Adopción"
characterSketch: "Cariñoso una vez que confía, le encanta las caminatas tranquilas."
location: "Santiago"
adoptionFacts:
  compatibility:
    children: "caso a caso"
    cats: "sin información confirmada"
    femaleDogs: "sí"
    maleDogs: "caso a caso"
  homeGuidance: "Busca una familia tranquila."
  personalityBehavior: "Se acerca por mimos cuando ya confía."
gallery:
  - "../../assets/casos/bruno/bruno-1.jpg"
  - "../../assets/casos/bruno/bruno-2.jpg"
---
```

Success dog:

```yaml
---
name: "Mora"
status: "exito"
story: "Mora fue adoptada. Su hogar temporal no se pudo resistir. Ahora duerme en la cama y pasea todos los días."
gallery:
  - "../../assets/casos/mora/mora-1.jpg"
---
```

## Supporters (`src/content/supporters/`)

### Required fields

| Field         | Type   | Description                                                                     |
| ------------- | ------ | ------------------------------------------------------------------------------- |
| `name`        | string | Organization or person name                                                     |
| `description` | string | What they contribute                                                            |
| `website`     | URL    | Link to the supporter                                                           |
| `kind`        | enum   | `Institución`, `Empresa`, `Persona`, `Fundación`, `Colectivo`, or `Veterinaria` |
| `logo`        | image  | Local logo image                                                                |
| `logoAlt`     | string | Accessible alt text for the logo                                                |

### Optional fields

| Field         | Type    | Description                      |
| ------------- | ------- | -------------------------------- |
| `thanksLabel` | string  | Text for the thank-you link      |
| `thanksUrl`   | URL     | Link to a thank-you post or page |
| `order`       | integer | Manual sort order                |

### Rules

- Logos must be local images in `src/assets/`.
- Always include meaningful `logoAlt`.
- Prefer consistent `kind` values already defined in the schema.

### Example

```yaml
---
name: "Clínica Veterinaria Patitas"
description: "Nos apoya con atención veterinaria de urgencia."
website: "https://patitas.example"
kind: "Veterinaria"
logo: "../../assets/colaboradores/patitas.png"
logoAlt: "Logo de Clínica Veterinaria Patitas"
order: 1
---
```

## Blog (`src/content/blog/`)

### Required fields

| Field         | Type   | Description      |
| ------------- | ------ | ---------------- |
| `title`       | string | Post title       |
| `pubDate`     | date   | Publication date |
| `author`      | string | Author name      |
| `description` | string | Short summary    |

### Optional fields

| Field       | Type    | Description                                                          |
| ----------- | ------- | -------------------------------------------------------------------- |
| `category`  | string  | Post category                                                        |
| `heroImage` | string  | Path or URL to hero image                                            |
| `draft`     | boolean | Default `false`; set `true` to keep a post out of pages and the feed |

### Rules

- Blog posts feed the RSS feed at `/feed.xml` and the `/blog/` listing plus `/blog/<id>/` post pages.
- Posts with `draft: true` are excluded from `/blog/`, `/blog/<id>/`, and `/feed.xml`.
- Post bodies must start headings at `##`. The page renders the only `h1` from `title`, so a body-level `#` would create a duplicate top-level heading.
- Markdown-alternate routes are disabled (`markdownAlternate: false` in `astro.config.mjs`).

## Editorial workflows

### Adding a new dog for adoption

1. Create `src/content/dogs/<slug>.md` with `status: "adopcion"`.
2. Add 1–3 images to `src/assets/casos/<slug>/`.
3. Fill required frontmatter and optional fields as needed.
4. Set `currentNeed` to the appropriate value.
5. Add `adoptionFacts.compatibility` with an explicit status for children, cats, female dogs, and male dogs. Use `sin información confirmada` when the record has no specific observation.
6. Add care, routine, medical, exercise, or personality fields only when the intake or profile copy confirms them. Do not infer them from breed stereotypes or a broad phrase such as “se lleva bien con todos”.
7. Keep rescue context in `details` and daily-life behavior in `characterSketch`.
8. Run `npm run dog-images:check` to verify image consistency.
9. Run `npm run test:source` to catch content-rule violations.

### Moving a dog to success stories

The dog's markdown file and asset folder stay where they are — only the frontmatter changes.

1. Edit `src/content/dogs/<slug>.md`:
   - Change `status` to `"exito"`.
   - Add `story` (≤260 chars, mentions adoption).
   - Remove the profile-only fields: `sex`, `age`, `weight`, `details`, `location`, `currentNeed`, `characterSketch`, `order`, `active`, `hiddenSince`, `hiddenReason`.
   - Keep `name`, `instagramUrl`, and `gallery` unchanged (asset paths do not move).
2. Add a permanent redirect in `public/_redirects` for the retired profile URL:

   ```
   /adoptar/<slug>/ /casos-de-exito/ 301
   ```

Profile URLs are shared on social media and must not 404 after adoption. `tests/source-hygiene.test.ts` fails the build if a retired or hidden profile is missing its redirect.

### Hiding a dog temporarily

Applies only to entries with `status: "adopcion"`. Set the following frontmatter:

```yaml
active: false
hiddenSince: "2026-01-15"
hiddenReason: "Hogar temporal planea adoptar (no confirmado)"
```

A hidden dog remains in the collection but does not appear in listings, and its `/adoptar/<slug>/` profile page is not generated — shared profile links would 404 while the dog is hidden. Add the same `public/_redirects` entry described in "Moving a dog to success stories" for the duration of the hide, and remove it once the dog is active again. After 90 days, `tests/source-hygiene.test.ts` will fail unless the dog is moved or reactivated.

### Adding a supporter

1. Create `src/content/supporters/<slug>.md`.
2. Add a local logo to `src/assets/colaboradores/`.
3. Fill required frontmatter including `kind` and `logoAlt`.
4. Use `order` to control placement.

### Adding a blog post

1. Create `src/content/blog/<slug>.md`.
2. Fill required frontmatter: `title`, `pubDate`, `author`, `description`.
3. Optionally add `category` and `heroImage`.
4. Start body headings at `##` (the page renders the only `h1` from `title`).
5. Set `draft: true` to keep the post out of `/blog/`, `/blog/<id>/`, and `/feed.xml` until it is ready; the post will appear automatically once `draft` is `false` (the default).

## Image rules

- All dog and story images should be local in `src/assets/`.
- Use consistent file extensions within a dog’s folder (currently `.jpg` where applicable).
- Normalize filenames with `npm run dog-images:write`.
- Maximum 3 images per dog or success story.
- Use the provided scripts instead of ad hoc renames.

## Content hygiene

The following rules are enforced by `tests/source-hygiene.test.ts` and other checks:

- No dog gallery with more than 3 images.
- No success story over 260 characters or missing an adoption outcome.
- No hidden dog without `hiddenSince` and `hiddenReason`.
- No hidden dog older than 90 days.
- No absolute filesystem paths in source files or root-level Markdown (the scan covers `src/`, `public/`, `scripts/`, `tests/`, and root `*.md`; `docs/` is excluded).
- No standalone `gtag.js` references.
- Analytics must be consent-gated.
- Retired or hidden dog profiles must have a redirect in `public/_redirects`.
- Text-quality checks enforce voice and tone patterns (for example, no “encajar” in site copy).

## Voice and tone

All content must follow `docs/voice-and-tone.md`. Key reminders:

- Warm, direct Spanish with neutral tuteo.
- First-person plural when the foundation speaks.
- No invented facts, stats, or quotes.
- Mention post-adoption support on adoption copy.
- No em dashes in site copy.

## Last updated

2026-07-29
