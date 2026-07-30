# T04 — Adoption decision data

| Field      | Value                                                      |
| ---------- | ---------------------------------------------------------- |
| Wave       | 2 — Adoption data                                          |
| Branch     | `ux/wave-02-t04-adoption-data`                             |
| Mode       | Serial                                                     |
| Depends on | Wave 1 merged                                              |
| Commit     | `content(T04): structure confirmed adoption decision data` |

## Objective

Give listing/profile agents a typed, source-backed way to show the compatibility
and care facts people need before starting an adoption conversation.

## Ownership

- `src/content.config.ts`
- active adoption entries in `src/content/dogs/`
- `src/utils/dog-content.ts`
- `tests/dog-content.test.ts`
- relevant source-hygiene tests
- `docs/content-model.md`

Do not change card/profile markup or invent facts.

## Data design

Add optional structured fields for confirmed facts such as:

- current location or care setting;
- compatibility with children, cats, female dogs, and male dogs;
- home/routine guidance;
- energy or walk needs;
- medical or safety needs;
- one concrete personality behavior;
- status values that distinguish `sí`, `no`, `caso a caso`, and `sin
información confirmada`.

Use a compact nested object or named typed fields consistent with the existing
schema. Unknown must remain distinguishable from “no”.

## Implementation

1. Inventory every fact in the five active entries. Map only explicit claims.
2. Remove duplication between `details` and `characterSketch`; keep rescue
   context in one and daily-life/personality in the other.
3. Replace diminutives and generic “para siempre” phrasing where the voice guide
   asks for a more concrete individual portrait.
4. Expose the fields through named helpers/types. Preserve existing consumers
   until Wave 3 adopts them.
5. Add schema and helper tests for known, unknown, negative, and case-by-case
   values.
6. Document editorial examples and a checklist for future dogs.

## Acceptance

- All five active dogs validate with no invented compatibility claim.
- `location` is no longer lost in the derived model.
- Unknown is rendered/data-modeled explicitly, never treated as compatible.
- Gallery cap, hidden status, redirects, and current shuffle behavior remain
  unchanged.
- Source and text-quality tests stay green.

## Verification

```bash
npm run test:source
npx vitest run tests/dog-content.test.ts
npm run lint
npm run build
```

Handoff must list which statements were mapped from each dog’s existing copy.
