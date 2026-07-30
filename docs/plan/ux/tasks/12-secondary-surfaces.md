# T12 — Secondary surfaces

| Field      | Value                                                       |
| ---------- | ----------------------------------------------------------- |
| Wave       | 5 — Cross-site coherence                                    |
| Branch     | `ux/wave-05-t12-secondary-surfaces`                         |
| Mode       | Serial before T13                                           |
| Depends on | Waves 1–4                                                   |
| Commit     | `ux(T12): connect proof and support pages back to adoption` |

## Objective

Make stories, blog, collaborators, and 404 useful parts of the adoption journey
without turning every page into a sales funnel.

## Ownership

- `src/pages/casos-de-exito.astro`
- `src/pages/blog/`
- `src/pages/colaboradores.astro`
- `src/pages/404.astro`
- `src/components/StoryCard.astro`
- story/blog/collaborator component CSS
- related tests

Do not edit global CSS, navigation, active dog cards, or content claims.

## Implementation

1. Simplify archive cards to one decisive image and story excerpt; keep full
   gallery/lightbox access where it adds value without dozens of repeated
   controls.
2. Make the relationship between a success story and active adoption clear
   with one quiet next step after meaningful proof.
3. On blog index/articles, use contextual links where the content answers an
   adoption doubt. Avoid a generic boxed CTA after every article.
4. Explain collaborators by what their support changes for dogs; preserve all
   source-backed names, logos, and outbound links.
5. Give 404 one clear recovery choice (“Ver galgos en adopción”), then a short
   list of secondary destinations.
6. Verify lazy-loaded imagery after scrolling; do not treat offscreen
   `naturalWidth === 0` before intersection as a broken image.

## Acceptance

- Archives have fewer repeated controls and remain fully server-rendered.
- Every secondary route offers a relevant return path without adding a second
  primary action.
- External indicators and tracking continue to use shared link primitives.
- RSS, structured data, draft filtering, galleries, and redirects remain
  intact.

## Verification

```bash
npx playwright test tests/stories-section.spec.ts tests/lightbox.spec.ts tests/build-output.spec.ts
npx playwright test tests/a11y.spec.ts
npm run build
npm run test:lighthouse
```

Capture stories, blog index/article, collaborators, and 404 at mobile/desktop.
