# Brigada Galgos — Project Scope

## 1. Idea — what we are documenting

The scope covers the full documentation layer for the Brigada Galgos website: product intent, functional requirements, technical architecture, current feature inventory, content model, and architecture map. The goal is to create a single source of truth that supports future feature planning without losing context.

### Output artifacts

- `docs/site-brief.md` — product brief with audience, goals, key flows, and success metrics.
- `docs/prd.md` — product requirements document for the current site.
- `docs/spec.md` — technical specification with architecture, data model, and integrations.
- `docs/feature-inventory.md` — current feature inventory of pages, sections, and capabilities.
- `docs/content-model.md` — content model documentation with schemas and editorial workflows.
- `docs/architecture-map.md` — architecture map and component/content flow.

### Depth

**Medium** — capture enough for a future maintainer or AI agent to work confidently, without exhaustive edge-case analysis.

## 2. User — who benefits from this documentation

**Primary audience:**

- Future Fabián, months from now.
- AI agents working on the project.

**Secondary audience:**

- Potential contributors / developers.
- Content editors or volunteers.
- Stakeholders at Brigada Galgos.

## 3. Problem — why document now

The main driver is **planning new features without losing context**. The site has grown and knowledge is partly spread across `README.md`, `AGENTS.md`, `docs/developer-reference.md`, and `docs/voice-and-tone.md`. A consolidated scope gives the project a stable base before the next build phase.

A concrete trigger is that `docs/site-brief.md` was referenced in `AGENTS.md` but did not exist.

## 4. Constraints

- **Time:** a regular amount of documentation effort is acceptable if it helps the future of the project.
- **Reuse vs. rewrite:** reuse existing docs where they are current; rewrite or consolidate where implementation details are scattered or outdated.
- **Doc locations:** `README.md` and `AGENTS.md` stay in the project root. All other docs live in `docs/`.
- **Format:** Markdown only.
- **Audience language:** documentation in English; site copy in Chilean Spanish per `docs/voice-and-tone.md`.

## 5. Explicit cuts

**Out of scope:**

- Design-system files — they have been deleted from the project and are not in use.

**In scope:**

- Everything else can use help, including updates to `README.md` and `AGENTS.md` to consolidate documentation references.

## 6. Definition of done

- All six scope artifacts exist in `docs/`.
- `README.md` and `AGENTS.md` point to the new documentation.
- `docs/builder-profile.md` reflects the current doc set.
- No design-system coverage is introduced.
- Documentation is written in Markdown, at medium depth, in English.

## 7. Related documents

- `docs/builder-profile.md`
- `docs/site-brief.md`
- `docs/prd.md`
- `docs/spec.md`
- `docs/feature-inventory.md`
- `docs/content-model.md`
- `docs/architecture-map.md`
- `docs/voice-and-tone.md`
- `docs/developer-reference.md`
- `README.md`
- `AGENTS.md`

## Last updated

2026-07-05
