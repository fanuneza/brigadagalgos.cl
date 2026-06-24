# Agent Guidance

This repository is a static Astro site deployed to Cloudflare Pages from GitHub.

## Required Opening Moves

- Use Astro Docs MCP for Astro framework questions, integrations, routing, content collections, image handling, and current best practices.
- Verify current Astro APIs before implementing features that commonly change or have had experimental phases, especially content collections, actions, sessions, adapters, view transitions, image handling, and integrations.
- Use jCodeMunch for code navigation when the repo is indexed. Prefer indexed discovery, ranked context, dependency graphs, and impact checks over raw search.
- If the repo is not indexed, index it before broad code-navigation work.
- Start new projects from an Astro template or `npm create astro@latest` template flow. Do not build the initial project structure by hand unless the user explicitly asks for a custom scaffold.
- Use `astro add` for official Astro integrations. For non-Astro packages, install with npm commands and exact pins; do not hand-edit `package.json` dependency entries.
- Keep Astro client globals in `src/env.d.ts` with `/// <reference types="astro/client" />`; do not narrow `compilerOptions.types` in `tsconfig.json` unless the project explicitly needs a closed ambient type list.

## Stack Defaults

- Astro static output.
- npm with committed `package-lock.json`.
- Node 22 or newer, pinned by `.nvmrc`.
- Exact package versions, installed at the latest available version when the project starts or when dependencies are intentionally updated.
- GitHub Actions for CI.
- Cloudflare Pages for hosting.
- GA4 only through GTM and only after analytics consent.
- Cloudflare Web Analytics enabled as backup telemetry and allowed by CSP.
- Follow Astro defaults (such as the default `compressHTML: 'jsx'` whitespace compression behavior) unless custom adjustments are specifically requested.

## Code Standards

- Keep code DRY. Extract duplicated metadata, schema, analytics, content mapping, and UI logic into small shared modules.
- Optimize for jCodeMunch: use clear file names, named exports for reusable logic, stable symbols, typed interfaces, and small purpose-specific modules.
- Use the `@/*` alias only for imports under `src/`. Astro supports this through `tsconfig.json`; if another tool imports source files directly and does not honor TS paths, configure that tool or use relative imports in the test/tooling file.
- Do not create oversized catch-all files. Split by behavior when a file becomes hard to scan.
- Do not delete Astro framework entrypoints only because generic dead-code analysis marks them unreachable. Treat `src/pages/**`, `src/layouts/**`, `src/components/**`, `src/content.config.*`, `astro.config.*`, and scripts as live unless proven otherwise.
- Prefer structured data/config objects over repeated literals across pages.
- Prefer local components and utilities over ad hoc inline script blocks.
- Add source hygiene tests for project invariants that normal linters cannot see, such as no direct GA4 scripts, no production imports from reference docs, local icon vendoring, and no corrupted text.

## SEO, Accessibility, Performance

- Every indexable page must have a unique title, meta description, canonical URL, Open Graph tags, Twitter card tags, one `h1`, accessible image alt text, and appropriate JSON-LD when relevant.
- Shared entities in JSON-LD must come from a typed graph builder, not duplicated page literals.
- Generate and verify sitemap, robots, manifest, and 404 output.
- Aim for PSI/Lighthouse 100 in Performance, Accessibility, Best Practices, and SEO.
- Use responsive, dimensioned, optimized images. The LCP image must not be lazy-loaded.
- Use Astro image tooling for responsive AVIF/WebP variants when images are imported into source.
- Avoid unnecessary client JavaScript. Astro islands must be justified by real interaction.

## Analytics and Consent

- GTM is the only delivery path for GA4. Do not add standalone `gtag.js`.
- Do not load GTM before analytics consent.
- Push Google Consent Mode v2 denied state before consent and granted state after acceptance.
- Delete known GA/GTM cookies after rejection.
- Cloudflare Web Analytics remains enabled as a backup data point. Do not disable it unless the project owner explicitly changes the standard.
- Map site interactions to GA4-recommended event names when possible.
- Use reusable tracked-link attributes/components for CTA analytics. Do not hand-roll incompatible event data on each link.

## Security and Deployment

