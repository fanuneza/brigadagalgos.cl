# T06 — Foster and contact journeys

**Wave 3** · branch `wave/3-journeys` · runs in parallel with [T05](05-homepage-hierarchy.md)

## Outcome

`/hogar-temporal/` explains the foster process **once**, is clear about what the foundation
provides and what the foster home provides, and offers one obvious application path.
`/contacto/` routes intent faster without becoming a bigger form.

## Problem being fixed

Audit finding 4, verified in the repo.

`src/pages/hogar-temporal.astro` defines a four-step `fosterSteps` array and renders
`ProcessStepper` with heading "Así funciona la acogida". Immediately after, `FosterPostular.astro`
renders **its own three-step ordered list** ("Completa el formulario" / "Cambia la espera del
galgo" / "Coordinamos durante la acogida") before the application card. Two process explanations
back to back, and the second one is not really a process — steps 2 and 3 are rationale and
support, mislabeled as steps.

`FosterPostular.astro` also hardcodes the Google Form URL three times. **[T02](02-navigation-and-links.md)
already moved it to `SITE.fosterForm` in wave 1** — consume that; do not re-introduce the literal.

`/contacto/` is fine but undirected: `ContactChannels`, then `ContactForm`, then a press/alliances
paragraph, with nothing helping a visitor pick the right channel for their intent.

## Owned files

Exclusive.

- `src/pages/hogar-temporal.astro`
- `src/components/sections/FosterRequirements.astro`
- `src/components/sections/FosterPostular.astro`
- `src/styles/components/hogar-temporal.css`
- `src/components/sections/ProcessStepper.astro` + `src/styles/components/stepper.css`
- `src/components/RequirementCard.astro` + `src/styles/components/requirement-card.css`
- `src/pages/contacto.astro`
- `src/components/sections/ContactChannels.astro` + `src/styles/components/contact-channels.css`
- `src/components/sections/ContactForm.astro` + `src/styles/components/contact-route.css`
- `src/styles/components/form.css`
- `src/scripts/form.ts` — only if a markup change requires it

`ProcessStepper` is also used by the homepage. You own the component; [T05](05-homepage-hierarchy.md)
runs in parallel and may only add/remove its usage in `index.astro` or change the `steps` data it
passes. **Any prop you add must be optional and default to today's rendering.**

## Read-only files

`src/config/site.ts` (consume `SITE.fosterForm`, do not edit — T02 owns it),
`src/pages/index.astro` (T05 owns it this wave), `src/config/faq.ts`,
`src/pages/preguntas-frecuentes.astro`, `DESIGN.md`, `docs/voice-and-tone.md`.

## Scope — `/hogar-temporal/`

1. **One process, once.** Keep the `ProcessStepper` with `fosterSteps` as the single process
   explanation. Remove the three-step ordered list from `FosterPostular.astro`. Its content is not
   wasted — fold it into the right places:
   - "Completa el formulario" → merge into the application card's own explanation.
   - "Cambia la espera del galgo" → this is motivation; move it near the requirements or into the
     stepper's supporting copy.
   - "Coordinamos durante la acogida" → this is **foundation support** and belongs in the new
     support section below.

2. **Use the freed space for the missing information.** The audit asks for requirements,
   foundation support, expected responsibilities, and one clear application action. Make the split
   explicit and scannable — "lo que aporta la fundación" vs "lo que aportas tú". Build this from
   the copy already on the page (`FosterRequirements`, the removed steps, the hero lead) and from
   `docs/site-brief.md` / `docs/voice-and-tone.md`. **Do not invent commitments** the foundation
   has not stated: no promised response times, no promised coverage of costs that the site does
   not already claim, no promised contact frequency. `FosterPostular` currently says support is
   coordinated by WhatsApp "sin prometer una frecuencia fija" — keep that honesty.

3. **One application action.** `FosterPostular`'s CTA card keeps the primary form link (now via
   `SITE.fosterForm`), the WhatsApp text-link fallback, and the FAQ aside. Verify the
   `PageHero` CTA (`ctaHref="#form"`, `ctaTrackLocation="foster_hero"`) still lands on the right
   anchor after restructuring — the `id="form"` must survive.

