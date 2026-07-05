# Brigada Galgos — Site Brief

## Purpose

This document defines the product intent of the Brigada Galgos website. It is the first reference for anyone deciding whether a new feature, page, or content change belongs on the site.

## What the site is

A fast, accessible, static-first website that helps Brigada Galgos:

- Show galgos currently looking for a family or foster home.
- Share adoption success stories.
- Explain the adoption and foster processes.
- Accept donations and support.
- Answer common questions from prospective adopters and foster homes.
- Make contact easy through WhatsApp, email, and social channels.

## Audience

1. **Primary: potential adopters and foster homes in Chile**  
   They want to understand what a galgo needs, how adoption works, and whether a specific dog could fit their life.

2. **Secondary: potential donors**  
   They want to know where money goes, what impact it has, and how to give.

3. **Tertiary: volunteers, supporters, and the curious**  
   They want to understand the organization and share its work.

## Primary goals

1. Turn visitors into qualified WhatsApp conversations or form submissions.
2. Make adoption feel possible, supported, and low-risk.
3. Make donations feel concrete and trustworthy.
4. Keep the organization voice consistent across every page.
5. Stay fast, accessible, and easy to maintain without a dedicated engineering team.

## Key flows

| Flow               | Entry                                          | Action                                               | Success signal                                      |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| Adopt a galgo      | Home, `/adoptar`, dog profile                  | WhatsApp message or form submission                  | Visitor starts a conversation with Brigada          |
| Offer foster home  | `/hogar-temporal`, Home                        | WhatsApp message                                     | Visitor asks about foster requirements              |
| Donate             | `/donar`, Home                                 | Copy bank details, click eSponsor, or start transfer | Visitor reaches a donation channel                  |
| Learn about galgos | `/por-que-galgos`, FAQs                        | Read, then move to adopt or contact                  | Visitor understands whether a galgo fits their life |
| Read a story       | Home success stories, `/casos/exito-home.json` | Scroll, open gallery, share                          | Visitor connects emotionally with the cause         |

## Success metrics

- **Performance:** Lighthouse 100 maintained on checked pages.
- **Accessibility:** No axe-core violations in Playwright tests.
- **Content hygiene:** All source tests pass (`source-hygiene.test.ts`).
- **Build health:** `format:check`, `lint`, `build`, and `npm test` stay green.
- **Engagement:** Conversations via WhatsApp and form submissions are tracked through GTM events.

## Brand constraints

- Voice is warm, direct, and in Chilean Spanish (neutral tuteo).
- First-person plural when the foundation speaks: “rescatamos”, “estamos contigo”.
- No em dashes, no generic NGO clichés, no invented facts.
- Every adoption mention must include post-adoption support.
- See `docs/voice-and-tone.md` for the full copy guide.

## What is in scope

- Static pages: home, adopt, why galgos, foster, donate, FAQ, collaborators, contact, cookies, 404.
- Content-driven pages: dog profiles, success stories, blog posts, collaborator listings.
- RSS feed and sitemap.
- Cookie consent and privacy-first analytics.
- Responsive images and dark/light theme.

## What is out of scope

- Server-side functionality (login, dashboards, dynamic APIs).
- E-commerce or payment processing directly on the site.
- Markdown-alternate blog routes unless the product requirement changes.
- Third-party CDNs for dog images.

## Related documents

- `docs/voice-and-tone.md` — copy and brand voice rules
- `docs/prd.md` — functional requirements
- `docs/spec.md` — technical specification
- `docs/feature-inventory.md` — current pages and features
- `docs/content-model.md` — content schemas and editorial rules
- `docs/architecture-map.md` — component and content flow
- `AGENTS.md` — operational guidance for AI agents
- `README.md` — human-facing project overview

## Last updated

2026-07-05
