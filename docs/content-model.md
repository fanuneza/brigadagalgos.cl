# Brigada Galgos — Content Model

## Scope

This document describes the content collections, schemas, editorial rules, and workflows for the Brigada Galgos website. It is a companion to `src/content.config.ts` and `docs/developer-reference.md`.

## Content collections

The site uses Astro content collections. Each collection is a directory of Markdown files with YAML frontmatter. Schemas are defined in `src/content.config.ts` and validated at build time.

## Adoption dogs (`src/content/adoption-dogs/`)

### Required fields

| Field             | Type    | Description                                                                        |
| ----------------- | ------- | ---------------------------------------------------------------------------------- |
| `name`            | string  | Name of the galgo                                                                  |
| `sex`             | enum    | `Macho` or `Hembra`                                                                |
| `age`             | string  | Descriptive age (e.g., "3 años")                                                   |
| `weight`          | string  | Descriptive weight (e.g., "22 kg")                                                 |
| `details`         | string  | Longer profile description                                                         |
| `currentNeed`     | enum    | `Adopción`, `Hogar temporal`, or `Adopción u hogar temporal` (default: `Adopción`) |
| `characterSketch` | string  | Short character summary for cards                                                  |
| `gallery`         | image[] | Up to 3 local images                                                               |

### Optional fields

| Field          | Type    | Description                         |
| -------------- | ------- | ----------------------------------- |
| `location`     | string  | Where the dog is located            |
| `instagramUrl` | URL     | Instagram post/profile for this dog |
| `order`        | integer | Manual sort order                   |
| `active`       | boolean | Default `true`; set `false` to hide |
| `hiddenSince`  | date    | Date the dog was hidden             |
| `hiddenReason` | string  | Why the dog is hidden               |

### Rules

- `gallery` accepts at most 3 images.
- If `active: false`, both `hiddenSince` and `hiddenReason` are required.
- Hidden entries remain in the collection but are excluded from the public listing.
- Hidden entries older than 90 days fail `tests/source-hygiene.test.ts`.

### Example

```yaml
---
name: "Bruno"
sex: "Macho"
age: "4 años"
weight: "24 kg"
details: "Bruno llegó con miedo a los ruidos fuertes. Hoy busca una familia tranquila."
currentNeed: "Adopción"
characterSketch: "Cariñoso una vez que confía, le encanta las caminatas tranquilas."
location: "Santiago"
gallery:
  - "../../assets/casos/adopcion/bruno/bruno-1.jpg"
  - "../../assets/casos/adopcion/bruno/bruno-2.jpg"
---
```

## Success dogs (`src/content/success-dogs/`)

### Required fields

| Field     | Type    | Description                              |
| --------- | ------- | ---------------------------------------- |
| `name`    | string  | Name of the galgo                        |
| `story`   | string  | Adoption success story                   |
| `gallery` | image[] | Up to 3 local images (defaults to empty) |

### Optional fields

| Field          | Type | Description                           |
| -------------- | ---- | ------------------------------------- |
| `instagramUrl` | URL  | Instagram post/profile for this story |

### Rules

- `story` must be 260 characters or fewer.
- `story` must explicitly mention the adoption outcome (enforced with `/adopt/i`).
- `gallery` accepts at most 3 images.
- Keep stories general enough to avoid invented facts, but specific enough to avoid sounding templated.
- Card summaries are derived from `story` via `src/utils/story-card-copy.ts`. The 260-character default should stay aligned with the content rule unless the product requirement changes.

### Example

```yaml
---
name: "Mora"
story: "Mora fue adoptada. Su hogar temporal no se pudo resistir. Ahora duerme en la cama y pasea todos los días."
gallery:
  - "../../assets/casos/exito/mora/mora-1.jpg"
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

| Field       | Type   | Description               |
| ----------- | ------ | ------------------------- |
| `category`  | string | Post category             |
| `heroImage` | string | Path or URL to hero image |

### Rules

- Blog posts feed the RSS feed at `/feed.xml`.
- There are no individual blog post pages currently; content is published via the collection and RSS only.
- Markdown-alternate routes are disabled (`markdownAlternate: false` in `astro.config.mjs`).

## Editorial workflows

### Adding a new dog for adoption

1. Create `src/content/adoption-dogs/<slug>.md`.
2. Add 1–3 images to `src/assets/casos/adopcion/<slug>/`.
3. Fill required frontmatter and optional fields as needed.
4. Set `currentNeed` to the appropriate value.
5. Run `npm run dog-images:check` to verify image consistency.
6. Run `npm run test:source` to catch content-rule violations.

### Moving a dog to success stories

1. `git mv src/content/adoption-dogs/<slug>.md src/content/success-dogs/<slug>.md`
2. `git mv src/assets/casos/adopcion/<slug> src/assets/casos/exito/<slug>`
3. Rewrite frontmatter:
   - Remove: `sex`, `age`, `weight`, `details`, `location`, `currentNeed`, `characterSketch`, `order`, `active`, `hiddenSince`, `hiddenReason`.
   - Add: `story` (≤260 chars, mentions adoption).
   - Keep: `name`, `instagramUrl`, `gallery` (with updated paths).
4. Update `scripts/prepare-casos-site.mjs` if the dog appears in `ADOPTION_IDS` or `ADOPTION_OVERRIDES`.

### Hiding a dog temporarily

Set the following frontmatter:

```yaml
active: false
hiddenSince: "2026-01-15"
hiddenReason: "Hogar temporal planea adoptar (no confirmado)"
```

A hidden dog remains in the collection but does not appear in listings. After 90 days, `tests/source-hygiene.test.ts` will fail unless the dog is moved or reactivated.

### Adding a supporter

1. Create `src/content/supporters/<slug>.md`.
2. Add a local logo to `src/assets/colaboradores/`.
3. Fill required frontmatter including `kind` and `logoAlt`.
4. Use `order` to control placement.

### Adding a blog post

1. Create `src/content/blog/<slug>.md`.
2. Fill required frontmatter: `title`, `pubDate`, `author`, `description`.
3. Optionally add `category` and `heroImage`.
4. The post will appear in `/feed.xml` automatically.

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
- No absolute filesystem paths in repo files or docs.
- No standalone `gtag.js` references.
- Analytics must be consent-gated.
- Text-quality checks enforce voice and tone patterns (for example, no “encajar” in site copy).

## Voice and tone

All content must follow `docs/voice-and-tone.md`. Key reminders:

- Warm, direct Spanish with neutral tuteo.
- First-person plural when the foundation speaks.
- No invented facts, stats, or quotes.
- Mention post-adoption support on adoption copy.
- No em dashes in site copy.

## Related documents

- `src/content.config.ts` — canonical schemas
- `docs/site-brief.md` — product intent
- `docs/prd.md` — functional requirements
- `docs/spec.md` — technical specification
- `docs/feature-inventory.md` — current pages and features
- `docs/developer-reference.md` — detailed image sizes and analytics events
- `AGENTS.md` — operational guidance

## Last updated

2026-07-05