- `public/_headers` is required for Cloudflare Pages.
- Target A+ on securityheaders.com.
- Keep CSP strict and document each third-party domain.
- Use HTTPS-only production deployment, HSTS, nosniff, frame protections, referrer policy, permissions policy, COOP, and CORP.
- Use `public/_redirects` for URL migrations and permanent 301 redirects.

## Copy and Encoding

- Follow the project language in `docs/site-brief.md`; default is Chilean Spanish when unspecified.
- Spanish copy must use correct accents and punctuation.
- All text files must be UTF-8. Never introduce mojibake, replacement characters, or visibly corrupted accent/punctuation sequences.
- Prefer project voice docs over generic marketing copy.

## Icons and Assets

- Prefer SVGs from `@fortawesome/fontawesome-free` for icons.
- Do not load FontAwesome from a CDN.
- Keep decorative SVGs accessible with empty alt text or `aria-hidden` as appropriate.

## Code Navigation

Always use jCodemunch-MCP tools for code navigation. Do not use Read, Grep, Glob, or Bash to explore code.

Exception: use Read only when the harness requires it before editing or writing a specific file. Use jCodemunch to find and understand the file first.

Start every code session:

1. `resolve_repo { "path": "." }` to confirm the project is indexed. If it is not indexed, use `index_folder { "path": "." }`.
2. `suggest_queries` when the repo is unfamiliar.
3. `plan_turn { "repo": "...", "query": "your task description", "model": "<your-model-id>" }` as the opening move for code tasks.

Use the `plan_turn` confidence result:

- `high`: go directly to the recommended files or symbols. Use at most two supplementary reads.
- `medium`: inspect recommended files. Use at most five supplementary reads.
- `low`: report that the feature likely does not exist. Do not keep searching for it.

## Finding Code

- Symbol by name: `search_symbols`
- Decorator-aware query: `search_symbols(decorator="X")`
- String, comment, or config value: `search_text`
- Database columns: `search_columns`
- Repo layout: `get_repo_outline` or `get_file_tree`

Before opening a file, call `get_file_outline`.

Use:

- `get_symbol_source` for one or more symbols.
- `get_context_bundle` for a symbol and its imports.
- `get_file_content` only when a line range is needed.

## Relationships and Impact

Use jCodeMunch tools for impact checks:

- `find_importers`
- `find_references`
- `check_references`
- `get_dependency_graph`
- `get_blast_radius`
- `get_changed_symbols`
- `find_dead_code`
- `get_class_hierarchy`

If `search_symbols` returns `negative_evidence` with `verdict: "no_implementation_found"`, do not re-search with different terms hoping to find it. Report that no existing implementation was found and check only the listed `related_existing` files for nearby context.

If the verdict is `low_confidence_matches`, examine the matches before assuming they implement the feature.

## Copywriting

Always follow `docs\voice-and-tone.md` when writing or editing site copy. Treat it as the source of truth for brand voice, tone, rhythm, punctuation, CTAs, and content patterns.

## After Editing

If PostToolUse hooks are not available, call `register_edit` with edited file paths to invalidate caches. For bulk edits of five or more files, register all edited paths together.

Respect existing user changes. Do not revert unrelated work unless explicitly asked.

## Token Efficiency

- If `_meta` contains `budget_warning`, stop exploring and work with the context already gathered.
- If `auto_compacted: true` appears, assume the result was compressed and continue from the available context.
- Use `get_session_context` when available to avoid re-reading the same files.

## Model Parameter

Include `model="<your-model-id>"` in the opening `plan_turn` call.

Use the active runner model id:

- GPT-5, GPT-4o, o1, or Llama: use the model id as printed by the runner.
- Claude Opus: use `claude-opus-4-7` or the matching `claude-opus-*` id.
- Claude Sonnet: use `claude-sonnet-4-6`.
- Claude Haiku: use `claude-haiku-4-5`.

If `plan_turn` is not appropriate for a non-code task, call `announce_model(model="...")` once instead.

## Required Verification

Before delivery or commit, run the checks relevant to the change:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

For launch or major visual changes, also run:

```bash
npm run test:lighthouse
```

Document any skipped check and the reason.
