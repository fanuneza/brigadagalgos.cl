# Quality Requirements

This document states **what must be true** of the site. For how each check works, see `docs/architecture.md`; for how to run and fix them, see `docs/maintenance.md`.

## Test-enforced invariants

`tests/source-hygiene.test.ts` (run via `npm run test:source`, also part of `npm test`) enforces these ten requirements:

1. **Consent-gated analytics.** No file in `src/` or `public/` may reference `gtag/js` or `google-analytics.com/gtag`. GA4 may only ever arrive through GTM.
2. **Strict CSP in `public/_headers`.** The Content-Security-Policy must be present with `default-src 'self'`, `object-src 'none'`, and `script-src-attr 'none'`; `script-src`/`script-src-elem` may allow only `'self'`, `https://www.googletagmanager.com`, and `https://static.cloudflareinsights.com` (`'unsafe-inline'` is permitted only in `script-src-elem`); `connect-src` covers the Web3Forms API, GA/GTM, and Cloudflare Insights hosts; `img-src` covers `'self'`, `data:`, and GA/GTM hosts; `frame-src` allows `https://www.googletagmanager.com`. No `gtag.js` allowance and no wildcard `*` anywhere in the policy.
3. **First-party consent cookie.** `src/scripts/cookie-consent.ts` stores consent in `document.cookie` with `SameSite=Lax`; `localStorage` is forbidden for consent state.
4. **No placeholder values.** The string `REPLACE_WITH_` must not appear in `src/` or `public/`.
5. **No absolute filesystem paths.** `/home/…`, `/Users/…`, or `C:\Users\…` style paths must not appear in `src/`, `public/`, `scripts/`, `tests/`, or root-level Markdown. Repo files use repo-relative paths only.
6. **Vendored FontAwesome provenance.** If a vendored FontAwesome directory exists in `public/`, both its sprite and its `LICENSE.txt` must state "Font Awesome Free". (No such directory is currently present; the requirement is conditional.)
7. **Hidden-dog metadata and expiry.** A dog with `status: "adopcion"` and `active: false` must carry a valid `hiddenSince` date and a non-empty `hiddenReason`, and may not stay hidden longer than 90 days.
8. **Explicit compatibility facts.** Every active adoption dog must declare `adoptionFacts` with all four `compatibility` fields (`children`, `cats`, `femaleDogs`, `maleDogs`), each set to one of `sí`, `no`, `caso a caso`, `sin información confirmada`.
9. **Success-story shape.** Every `status: "exito"` dog must have a `story` of at most 260 characters that mentions the adoption outcome (matches `/adopt/i`).
10. **Redirect coverage.** `public/_redirects` must contain `/adoptar/<slug>/ /casos-de-exito/ 301` for every retired or hidden adoption profile, and must not redirect any currently active profile. Retired-slug detection needs full git history, which is why CI checks out with `fetch-depth: 0` (`.github/workflows/ci.yml`); on a shallow clone the rule degrades to hidden dogs only.

## Analytics contract

- GTM is the only GA4 delivery path; there is no standalone `gtag.js`. The container ID defaults in `src/config/site.ts` and is overridable via `PUBLIC_GTM_ID`.
- GTM never loads before explicit acceptance. Acceptance pushes the granted consent state; rejection pushes `analytics_storage: "denied"` (`ad_storage`, `ad_user_data`, `ad_personalization` stay denied in all states) via a `cookie_consent_update` dataLayer entry. The "manage consent" action clears the consent cookie and reloads, restoring the banner.
- Behavioral events (clicks, section views, milestones, scroll depth) are discarded unless the consent cookie reads `accepted`.
- WhatsApp prefilled messages stay inside the link URL and must never enter the `dataLayer`.
- The contact form (`src/scripts/form.ts`) surfaces fixed, site-written error messages — never the provider's (Web3Forms) response message.
- `tests/analytics-consent.spec.ts` verifies these behaviors in a real browser.

### Adoption-intent funnel

The funnel is deliberately small: it records progression, never dog-fit answers, contact details, form fields, or free text. View milestones fire once per page visit when the surface becomes meaningfully visible; click milestones fire once per activation.

| Event                       | Fires when                                                      | Key parameters                                                     |
| --------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `adoption_listing_view`     | The active listing on `/adoptar/` is visible                    | `page_path`                                                        |
| `adoption_dog_profile_view` | A dog profile is visible                                        | `page_path`, `dog_slug`, `dog_name`                                |
| `adoption_support_view`     | The adoption process or FAQ section is visible                  | `page_path`, `support_type` (`adoption_process` or `faq`)          |
| `whatsapp_click`            | An adoption-intent WhatsApp CTA is activated                    | `page_path`, `event_location`, `adoption_intent: "true"`           |
| `adoption_apply_click`      | The adoption form link is activated (`dog_profile`, `tail_cta`) | `page_path`, `event_location`, `destination_url`, `outbound: true` |
| `contact_form_success`      | The contact form submits successfully                           | `page_path`, `form_id`                                             |

`data-track-location` values are unique per surface; new surfaces must mint a new value rather than reuse one.

## Accessibility and SEO requirements

- Every indexable page must have a unique `<title>` and meta description, of sane length.
- Every page must carry exactly one meaningful `h1`.
- Images must have accessible alt text, with decorative images marked as such.
- Heading hierarchy must not skip levels in a way Lighthouse flags.

Machine-enforced: the `@jdevalk/astro-seo-graph` integration in `astro.config.mjs` runs the `validateH1`, `validateUniqueMetadata`, `validateImageAlt`, `validateMetadataLength`, and `validateInternalLinks` validators at build time; `tests/a11y.spec.ts` runs axe-based scans in the browser; Lighthouse asserts the accessibility and SEO categories (below). Human-enforced: whether alt text and titles are _good_ (specific, humane, non-duplicative in tone) — the validators only check presence and uniqueness.

## Lighthouse budgets

`.lighthouserc.cjs` runs `lhci autorun` (`npm run test:lighthouse`) against the static `dist/` build with `numberOfRuns: 1` on a fixed URL list. Error-level assertions: performance ≥ 0.99; accessibility, best-practices, and SEO at 1.0. Warn-level metric caps: LCP ≤ 3500 ms, CLS ≤ 0.15, TBT ≤ 200 ms. Several informational insight audits and minor image/CSS audits are off (see the config comments for the rationale per audit); `bf-cache` is off because Chrome evicts the home page after buffered network data and Lighthouse reports the miss as not actionable.

**Flakiness protocol:** with a single run and 0.99 thresholds, an error-level failure may be Lighthouse's normal rounding variance. Re-run `npm run test:lighthouse` once before treating any failure as a real regression.

## Accepted trade-off

`dog_share_click` (`src/scripts/share-dog.ts`) fires when the share button is clicked, before the native share completes — dismissing the share sheet still counts. This is accepted: the event measures intent, which is the useful funnel signal, and a "completed share" signal is not available across targets.

## What no check enforces

- **Voice and tone.** `docs/voice-and-tone.md` is the source of truth, but `scripts/check-text-quality.mjs` (`npm run test:text`) mechanically enforces only three things: the banned verb "encajar", voseo detection (the site uses Chilean tuteo), and mojibake/replacement-character detection. Rhythm, warmth, specificity, and CTA style are editorial judgment.
- **"Caso a caso" semantics.** The compatibility enum includes `caso a caso`, but no check validates when it is appropriate. It is a per-dog editorial decision and must never be generalized into a per-group guarantee (e.g. "galgos are fine with cats").
- **Copy accuracy in general.** No test verifies that site text is factually correct, current, or consistent with the organization's real processes. Review is human.
