# Content Model

This document describes the three content collections — their schemas, field-by-field requirements, and the authoring rules that live in the content itself. The canonical schema definition is `src/content.config.ts`; when in doubt, that file wins.

- Editorial workflows (add a dog, move to success, hide a dog, add a supporter, add a blog post) live in `docs/maintenance.md`.
- Voice, tone, and copy style live in `docs/voice-and-tone.md`.
- Mechanical enforcement of content rules (character limits, hidden-dog expiry, redirect coverage) is documented in `docs/quality.md`.

## Collections overview

All collections are glob-loaded Markdown files with YAML frontmatter, validated by Zod at build time:

| Collection   | Content directory         | Content                                               |
| ------------ | ------------------------- | ----------------------------------------------------- |
| `dogs`       | `src/content/dogs/`       | Adoption profiles and success stories, one collection |
| `supporters` | `src/content/supporters/` | Collaborating organizations and people                |
| `blog`       | `src/content/blog/`       | Blog posts; powers `/blog/` and the RSS feed          |

## Dogs (`src/content/dogs/`)

All dogs live in a single `dogs` collection, discriminated by `status`: `"adopcion"` for dogs available for adoption, `"exito"` for adoption success stories. The schema is a Zod discriminated union on `status`, so each variant validates only its own fields — adoption-only fields must be dropped when a dog moves to `exito`.

### Shared fields (both statuses)

| Field          | Type    | Required | Notes                                                                     |
| -------------- | ------- | -------- | ------------------------------------------------------------------------- |
| `name`         | string  | yes      | Name of the galgo                                                         |
| `status`       | literal | yes      | `"adopcion"` or `"exito"` (the union discriminator)                       |
| `instagramUrl` | URL     | no       | Instagram post or profile for this dog                                    |
| `gallery`      | image[] | yes/no   | Max 3 local images; required for `adopcion`, defaults to `[]` for `exito` |

### `status: "adopcion"` fields

| Field             | Type    | Required | Notes                                                                     |
| ----------------- | ------- | -------- | ------------------------------------------------------------------------- |
| `sex`             | enum    | yes      | `"Macho"` or `"Hembra"`                                                   |
| `age`             | string  | yes      | Descriptive age (e.g. `"4 años"`)                                         |
| `weight`          | string  | yes      | Descriptive weight (e.g. `"24 kg"`)                                       |
| `details`         | string  | yes      | Longer profile description; rescue context lives here                     |
| `characterSketch` | string  | yes      | Short character summary for cards; daily-life behavior lives here         |
| `location`        | string  | no       | Current place or care setting                                             |
| `adoptionFacts`   | object  | no       | Decision data; see the sub-table below                                    |
| `currentNeed`     | enum    | no       | `"Adopción"` (default), `"Hogar temporal"`, `"Adopción u hogar temporal"` |
| `order`           | integer | no       | Manual sort order; currently unused by the site code                      |
| `active`          | boolean | no       | Default `true`; set `false` to hide the dog temporarily                   |
| `hiddenSince`     | date    | no*      | Date the dog was hidden; *required when `active: false`                   |
| `hiddenReason`    | string  | no*      | Why the dog is hidden; *required when `active: false`                     |

The `hiddenSince`/`hiddenReason` pairing is a schema-level refinement: the build fails when `active: false` lacks either field.

#### `adoptionFacts` sub-fields

| Field                      | Type   | Required                | Notes                                                                  |
| -------------------------- | ------ | ----------------------- | ---------------------------------------------------------------------- |
| `compatibility`            | object | yes (inside the object) | Per-group compatibility answers; see next row                          |
| `compatibility.children`   | enum   | yes                     | One of `"sí"`, `"no"`, `"caso a caso"`, `"sin información confirmada"` |
| `compatibility.cats`       | enum   | yes                     | Same four values                                                       |
| `compatibility.femaleDogs` | enum   | yes                     | Same four values                                                       |
| `compatibility.maleDogs`   | enum   | yes                     | Same four values                                                       |
| `homeGuidance`             | string | no                      | Home-setting guidance confirmed by the profile                         |
| `exerciseNeeds`            | string | no                      | Confirmed exercise needs                                               |
| `medicalOrSafetyNeeds`     | string | no                      | Confirmed medical or safety needs                                      |
| `personalityBehavior`      | string | no                      | Confirmed personality and behavior notes                               |

