# Task 07 — Remove the duplicate WebSite JSON-LD node on the homepage

## Goal

Emit exactly one `WebSite` structured-data node per page.

## Current state

- `src/layouts/BaseLayout.astro` renders a JSON-LD graph from `buildStructuredDataGraph()` (`src/utils/structured-data.ts:92`), which already includes a `WebSite` node.
- `src/pages/index.astro:102` additionally injects an inline `buildWebSiteStructuredData()` script — a SECOND `WebSite` node with a different `@id`/fields. Duplicate nodes with conflicting `@id`s degrade how search engines parse the graph.

## Astro docs reference

- Project rule (AGENTS.md): "Keep JSON-LD generated from shared builders rather than duplicated literals." Centralized builders in `src/utils/structured-data.ts` are the single source.

## Changes

1. Delete the inline `buildWebSiteStructuredData()` script block from `src/pages/index.astro`.
2. Ensure the homepage's centralized graph (via `BaseLayout` props or page-level graph builder in `structured-data.ts`) carries any homepage-specific fields the deleted block had (e.g. `potentialAction` SearchAction, `inLanguage`, `url`) — merge them into the shared builder if missing.
3. If `buildWebSiteStructuredData()` becomes unused, remove it (check other importers first — e.g. `structured-data.ts` itself may use it internally).

## Acceptance criteria

- `dist/index.html` contains exactly one `"@type":"WebSite"` occurrence.
- Remaining node keeps all fields the merged graph previously exposed (diff the JSON-LD before/after).
- `npm run build && npm test` green (seo-graph validators run at build).