4. Preserve every analytics event: `foster_apply_click` at `foster_cta`, the WhatsApp fallback at
   `foster_cta`, and the hero CTA at `foster_hero`. Keep `data-application-form-url` — check
   whether anything reads it before assuming it is decorative.

## Scope — `/contacto/`

5. **Route intent, don't build a bigger form.** Make the channel choice do the routing:
   give `ContactChannels` clear intent labels (adoptar / hogar temporal / donar / prensa y
   alianzas / duda general) with the appropriate destination per intent — the adoption and foster
   forms, WhatsApp, email, or the form below. The press/alliances paragraph currently stranded at
   the bottom of `contacto.astro` becomes one of these routes.

6. **Keep `ContactForm` simple.** It is a static Web3Forms POST. Do not add fields, do not add
   conditional logic, do not add server functionality, do not add an Astro adapter. If a subject
   or intent field already exists, you may pre-fill it via a link fragment — only if that works
   without JavaScript. Otherwise leave the form alone.

7. Preserve the Web3Forms integration exactly: endpoint, `PUBLIC_WEB3FORMS_KEY` via `astro:env`,
   honeypot, and the success/error handling in `src/scripts/form.ts`.

## Constraints

- Everything in `README.md` §5 applies.
- **No invented facts** about what the foundation provides. Reorganize existing claims only.
- No new client JavaScript. No server functionality, no adapter, no form backend change.
- `ProcessStepper` prop changes must be optional and backwards compatible (homepage is live in
  parallel this wave).
- Do not edit `src/config/site.ts`; consume `SITE.fosterForm`.
- One `h1` per page. Section headings `h2`, sub-items `h3`. No heading skips.
- Copy follows `docs/voice-and-tone.md` — Chilean Spanish, correct accents, UTF-8.

## Acceptance criteria

- `/hogar-temporal/` contains exactly one step-by-step process explanation.
- The page clearly separates requirements, what the foundation provides, and what the foster home
  provides.
- One primary application action; `#form` anchor still works from the hero CTA.
- `grep -rn "forms.gle" src/components/` returns nothing.
- `/contacto/` presents distinct intents, each with a single obvious destination; the press
  paragraph is integrated rather than stranded.
- `ContactForm` field set and Web3Forms wiring unchanged.
- All foster and contact analytics events preserved or, if a CTA was removed, cleanly removed and
  reported.
- Both pages fully functional with JavaScript disabled.

## Verification

```bash
npx prettier --check src/pages/hogar-temporal.astro src/pages/contacto.astro src/components/sections/FosterRequirements.astro src/components/sections/FosterPostular.astro src/components/sections/ProcessStepper.astro src/components/sections/ContactChannels.astro src/components/sections/ContactForm.astro src/components/RequirementCard.astro
npx eslint src/pages/hogar-temporal.astro src/pages/contacto.astro src/components/sections/FosterRequirements.astro src/components/sections/FosterPostular.astro src/components/sections/ProcessStepper.astro src/components/sections/ContactChannels.astro src/components/sections/ContactForm.astro src/components/RequirementCard.astro
npx stylelint src/styles/components/hogar-temporal.css src/styles/components/stepper.css src/styles/components/requirement-card.css src/styles/components/contact-channels.css src/styles/components/contact-route.css src/styles/components/form.css
npm run test:text
grep -rn "forms.gle" src/components/
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.

## Commit

```
feat(foster): remove the duplicated foster process and clarify support and contact intent
```

## Report to orchestrator

Where each removed step's content landed; any `ProcessStepper` prop you added (T05 must be told);
the contact intent map you settled on; analytics events affected.
