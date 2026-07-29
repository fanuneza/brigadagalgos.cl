# Task 10 — Fix blog post `<article>` semantics

## Goal

Wrap the entire blog post (header + rendered content) in a single `<article>` — already listed as an open item in `docs/spec.md`.

## Current state

- `src/pages/blog/[id].astro`: `<article>` wraps ONLY the post header (title/meta/hero); the rendered `<Content />` lives in a sibling `<section>`. Assistive tech and reader-mode parsers treat the body as outside the article.

## Astro docs reference

- Project rule (AGENTS.md): "Respect heading hierarchy… one meaningful h1 per page"; semantic landmarks are enforced indirectly by axe/Lighthouse.
- Content collections rendering (`render(post)` + `<Content />`) stays exactly as-is; this is a pure markup move.

## Changes

1. In `src/pages/blog/[id].astro`, restructure so `<article>` contains both the header block and the content region (the inner `<section>` may be dropped or kept as a plain wrapper div/class hook — check what the CSS targets before removing it).
2. Adjust `src/styles/` blog selectors only if they relied on the old nesting (prefer class selectors that survive the move; make minimal CSS edits).
3. Keep the JSON-LD `BlogPosting` graph untouched.

## Acceptance criteria

- Rendered DOM: one `<article>` per post page containing title, meta, hero image, and full body.
- Heading levels unchanged (h1 once, then h2+ from markdown).
- `npm run build && npm test` green; axe spec for blog pages passes; Lighthouse SEO/a11y unchanged or improved.
- Remove the corresponding open item from `docs/spec.md`.
