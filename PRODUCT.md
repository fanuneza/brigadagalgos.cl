# Product — Brigada Galgos website

This file is the product-intent reference: who the site serves, what it must achieve, and what stays out. Consult it first when deciding whether a feature, page, or content change belongs. It deliberately does not repeat the visual system (`DESIGN.md`), the copy rules (`docs/voice-and-tone.md`), the architecture (`docs/architecture.md`), or the quality gates (`docs/quality.md`).

## Purpose

A fast, accessible, static-only website that helps Brigada Galgos:

- Show galgos currently looking for adoption or a foster home.
- Share adoption success stories.
- Explain the adoption and foster processes.
- Channel donations and other support.
- Answer common questions before they become messages.
- Make contact easy through WhatsApp, email, and social channels.

## Audience

1. **Primary: potential adopters and foster homes in Chile.** They want to know what living with a galgo requires, how adoption works, and whether a specific dog fits their life.
2. **Secondary: potential donors.** They want to know where the money goes, what impact it has, and how to give.
3. **Tertiary: volunteers, supporters, and the curious.** They want to understand the organization and share its work.

## Positioning and brand personality

Warm, direct, honest, and specific: a small volunteer team speaking in first person, not an institution. Facts carry the emotion; no invented detail, no generic NGO clichés. The enforceable copy rules (tuteo, banned phrases, CTA style) live in `docs/voice-and-tone.md`; the visual language lives in `DESIGN.md`.

## Conversion model

Adoption is the site's single primary action, and each route gets exactly one primary CTA. Conversion itself happens off-site: WhatsApp conversations, the adoption and foster forms (`SITE.adoptionForm` and `SITE.fosterForm` in `src/config/site.ts`), bank transfer, and eSponsor. The site never processes payments or applications itself.

The homepage is a conversion funnel, not a catalogue. Section order in `src/pages/index.astro` (weights follow the vocabulary of `DESIGN.md` §6):

1. Hero, with adoption as the only primary CTA; foster sits one weight below.
2. `FeaturedAdoptionDogs` (lead): a rotating preview of active adoption dogs.
3. `MissionSection` (support): mission, compact `TrustStatsSection`, compact rescue flow.
4. `WhyGalgosSection` (support): education that lowers the perceived risk of adopting.
5. `StoriesSection` (support): success-story preview linking to the full archive.
6. `HelpCards` (quiet): the three ways to help.
7. `DonationBanner` (quiet band): donation as the closing, lower-weight ask.

`/adoptar/` remains the complete active listing; do not grow the homepage preview into the catalogue. Foster and donation are secondary actions throughout, reachable one weight below the adoption CTA.

## Key flows

| Flow                | Entry                            | Action                                                 | Success signal                                    |
| ------------------- | -------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Adopt a galgo       | Home, `/adoptar/`, dog profile   | WhatsApp message or adoption-form submission           | Visitor starts a conversation with Brigada        |
| Offer a foster home | `/hogar-temporal/`, Home         | WhatsApp message                                       | Visitor asks about foster requirements            |
| Donate              | `/donar/`, Home                  | Copy bank details, open eSponsor, or start a transfer  | Visitor reaches a donation channel                |
| Learn about galgos  | `/por-que-galgos/`, FAQ          | Read, then move to adopt or contact                    | Visitor can judge whether a galgo fits their life |
| Read a story        | Home preview, `/casos-de-exito/` | Browse the archive, open a gallery, return to adoption | Visitor connects emotionally with the cause       |

## Success metrics

- **Qualified contact:** WhatsApp conversations and form submissions, tracked as GTM events after consent.
- **Donation intent:** visitors reaching a donation channel (bank-details copy, eSponsor click).
- **Adoption confidence:** movement from the educational pages (`/por-que-galgos/`, `/preguntas-frecuentes/`) into `/adoptar/` or contact.
- **Quality gates stay green:** thresholds, commands, and Lighthouse targets are owned by `docs/quality.md`.

## Out of scope

- Server-side functionality: no login, dashboards, or dynamic APIs. The build is static-only.
- On-site payments or e-commerce; donations go through bank transfer or eSponsor.
- Third-party CDNs for dog photography; dog images are local assets optimized by Astro.
- A markdown-alternate endpoint for blog posts (`markdownAlternate: false` is deliberate; the removed `.md` route was a build breaker).
- Individual success-story detail pages; stories render as cards and lightboxes only.
- Search and multi-language support: deferred nice-to-haves, not current requirements.

## Related documents

- `docs/voice-and-tone.md` — copy and brand voice rules.
- `DESIGN.md` — visual design system and section-weight vocabulary.
- `docs/architecture.md` — technical architecture and integrations.
- `docs/content-model.md` — content schemas and editorial workflows.
- `docs/quality.md` — verification commands, thresholds, and testing rules.