#### Compatibility semantics

The four compatibility values are per-dog honest answers, not promises:

- `"sin información confirmada"` means the record holds no specific observation for that group. Prefer it over guessing.
- `"caso a caso"` means the confirmed limit applies only to part of the group — for example, "sin niños pequeños". Preserve the precise limit in `homeGuidance` so the adopter sees the actual boundary.
- Never turn a general description such as "se lleva bien con todos" into a per-group guarantee. Add `homeGuidance`, `exerciseNeeds`, `medicalOrSafetyNeeds`, and `personalityBehavior` only when the intake or profile copy confirms them; do not infer them from breed stereotypes.

### `status: "exito"` fields

| Field     | Type    | Required | Notes                                                                     |
| --------- | ------- | -------- | ------------------------------------------------------------------------- |
| `story`   | string  | yes      | Success story: 260 characters or fewer, must mention the adoption outcome |
| `gallery` | image[] | no       | Max 3 images; defaults to `[]`                                            |

Success entries power the homepage story preview, the complete `/casos-de-exito/` archive, and selected stories on `/por-que-galgos/`. Card summaries are derived from `story` by `src/utils/dog-content.ts`; its 260-character excerpt default and this content rule are the same limit, so keep the story within it.

### Dog image assets

- Each dog's images live in `src/assets/casos/<slug>/` — a flat per-slug directory with no `adopcion/`/`exito/` split, so files and assets never move when a dog's status changes.
- Gallery paths are relative from the content file, e.g. `../../assets/casos/bruno/bruno-1.jpg`.
- Maximum 3 images per dog, enforced both by the schema and by the UI gallery helpers.
- Extensions are normalized to `.jpg` by `scripts/normalize-dog-images.mjs`; keep extensions consistent within a dog's folder and use the script instead of ad hoc renames.

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

| Field         | Type    | Required | Notes                                                                                       |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------- |
| `name`        | string  | yes      | Organization or person name                                                                 |
| `description` | string  | yes      | What they contribute                                                                        |
| `website`     | URL     | yes      | Link to the supporter                                                                       |
| `kind`        | enum    | yes      | `"Institución"`, `"Empresa"`, `"Persona"`, `"Fundación"`, `"Colectivo"`, or `"Veterinaria"` |
| `logo`        | image   | yes      | Local logo image; files live in `src/assets/images/supporters/`                             |
| `logoAlt`     | string  | yes      | Accessible alt text for the logo                                                            |
| `thanksLabel` | string  | no       | Text for the thank-you link                                                                 |
| `thanksUrl`   | URL     | no       | Link to a thank-you post or page                                                            |
| `order`       | integer | no       | Manual sort order                                                                           |

Example:

```yaml
---
name: "Clínica Veterinaria Patitas"
description: "Nos apoya con atención veterinaria de urgencia."
website: "https://patitas.example"
kind: "Veterinaria"
logo: "../../assets/images/supporters/patitas.webp"
logoAlt: "Logo de Clínica Veterinaria Patitas"
order: 1
---
```

## Blog (`src/content/blog/`)

| Field          | Type    | Required | Notes                                                            |
| -------------- | ------- | -------- | ---------------------------------------------------------------- |
| `title`        | string  | yes      | Post title; rendered as the page's only `h1`                     |
| `pubDate`      | date    | yes      | Publication date                                                 |
| `author`       | string  | yes      | Author name                                                      |
| `description`  | string  | yes      | Short summary                                                    |
| `category`     | string  | no       | Post category                                                    |
| `heroImage`    | image   | no       | Local hero image, e.g. under `src/assets/blog/<slug>/`           |
| `heroImageAlt` | string  | no       | Accessible alt text for the hero image                           |
| `draft`        | boolean | no       | Default `false`; `true` keeps the post out of pages and the feed |

Rules:

- Posts feed the RSS feed at `/feed.xml` and the `/blog/` listing plus `/blog/<id>/` post pages; `draft: true` excludes a post from all three.
- Post bodies must start headings at `##`. The page renders the only `h1` from `title`, so a body-level `#` would duplicate the top-level heading.
- Markdown-alternate routes are disabled (`markdownAlternate: false` in `astro.config.mjs`); do not add a `.md` endpoint for posts.
