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

Use jCodemunch tools for impact checks:

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
