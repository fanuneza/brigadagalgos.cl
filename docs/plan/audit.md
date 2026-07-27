# Brigada Galgos presentation audit and implementation direction

## Overall verdict

Brigada Galgos already has the correct foundations: real photography, clear actions, structured information about each dog, first-class light and dark modes, accessible semantic patterns, local image optimization, and a coherent brand palette. The problem is not lack of design effort. The problem is excessive visible design effort.

Too many elements announce themselves as designed objects:

- Layered gradients
- Blurred color glows
- Floating pills
- Strong rounded corners
- Multiple simultaneous accent colors
- Universal card borders and shadows
- Hover elevation on nearly every container
- Condensed uppercase typography across too many roles
- Repeated centered page heroes
- Repeated rainbow dividers
- Multiple button-shaped actions competing within the same component

The result looks assembled from individually polished components rather than directed as one coherent editorial website. The implementation repeatedly uses the same vocabulary of gradients, rounded cards, pills, chips, shadows, and bright color accents. That consistency is technically sound, but visually it produces a recognizable “component library” appearance rather than a mature institutional identity.

The decisive recommendation is:

> **Move from colorful component polish to restrained photographic editorial design.**

Keep the current color palette and type families. Reduce their frequency and clarify their roles. Photography, proportion, typography, whitespace, and alignment should carry the presentation. Decorative CSS should become exceptional rather than routine.

The current site brief prioritizes qualified adoption and foster conversations, concrete donation trust, accessibility, and speed. The visual system should make those goals feel inevitable rather than promotional.

---

# Part 1: Executive diagnosis

## 1. Critical: Decorative effects are substituting for hierarchy

The global body uses multiple overlapping radial and linear gradients. The homepage hero adds two more gradients, a multicolor blurred glow beneath the image, a large shadow, asymmetric rounding, a floating pill badge, entrance motion, and a hover rotation. Story sections, donation cards, statistic cards, CTA cards, and the footer introduce additional gradients, glows, borders, shadows, and decorative color lines.

None of these effects is individually severe. Their accumulation is the primary reason the site feels less professional than it should.

### Intended correction

Use mostly flat page backgrounds and surfaces.

Allow only three depth levels:

1. Page background
2. Quiet alternate section surface
3. Overlay or modal surface

Remove decorative glows, routine gradients, universal elevation, and photographic rotation. Keep one restrained brand-color signature, such as the existing rainbow divider reduced to a thin rule or used once near the footer.

---

## 2. Critical: Typography has insufficient role differentiation

All `h1`, `h2`, and `h3` elements inherit the condensed display family, uppercase transformation, tight line height, and black weight. Card names, statistics, form success messages, footer branding, navigation-adjacent labels, and section headings often repeat the same condensed uppercase voice.

This makes the hierarchy loud but flat. The visitor sees many things presented with similar typographic urgency. It also pushes the brand toward poster graphics and away from calm, credible rescue work.

### Intended correction

Retain Barlow and Barlow Condensed.

Use Barlow Condensed selectively:

- Page titles
- Major section titles
- Dog names
- Large confirmed statistics

Use regular Barlow for:

- Subsection headings
- Card headings
- Navigation
- Form headings
- Labels
- Supporting information
- Longer headings that need a humane reading rhythm

Remove the global uppercase rule. Uppercase should remain only for eyebrows, compact metadata, and short display labels.

---

## 3. High-value: The interface exposes its component system

The homepage contains a long sequence of featured cards, mission content, four statistic cards, educational content, success cards, a process stepper, three help cards, and a donation banner. The underlying route composition confirms that most sections are independent components with their own visual frame.

The same framing strategy appears across dog cards, story cards, donation cards, channel cards, requirement cards, supporter cards, and statistic cards. Global CSS then assigns the same hover lift and shadow behavior to all these families.

Visitors should perceive dogs, stories, requirements, and donation information as different kinds of content. They currently perceive many of them as variants of the same card component.

### Intended correction

Use different composition patterns based on content purpose:

- Dogs: photographic profiles
- Success stories: editorial stories
- Requirements: structured guidance
- Statistics: evidence strip
- Donation details: financial information panel
- Contact methods: direct channel list
- Process steps: chronological sequence

Shared typography, spacing, borders, and actions should unify them. A shared card silhouette should not.

---

## 4. Critical: Color has too many simultaneous responsibilities

The palette includes cyan, magenta, orange, green, and purple. The design documentation already states that green and purple should be reserved for accents and that the rainbow set should not become broad body color. In practice, the full palette appears through icon circles, chips, statistics, dividers, CTA treatments, glows, and component accents.

Dog cards are the clearest example. Sex, age, weight, and current need receive separate colored chips, causing practical compatibility facts to read like product attributes or promotional tags.

### Intended correction

Assign one stable role to each brand color:

| Color               | Recommended role                                                   |
| ------------------- | ------------------------------------------------------------------ |
| Cyan                | Links, focus, selected controls, navigational emphasis             |
| Magenta             | Brand identity, occasional editorial emphasis                      |
| Orange              | Primary conversion action only                                     |
| Green               | Confirmed positive or completed state                              |
| Purple              | Rare illustrative or historic-story accent                         |
| Rainbow combination | One restrained brand signature, not a repeated component treatment |

Neutral backgrounds, borders, and typography should dominate every screen.

---

## 5. Critical: Action hierarchy is diluted

Dog listing cards currently contain:

- A linked dog name
- A primary “Postular” button
- A secondary “Más información” WhatsApp button
- A ghost “Ver ficha” button
- An optional Instagram link
- Gallery controls

The profile repeats primary application, WhatsApp, sharing, Instagram, gallery controls, and support information.

These are valid actions, but their visual presentation makes the interface behave like a transactional catalogue. It creates premature pressure before the visitor has assessed the dog.

### Intended correction

On listings:

1. Make “Ver ficha” the dominant card action.
2. Present “Postular” as a secondary compact action.
3. Present WhatsApp as an inline assistance link.
4. Keep Instagram tertiary.
5. Reduce gallery control prominence.

On profiles:

1. Keep “Postular por [nombre]” as the single primary action.
2. Keep WhatsApp as secondary.
3. Make sharing and Instagram quiet utility actions.
4. Preserve the reassurance about post-adoption support.

This changes visual priority, not the underlying routes, tracking, or conversion paths.

---

## 6. High-value: Photography is contained rather than art-directed

Dog and story galleries currently use a square viewport. The gallery controls, dots, borders, card rounding, and surrounding content compete with the photographs.

The homepage hero gives photography more space, but its image treatment relies on large rounded corners, shadow, blurred color, floating badge, movement, and rotation.

Real dog photography should be the strongest emotional asset on the site. It should not need decorative enhancement.

### Intended correction

Establish clear photographic families:

- Adoption listing: 4:5 portrait
- Dog profile primary gallery: 4:5 mobile, 3:4 or controlled portrait desktop
- Homepage hero: 4:5 mobile, 5:4 or 3:2 desktop depending on source crop
- Success stories: 4:5 or 3:4
- Editorial supporting images: 3:2
- Logos and supporters: intrinsic ratio, constrained by a neutral stage

Use consistent crops and `object-position` rules. Remove photographic rotation, decorative glow, and routine image shadow.

---

## 7. High-value: Desktop layouts feel expanded rather than composed

Most responsive changes consist of increasing column counts:

- Dog grid: one, two, then three columns

- Stories: one, two, then three columns

- Statistics: one column to four

- Donation amounts: one, two, then four

This is responsive, but it is not strong desktop art direction.

### Intended correction

Use desktop width to introduce relationships:

- Text aligned against photography
- Evidence aligned against explanation
- Primary and supporting content with unequal column widths
- Sticky profile information where useful
- Wider editorial margins
- Intentional negative space
- Occasional offset alignment
- Fewer but larger content units

Avoid asymmetry that feels decorative. Use it only to express hierarchy.

---

## 8. High-value: Dark mode amplifies the visual noise

The color tokens correctly support light and dark modes using `light-dark()` and explicit theme attributes. This is a strong technical foundation.

The issue is perceptual. Bright cyan, pink, orange, colored glows, translucent tinted surfaces, gradients, and shadows become more luminous against the dark background. Dark mode therefore risks feeling more decorative than light mode.

### Intended correction

Dark mode should use:

- Flatter surfaces
- Fewer tinted fills
- More neutral borders
- Slightly reduced accent saturation for noninteractive decoration
- No decorative glows
- No image dimming
- No automatic shadow escalation
- Clearer distinction between text, muted text, border, surface, and selected state

---

# Part 2: Design-system direction

## Design concept

### Editorial restraint with photographic primacy

The site should feel like a carefully maintained rescue journal and practical adoption service, not a campaign landing page or pet catalogue.

The visual system should communicate:

- Real work
- Real dogs
- Practical guidance
- Operational maturity
- Human care
- Transparency
- Continued support

The voice guide states that facts carry the emotion and each dog must be treated as an individual rather than a category. The visual system should follow the same rule.

---

## Typography

### Keep

- Barlow
- Barlow Condensed
- Local `@fontsource` delivery
- Metrics-matched fallback strategy
- Existing performance-sensitive loading

### Change

Remove:

```css
h1,
h2,
h3 {
  text-transform: uppercase;
  font-weight: var(--weight-black);
}
```

Replace with explicit semantic roles.

### Recommended type tokens

```css
--type-display-xl: clamp(2.75rem, 6vw, 4rem);
--type-display-lg: clamp(2rem, 4vw, 2.75rem);
--type-display-md: clamp(1.625rem, 3vw, 2rem);
--type-heading-sm: 1.375rem;
--type-lead: clamp(1.125rem, 1.4vw, 1.25rem);
--type-body: 1rem;
--type-body-lg: 1.0625rem;
--type-small: 0.875rem;
--type-meta: 0.75rem;
```

### Recommended roles

| Role             | Family           |     Weight | Case                                         |  Line height |
| ---------------- | ---------------- | ---------: | -------------------------------------------- | -----------: |
| Page title       | Barlow Condensed | 700 or 900 | Sentence case                                | 0.98 to 1.04 |
| Section title    | Barlow Condensed |        700 | Sentence case                                |         1.05 |
| Dog name         | Barlow Condensed |        700 | Sentence case or natural name capitalization |            1 |
| Subsection title | Barlow           | 600 or 700 | Sentence case                                |          1.2 |
| Card heading     | Barlow           |        600 | Sentence case                                |         1.25 |
| Body             | Barlow           |        400 | Natural                                      | 1.55 to 1.65 |
| Lead             | Barlow           |        400 | Natural                                      | 1.45 to 1.55 |
| Eyebrow          | Barlow           |        600 | Uppercase                                    |          1.2 |
| Metadata         | Barlow           | 500 or 600 | Natural                                      |         1.35 |

### Additional rules

- Limit prose to 62 to 68 characters per line.
- Limit page-hero leads to approximately 54 to 60 characters per line.
- Use `text-wrap: balance` only for short display headings.
- Use `text-wrap: pretty` for body and lead copy.
- Avoid black weight for every heading.
- Keep letter spacing neutral on display titles.
- Use tracking only for eyebrows and compact metadata.

---

## Layout system

### Containers

Retain the current 1200px maximum unless visual testing proves it too narrow.

Add clearer semantic containers:

```css
--content-wide: 1200px;
--content-reading: 680px;
--content-compact: 560px;
--content-form: 640px;
```

### Gutters

```css
--gutter-mobile: 20px;
--gutter-tablet: 32px;
--gutter-desktop: 48px;
```

The existing 24px mobile gutter is defensible, but 20px gives narrow devices more usable width while maintaining breathing room.

### Section rhythm

```css
--section-space-compact: clamp(3rem, 6vw, 4.5rem);
--section-space-standard: clamp(4rem, 8vw, 6rem);
--section-space-generous: clamp(5rem, 10vw, 8rem);
```

Apply spacing by relationship:

- Compact between directly related sections
- Standard for most sections
- Generous before major changes of topic

Do not apply one universal section padding to every section.

### Grid

Use CSS Grid without introducing a utility framework.

Conceptual columns:

- Mobile: 4
- Tablet: 6
- Desktop: 12

Components do not need a formal grid API. They need consistent alignment with common column relationships such as:

- 5 + 7
- 4 + 8
- 7 + 5
- 8 + 4

---

## Color application

### Brand role policy

```css
--color-action: var(--color-accent-warm);
--color-link: var(--color-primary-700);
--color-selection: var(--color-primary-100);
--color-brand-emphasis: var(--color-secondary);
```

### Rules

- Orange appears only on the page’s primary action.
- Cyan is used for links, focus, selected controls, and occasional rules.
- Magenta appears in branding and rare editorial emphasis.
- Green appears only for positive or completed states.
- Purple should not identify ordinary interface elements.
- Never place cyan, magenta, orange, green, and purple together inside one information component.
- Replace most tinted component backgrounds with neutral surfaces.
- Replace multicolor decorative gradients with flat colors or one subtle tint.

---

## Radius policy

Replace the current broad use of 20px, 28px, and fully rounded controls.

```css
--radius-control: 8px;
--radius-card: 10px;
--radius-media: 12px;
--radius-panel: 16px;
--radius-pill: 999px;
```

Use `--radius-pill` only for:

- Compact statuses
- Counts
- True filter chips when the chip pattern remains
- Small badges

Do not use full pills for:

- Primary buttons
- Navigation links
- Brand links
- Theme toggle containers
- Ordinary cards

---

## Shadow policy

### Default

No shadow.

### Allowed

- Sticky navigation after scrolling: very subtle
- Mobile drawer
- Cookie banner if needed for separation
- Lightbox
- Temporary toast
- Focus ring

### Disallowed

- Routine dog cards
- Story cards
- Statistic cards
- Donation amount cards
- CTA cards
- Hover elevation
- Decorative photographic shadows

Prefer border and surface contrast.

---

## Button hierarchy

### Primary

- Flat orange background
- Dark text
- 48px minimum height
- 8px radius
- No gradient
- No default shadow
- Slight background change on hover
- No translate animation

### Secondary

- Transparent or neutral surface
- 1px cyan or strong neutral border
- Cyan or primary text
- Same dimensions as primary

### Tertiary

- Text link with visible underline
- Minimum 44px interaction area when used as an isolated control

### Destructive or state actions

Use semantic colors only where genuinely needed.

### Width rules

- Full width on narrow mobile when the action is primary to the current section.
- Intrinsic width on tablet and desktop.
- Avoid stacking three full-width buttons inside a card.

---

## Links

- Body links remain underlined.
- Navigation links use an underline, bottom rule, or restrained text-color state.
- External indicators remain centralized through existing shared link primitives.
- Social links should not visually compete with primary conversion actions.
- Do not remove analytics or new-tab behavior from `TrackedLink`, `ExternalLink`, `WhatsAppLink`, and `InstagramLink`.

---

## Forms

- Flat background
- 1px border at rest
- 2px or focus ring only when focused
- 8px radius
- 48px minimum control height
- 16px minimum input font size
- Labels above fields
- Helper and error text directly below the related field
- Error state must include text and icon or border treatment, not color alone
- Disabled, submitting, success, and server/network error states must be visually defined
- Dark-mode select arrow must use `currentColor` or a theme-aware asset rather than a fixed light-theme SVG color

The current form uses a fixed encoded arrow color and a 2px resting border, both of which should be refined.

---

## Surface hierarchy

### Light mode

1. Page: white or near-white
2. Alternate section: restrained cool neutral
3. Nested information: slightly darker neutral
4. Border: visible but quiet

### Dark mode

1. Page: near-black blue-charcoal
2. Alternate section: slightly raised neutral
3. Nested information: another controlled neutral step
4. Border: visible without glowing
5. Accent fills: rare and low-area

Avoid translucent surfaces over gradients. They make both theme tuning and visual hierarchy harder.

---

## Motion

Remove:

- Image rotation
- Universal card lift
- Decorative entrance animation
- Scale animation on badges
- Long background transitions

Retain:

- Drawer transition
- Lightbox transitions where present
- Disclosure transitions
- Toast appearance
- Small color transitions on controls

Rules:

```css
--duration-fast: 120ms;
--duration-standard: 180ms;
--duration-overlay: 240ms;
```

Translate no more than 4 to 6px where movement is required.

Respect `prefers-reduced-motion` everywhere.

---

## Photography

### Listing cards

- 4:5
- Full-bleed within the card or edge-aligned editorial frame
- No shadow
- 10 to 12px radius only where the image is not flush with its container
- Preserve focal point
- Avoid square crops

### Profile

- Main gallery visually dominant
- 4:5 mobile
- Portrait-friendly desktop crop
- Neutral gallery controls
- Image count visible
- Captions only where sourced
- No decorative tint over the dog

### Success stories

- 4:5 or 3:4
- Consistent crop family
- Lower interface-control prominence than active adoption cards
- Story text visually connected to image

### Gallery controls

- 44px targets
- Controls inside image edge but visually quiet
- Arrows hidden when only one image
- Dots replaced with a compact “1 / 3” indicator when this reduces visual noise
- Keyboard and swipe behavior preserved
- Lightbox remains progressively enhanced

---

# Part 3: Route-by-route critique

## Homepage `/`

### Priority

Critical.

### Affected implementation

- `src/pages/index.astro`
- `src/components/Hero.astro`
- `src/styles/components/hero.css`
- `FeaturedAdoptionDogs`
- `MissionSection`
- `TrustStatsSection`
- `WhyGalgosSection`
- `StoriesSection`
- `ProcessStepper`
- `HelpCards`
- `DonationBanner`
- `RainbowDivider`

The homepage currently renders these sections sequentially through independent section components.

### Weakness

The page begins with a visually overloaded hero and continues through multiple equally discrete sections. The repeated card and band vocabulary makes the page feel longer and more fragmented than its actual content warrants.

### Recommended change

#### Hero

- Remove `hero::before` layered gradients.
- Remove the blurred multicolor `hero__photo::after`.
- Remove image hover rotation and vertical lift.
- Remove the paw emoji.
- Convert the floating badge into either:
  - A simple image caption aligned beneath the image, or
  - A compact neutral status label inside the text column

- Keep the split composition.
- Increase photograph prominence.
- Reduce image radius to 12px.
- Use one flat page background.
- Keep adoption as the primary action.
- Present foster as secondary.
- Keep the support sentence visually attached to the actions.

#### Featured dogs

- Retain the three-dog preview.
- Use larger 4:5 images.
- Remove four-color fact chips.
- Make the profile action dominant.
- Use a quieter text block with two lines of practical information.
- Align all dog names and facts consistently.
- Remove hover elevation.

#### Mission

- Left-align the section.
- Use a wider editorial split on desktop:
  - Heading in four columns
  - Prose in seven columns

- Remove the “values as tags” presentation.
- Present the values as one typographic line or compact list separated by neutral rules.

#### Trust statistics

- Replace four statistic cards with one evidence strip.
- Use vertical separators on desktop.
- Use stacked rows with horizontal separators on mobile.
- Keep the numbers large.
- Remove individual card backgrounds, radii, shadows, and separate accent colors.
- Use one accent color for all values or one neutral value color with a single brand highlight.

#### Why galgos

- Let photography or a strong editorial text composition distinguish this section.
- Avoid another grid of rounded explanatory units.
- Use concise subsections separated by rules.

#### Success stories

- Use a two-column editorial layout on desktop rather than three equal product cards.
- Keep active adoption visually more prominent than completed stories.
- Remove section glow and gradient.
- Use a neutral alternate section background.

#### Process

- Present the steps as a restrained numbered sequence.
- Use a continuous rule or simple timeline.
- Avoid five colored icon circles.
- Keep each step’s text visible without interaction.

#### Help options

- Differentiate adoption, foster, and donation through heading and action hierarchy, not three differently colored cards.
- Use one shared neutral surface or a border-separated horizontal layout.

#### Donation band

- Keep one decisive action.
- Use a flat dark or neutral band, not a gradient card within a gradient section.

### Mobile behavior

- Hero order: title, lead, image, actions, support.
- Full-width primary action.
- Secondary action may remain full width but must be visually lighter.
- Dog preview remains one column.
- Statistics become rows.
- Process becomes a vertical numbered sequence.
- Avoid horizontally scrolling core content.

### Dark mode

- Flat dark background.
- Neutral image frame.
- No colored glow.
- Primary orange action remains strong.
- Secondary controls use cyan primarily through border and text.
- Alternate sections use neutral surface changes.

### Acceptance criteria

- The initial viewport contains no decorative blur or multicolor background gradient.
- Only one action reads as primary.
- Hero photography is visually stronger than its container treatment.
- No routine homepage card moves vertically on hover.
- At least three major homepage sections use compositions other than equal rounded-card grids.
- Every breakpoint from 320px to wide desktop maintains a clear visual rhythm.
- Light and dark modes feel equally intentional.

---

## Adoption listing `/adoptar/`

### Priority

Critical.

### Affected implementation

- `src/pages/adoptar.astro`
- `AdoptionIntro`
- `AdoptionGrid.astro`
- `.filter-chips`
- `.dog-grid`
- `.dog-card`
- `.dog-chip`
- `.dog-card__actions`
- `.dog-card__profile-link`
- Shared gallery styles

The current card exposes a gallery, four colored facts, two descriptive paragraphs, social link, two major buttons, and a profile button.

### Weakness

The cards are visually dense and transactional. They ask visitors to choose between applying, messaging, opening the profile, browsing photos, and opening Instagram before a clear suitability hierarchy has been established.

The filters declare `min-height: 24px`, below the intended 44px interaction-target standard.

### Recommended change

#### Filters

- Keep the current filtering categories and JavaScript behavior.
- Increase minimum target to 44px.
- Use an 8px radius rather than a full pill.
- Use a 1px border at rest.
- Active state:
  - Light cyan surface
  - Strong text
  - Optional checkmark

- Add a clear “Filtros” label on narrow mobile if needed for context.
- Keep visible result count close to filters.

#### Grid

- One column under approximately 680px.
- Two columns from tablet through common laptop widths.
- Three columns only when each card remains at least approximately 340px wide.
- Do not force three narrow cards into a 1024px viewport.
- Use `repeat(auto-fit, minmax(min(100%, 340px), 1fr))` only if it produces stable, testable wrapping.

#### Card photography

- Replace square viewport with 4:5.
- Keep gallery support.
- Reduce arrow and pagination prominence.
- Show an image count.
- Avoid displaying permanent large arrow buttons over every image.

#### Facts

Replace four differently colored chips with:

- One neutral fact row for sex, age, and weight
- One distinct current-need status
- Neutral separators or a definition list

`currentNeed` may use a restrained magenta or orange-tinted status only when its meaning justifies emphasis. Do not use four brand colors.

#### Actions

Recommended hierarchy:

1. “Ver ficha de [nombre]” as primary card action
2. “Postular” as secondary
3. “Preguntar por WhatsApp” as text link or compact tertiary action
4. Instagram as metadata-level utility

Preserve all existing tracking labels and destinations.

#### Card surface

- Border only
- 10px radius
- No default shadow
- No hover lift
- Optional border-color change on linked hover
- Name and image should both clearly lead to the profile

### Mobile behavior

- Image first.
- Dog name and current need directly below.
- Facts on one or two compact rows.
- Description limited through layout, not inaccessible truncation.
- Primary profile action full width.
- Secondary actions remain visually distinct.
- Gallery controls maintain 44px targets without covering the dog’s face.

### Dark mode

- Neutral card surface.
- One status tint maximum.
- No luminous chip row.
- Borders remain visible.
- Gallery controls use a fixed dark translucent neutral surface.

### Accessibility and integrity

- Preserve full dog names and source content.
- Do not infer compatibility or medical information.
- Keep cards as `article`.
- Maintain filter `aria-pressed`.
- Ensure hidden cards are not announced or focusable.
- Keep result count announcement concise.
- Validate target size and focus indicators.
- Preserve `content-visibility` only if keyboard navigation and intrinsic sizing remain correct.

### Acceptance criteria

- Filter targets are at least 44px.
- No card displays more than one saturated status treatment.
- Profile action is unmistakably dominant.
- Cards no longer resemble e-commerce product tiles.
- Gallery functionality remains usable without becoming the card’s strongest interface element.
- All active dogs, status logic, tracking, and generated URLs remain unchanged.

---

## Dog profile `/adoptar/[slug]/`

### Priority

Critical.

### Affected implementation

- `src/pages/adoptar/[slug].astro`
- `src/styles/components/dog-profile.css`
- Shared gallery and lightbox
- Dog chips
- Adoption process
- Share script

The current desktop layout uses a roughly 45/55 gallery-to-information split and repeats the same four chips and three main controls used in the cards.

### Weakness

The profile contains the right information but does not yet feel like a considered individual portrait. It appears like an enlarged catalogue card.

### Recommended change

- Increase photographic dominance.
- Use a 7/5 or 6.5/5.5 desktop split favoring the gallery where source images support it.
- Keep the information column sticky within its section on sufficiently tall desktop viewports.
- Use the dog’s name as the strongest typographic element.
- Present sex, age, and weight in a structured neutral fact list.
- Present current need separately.
- Give `characterSketch` stronger prominence than generic details.
- Keep support reassurance directly beneath the actions.
- Make application the only filled action.
- Make WhatsApp outlined.
- Make share and Instagram text utilities.
- Remove the rainbow divider after the profile or reduce it to a quiet rule.
- Present the repeated adoption process as a compact follow-on section rather than another major visual destination.

### Mobile behavior

- Back link
- Name and current need
- Main gallery
- Essential facts
- Character sketch
- Details
- Primary and secondary actions
- Support reassurance
- Utility actions

Do not use a fixed bottom bar unless it can be implemented without obscuring content, interfering with the cookie banner, or creating cumulative layout shift.

### Accessibility

- Preserve one `h1`.
- Keep lightbox keyboard handling.
- Ensure sticky behavior does not trap or reorder focus.
- Share success/failure remains announced through `aria-live`.
- Do not hide practical facts behind tabs or JavaScript.

### Acceptance criteria

- The page reads as an individual profile, not a larger listing card.
- The dog photograph and character sketch establish identity before the action stack.
- Only application is filled.
- Practical facts are scannable within five seconds.
- Gallery, sharing, tracking, and post-adoption support remain intact.

---

## Foster page `/hogar-temporal/`

### Priority

High-value.

### Affected implementation

- `src/pages/hogar-temporal.astro`
- `FosterRequirements.astro`
- `RequirementCard.astro`
- `hogar-temporal.css`
- `requirement-card.css`
- `ProcessStepper`
- `FosterPostular`

The current requirements section uses three icon cards followed by several notes and two additional support boxes.

### Weakness

The page’s practical information is valid, but repeated boxes turn guidance into a dense checklist of components. The visual framing risks making foster care appear bureaucratic.

### Recommended change

- Left-align the page hero.
- Make its primary CTA visually dominant.
- Convert the three requirement cards into a structured three-part guidance row:
  - Safety
  - Time
  - Coexistence and supplies

- Use simple line icons without colored circles.
- Remove individual card shadows and saturated tones.
- Present the safety notes in one clearly labeled advisory block.
- Keep “Brigada cubre” and “Tú aportas” as a strong two-column comparison.
- Use neutral background differentiation and a central divider rather than two large rounded cards.
- Render the process as a vertical mobile sequence and horizontal desktop sequence.
- End with one clearly framed application/contact area.

### Mobile behavior

- Single-column requirements with separators.
- Safety warning visually distinct but non-alarmist.
- Comparison becomes two stacked sections with consistent labels.
- Primary CTA full width.
- Avoid icon-heavy layouts.

### Acceptance criteria

- The page feels supportive rather than procedural.
- “Brigada cubre” and “Tú aportas” can be compared immediately.
- Requirement content remains unchanged.
- No requirement is communicated through color alone.
- Foster and adoption actions remain visually distinct.

---

## Donation page `/donar/`

### Priority

Critical.

### Affected implementation

- `src/pages/donar.astro`
- `DonationCards.astro`
- `donation-cards.css`
- `ImpactSection`
- `TrustStatsSection`
- `HelpTailCta`
- Bank-data copy script

The live page contains suggested amounts, transfer information, recurring support, impact information, transparency content, statistics, and alternative support actions.

Suggested amounts currently appear as four bordered, shadowed cards with a multicolor top rule. The transfer and monthly options are large gradient cards with shadows. Individual bank rows are also rounded surfaces nested inside the transfer card.

### Weakness

The page contains strong trust-building information, but the nested-card presentation makes it resemble a pricing page. It also fragments the donation decision across too many visually prominent units.

### Recommended change

#### Suggested amounts

- Convert to a simple impact ledger.
- Four columns on wide desktop, two on tablet, stacked rows on mobile.
- Use separators, not cards.
- Keep amount visually strong.
- Remove multicolor rules.
- Remove shadows.
- Make clear that amounts describe impact rather than selectable pricing tiers.

#### Donation channels

- Make direct transfer the primary information panel.
- Make recurring eSponsor support the secondary panel.
- Use a 7/5 desktop split.
- Use one neutral panel surface.
- Keep “Recomendado” only if this recommendation remains organizationally accurate.
- Do not style both channels as equal promotional products.

#### Bank information

- Use a semantic description-list presentation where possible.
- Keep each row copyable.
- Display a persistent copy icon or label.
- Do not reveal “Copiar” only on hover.
- Use 44px minimum target.
- Keep “Copiar todos los datos” as the primary utility action within this panel.
- Show visible confirmation close to the control while retaining `aria-live`.

#### Impact and transparency

- Merge their visual language.
- Use documentary headings, plain lists, and confirmed figures.
- Do not repeat the homepage statistic-card design.
- Make transparency the strongest trust section after the payment details.
- Avoid a second marketing-style CTA band immediately after financial information.

### Mobile behavior

- Transfer details first.
- No horizontal bank-data table.
- Labels and values remain distinct.
- Copy controls remain visible.
- Long account values wrap or remain selectable without clipping.
- Suggested amounts become bordered rows.
- Recurring donation option follows direct transfer.

### Dark mode

- Bank details must not appear as six glowing nested tiles.
- Use borders and subtle neutral surface changes.
- Keep orange reserved for the page’s principal action.
- eSponsor logo contrast must be verified.

### Accessibility and trust

- Do not alter confirmed amounts or transparency claims.
- Preserve bank data exactly.
- Maintain keyboard copy functionality.
- Announce copy success and failure.
- Avoid implying selectable packages.
- Preserve outbound tracking and eSponsor destination.

### Acceptance criteria

- Visitors can identify the main donation method and copy all necessary data without visual searching.
- Donation amounts read as evidence of impact, not pricing plans.
- Transfer and recurring options have a clear priority.
- Copy interactions work with mouse, touch, and keyboard.
- Financial details, tracking, and transparency content remain exact.

---

## Success stories `/casos-de-exito/`

### Priority

High-value.

### Affected implementation

- `src/pages/casos-de-exito.astro`
- `StoryCard.astro`
- `stories.css`
- Shared gallery
- Shared lightbox

The current archive uses a one, two, then three-column card grid, with square galleries, shadows, hover lift, uppercase names, and clamped story text.

### Weakness

The archive treats completed adoption stories like a gallery of interchangeable cards. The visual language is nearly identical to active-dog cards, weakening the distinction between “needs a home” and “found a home.”

### Recommended change

- Use two columns at desktop rather than three.
- Increase image ratio to 4:5 or 3:4.
- Use a flatter editorial card:
  - Image
  - Name
  - Story
  - Quiet Instagram attribution

- Remove hover lift.
- Remove section gradient and blurred orb.
- Use a neutral alternate background.
- Give adopted status a restrained green text marker or editorial label.
- Avoid large celebratory badges.
- Keep the adoption CTA present but subordinate to active-dog pages.
- Ensure the ending CTA does not repeat the same heavy boxed treatment used elsewhere.

### Mobile behavior

- One column.
- Full story remains readable.
- Gallery controls do not dominate.
- Spacing between stories provides separation without large card shadows.

### Acceptance criteria

- Success stories clearly read as outcomes rather than available listings.
- Active dogs remain more visually urgent than historic stories.
- Story limits and adoption-outcome requirements remain unchanged.
- Lightbox and Instagram behavior remain intact.

---

## Why galgos `/por-que-galgos/`

### Priority

High-value.

### Affected implementation

- `src/pages/por-que-galgos.astro`
- `WhyGalgosEditorial`
- `CasesBand`
- `NextStepCta`
- Shared gallery

### Weakness

The repeated centered `PageHero` makes this editorial route begin like every transactional route. The content should feel more like a clear, authoritative essay.

### Recommended change

- Use a left-aligned editorial intro.
- Limit line length more aggressively.
- Add stronger differentiation between:
  - Daily life with a galgo
  - Compatibility caveats
  - Why the rescue focus exists

- Use rules, spacing, and photography rather than cards.
- Present case stories as supporting evidence, not another catalogue grid.
- Give the final adoption or contact action one dominant visual treatment.
- Preserve every caveat and avoid universal claims.

### Mobile behavior

- Reading width uses the full available guttered width.
- Headings remain compact.
- Any supporting image appears close to the paragraph it supports.
- No essential caveat is moved into a disclosure by default.

### Acceptance criteria

- The page feels authoritative, calm, and readable.
- Long-form sections have visible rhythm without excessive containers.
- Case stories support the argument rather than interrupt it.
- All current content and claims remain unchanged.

---

## Contact `/contacto/`

### Priority

High-value.

### Affected implementation

- `src/pages/contacto.astro`
- `ContactChannels`
- `ContactForm`
- `PressSection`
- `form.css`

The contact form is currently centered inside a narrow container and uses a full-width button, surface-filled inputs, 2px resting borders, and a fixed-color encoded select arrow.

### Weakness

The page likely presents contact methods and the form as separate component sections rather than one coherent communication surface. The form looks functional but generic.

### Recommended change

- Left-align the hero.
- On desktop, create one 4/8 or 5/7 contact composition:
  - Contact channels and response context
  - Form

- On mobile, channels first, then form.
- Present contact channels as direct rows with:
  - Channel
  - Best use
  - Action

- Avoid separate promotional cards for WhatsApp, email, and social platforms.
- Align form heading and fields to the same grid.
- Use 1px resting borders.
- Use neutral input backgrounds.
- Implement theme-aware select indicator.
- Define:
  - Focus
  - Invalid
  - Submitting
  - Success
  - Network failure
  - Disabled

- Keep press information visually separate and lower in priority.

### Accessibility

- Keep native labels.
- Preserve `novalidate` only with complete custom error handling.
- Error messages must connect through `aria-describedby`.
- Focus the first invalid field after failed submission.
- Move focus to success heading after successful submission when appropriate.
- Keep live announcements concise.
- Do not rely on placeholder copy as a label.

### Acceptance criteria

- A visitor can choose the correct channel immediately.
- Form and direct-contact actions feel part of one system.
- All form states work in both themes.
- Keyboard and screen-reader validation behavior is verified.
- Existing submission and analytics behavior remains unchanged.

---

## Foundation and trust presentation

### Priority

High-value.

### Affected implementation

- Homepage `MissionSection`
- `TrustStatsSection`
- Footer identity and legal details
- Potential collaborator/supporter components
- `/colaboradores/`

### Weakness

Trust is currently presented partly through colorful statistic cards and partly through a dense footer. This can feel promotional rather than documentary.

### Recommended change

- Present organizational facts with plain typography and separators.
- Keep RUT visible.
- Keep confirmed foundation history visible.
- Show supporters and collaborators on neutral logo stages without shadows or decorative cards.
- Avoid coloring every statistic differently.
- Use consistent captions explaining what evidence means.
- Do not turn supporter logos into a commercial sponsor wall.

### Acceptance criteria

- Trust comes from legibility, confirmed facts, and consistency.
- Legal and contact information remains easy to locate.
- No metric or testimonial is invented.
- Supporter content remains sourced from the collection.

---

## Header and navigation

### Priority

Critical shared component.

### Affected implementation

- `Navbar.astro`
- `navbar.css`
- `navbar.ts`

The current navbar combines a translucent backdrop-filter surface, pill brand link, pill navigation states, pill theme toggle, pill donation button, and circular hamburger.

### Weakness

Nearly every header element receives its own rounded container. This makes the header feel like a toolbar of controls rather than a composed site masthead.

### Recommended change

- Use an opaque or nearly opaque flat background.
- Remove `backdrop-filter`.
- Use a subtle bottom border.
- Apply shadow only after scroll, and reduce it substantially.
- Remove brand-link pill background.
- Use text or underline active navigation states.
- Use 44px square theme and menu controls with 8px radius.
- Keep the donation CTA filled, but use 8px radius.
- Consider reducing desktop header height slightly if typography allows.
- Keep mobile drawer semantics and focus management unchanged.
- Give the mobile drawer clearer information grouping and less unused decorative space.

### Acceptance criteria

- Only the donation action appears as a filled control in the desktop header.
- Active navigation does not use pill styling.
- Theme and hamburger targets are at least 44px.
- Sticky navigation remains stable with no layout shift.
- Drawer keyboard, `inert`, focus return, escape, and backdrop behavior remain intact.

---

## Footer

### Priority

High-value shared component.

### Affected implementation

- `Footer.astro`
- `footer.css`

The footer currently adds a rainbow top gradient, blurred cyan orb, pill brand link, circular social surfaces, three equal columns, a credit line, legal controls, and another donation button.

### Weakness

It contains credible information but uses decorative and action treatments that make the ending visually busy.

### Recommended change

- Remove blurred orb.
- Replace rainbow top line with either:
  - A 1px neutral rule, or
  - A restrained 3px brand signature used only here

- Remove pill hover background from the brand link.
- Use a 5/3/4 or 6/3/3 desktop composition rather than equal columns.
- Give mission and legal identity more width.
- Keep contact and navigation concise.
- Reduce social icons to simple accessible icon links.
- Make the donation action smaller and clearly secondary to page-specific donation actions.
- Keep the site credit, but lower its contrast and separate it from organizational legal details.
- Preserve cookie preferences control.

### Mobile behavior

- Brand and mission first.
- Contact second.
- Navigation can use two columns where width allows.
- Legal and credit last.
- No crowded horizontal bottom bar.

### Acceptance criteria

- Footer remains informative without becoming another CTA section.
- RUT, contact, legal links, cookie settings, and credit remain present.
- Footer contrast passes WCAG AA.
- All social and external-link semantics remain unchanged.

---

# Part 4: Shared-component and global improvements

## 1. Tokens and global CSS

### Files

- `src/styles/tokens.css`
- `src/styles/global.css`
- Component CSS modules using radius, shadow, and gradient tokens

### Changes

- Add semantic type roles.
- Remove global uppercase heading transformation.
- Narrow radius scale.
- Make shadows exceptional.
- Add semantic layout widths.
- Add compact, standard, and generous section spacing.
- Add stable action and selection color aliases.
- Replace button gradient with flat fill.
- Change button radius from full to 8px.
- Remove global card-elevation selector list.
- Remove body decorative gradients.
- Audit undefined or inconsistent tokens such as `--line-relaxed`.

### Regression risk

High. These tokens affect the entire site.

### Validation

- Visual capture of every representative template in both themes.
- Text wrapping comparison.
- Heading hierarchy check.
- Focus-state check.
- CLS check.
- Screenshot diff review before moving to page-specific polish.

---

## 2. `PageHero`

### Files

- `PageHero.astro`
- `page-hero.css`
- All routes passing hero props

### Changes

Add presentation variants without altering content:

```ts
variant?: "editorial" | "conversion" | "compact";
align?: "start" | "center";
```

Defaults should preserve safe behavior while routes opt into the improved composition.

Recommended mapping:

- Adoption: conversion, start
- Foster: conversion, start
- Donation: conversion, start
- Success stories: editorial, start
- Why galgos: editorial, start
- Contact: compact, start

Remove default radial and linear decorative background.

### Risk

A shared update could make all top-level pages too homogeneous in a different way. Variants must be restrained and content-driven.

### Acceptance criteria

- All page heroes align to the same grid system.
- No route needs one-off positioning overrides.
- CTA and no-CTA variants remain stable.
- Light/dark modes use flat surfaces.

---

## 3. Buttons and links

### Files

- `global.css`
- Shared link components
- Route-specific button selectors

### Changes

- Flat primary.
- 8px radius.
- No translate on active.
- No routine shadow.
- Add explicit disabled and loading states.
- Ensure secondary controls retain contrast.
- Standardize icon size at 18 to 20px.
- Remove component-specific button overrides unless semantically necessary.

### Acceptance criteria

- One primary button per section.
- No gradient-filled buttons.
- Focus ring remains visible in both themes.
- All targets meet 44px minimum.
- Existing analytics attributes remain intact.

---

## 4. Shared gallery

### Files

- `SharedPhotoGallery.astro`
- `src/scripts/gallery`
- `shared-gallery.css`
- `SharedGalleryLightbox.astro`
- Gallery tests

### Changes

- Support aspect-ratio variants through component props or parent custom properties.
- Reduce navigation chrome.
- Replace permanent dot cluster with a count where appropriate.
- Keep arrows and dots/count generated only for multiple images.
- Remove `will-change` when the gallery is idle if possible.
- Avoid a single global square ratio.
- Preserve server-rendered first image and no-JavaScript visibility.
- Verify gestures do not block vertical page scrolling.

### Acceptance criteria

- Galleries work with JavaScript disabled at the first-image level.
- Lightbox works by keyboard.
- Controls meet target size.
- Adoption and success-story ratios can differ without duplicated markup.
- No layout shift occurs during image loading.

---

## 5. Card family separation

### Files

- `dog-card.css`
- `stories.css`
- `requirement-card.css`
- `donation-cards.css`
- Contact/supporter/stat CSS
- Global card-elevation block

### Changes

Stop treating all components as one card family.

Define separate presentation primitives:

- `.profile-card`
- `.editorial-story`
- `.information-group`
- `.evidence-item`
- `.financial-panel`
- `.channel-row`

These may share tokens but should not share one visual silhouette.

### Acceptance criteria

- Dog, story, statistic, donation, and contact content remain visually distinguishable when shown without headings.
- No global selector applies hover elevation across unrelated content types.
- Cards are not used where separators or plain layout suffice.

---

## 6. Forms

### Files

- `form.css`
- Contact form script
- Foster application or contact components using shared fields
- Browser tests

### Changes

- Introduce consistent error and helper markup.
- Theme-aware native-control treatment.
- 1px rest border.
- 8px radius.
- Visible network-error state.
- Focus management.
- No fixed-theme inline SVG color.
- Preserve native autofill usability.

### Acceptance criteria

- All controls pass contrast in both themes.
- Zoom to 200 percent remains usable.
- Validation is understandable without color.
- Autofill text is legible.
- Submitting state cannot produce duplicate submissions.

---

## 7. Navigation and footer

Treat header and footer as the site’s institutional frame.

They should use the most restrained styling on the site, not the most decorative.

### Acceptance criteria

- Header and footer appear stable across all routes.
- Their visual treatment does not change by page.
- They use the same spacing, typography, link, and focus systems.
- Neither introduces decorative effects absent from the rest of the site.

---

## 8. Theme system

### Files

- `tokens.css`
- `theme.ts`
- `BaseLayout.astro`
- Every component with explicit dark-mode overrides

### Changes

- Preserve `light-dark()` and `data-theme`.
- Add semantic surface tokens rather than component-local theme overrides.
- Remove dark-mode-only bright chip substitutions where neutral roles work.
- Audit all SVG icons for theme behavior.
- Verify anti-flash theme initialization.
- Preserve `color-scheme`.
- Test browser-native form controls in both modes.

### Acceptance criteria

- No theme flash on initial navigation or Astro transitions.
- No invisible SVG icons.
- No low-contrast muted copy.
- No component appears more saturated merely because dark mode is active.
- Theme preference persists.

---

# Part 5: Implementation roadmap

## Batch 1: Foundations and tokens

### Goal

Create the restrained visual foundation without changing route structure or content.

### Likely files

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/components/motion.css`
- Shared visual-regression tests or capture configuration

### Work

- Add semantic typography tokens.
- Add semantic container and spacing tokens.
- Refine radius and shadow policy.
- Flatten body background.
- Flatten primary button.
- Remove universal heading uppercase.
- Remove universal card lift.
- Add temporary compatibility aliases where needed to avoid uncontrolled breakage.

### Validation

- Build and unit tests.
- Homepage and adoption screenshots in both themes.
- Verify no hidden overflow or severe heading-wrap regressions.
- Run Lighthouse on homepage before proceeding.

### Acceptance

The site already looks calmer before page-specific work begins.

---

## Batch 2: Typography and global rhythm

### Goal

Establish hierarchy, reading rhythm, and consistent section spacing.

### Likely files

- `global.css`
- Shared section heading components
- `PageHero`
- Major homepage sections

### Work

- Apply explicit type roles.
- Convert most headings to sentence case.
- Adjust line heights and maximum widths.
- Introduce compact, standard, and generous section spacing.
- Align section headings to common desktop grid lines.
- Remove local margin patches superseded by the new rhythm.

### Validation

- Inspect every `h1`, `h2`, and `h3`.
- Verify one `h1` per page.
- Check 320px heading wraps.
- Check text at 200 percent zoom.

### Acceptance

Hierarchy remains clear even when all backgrounds, borders, and colors are mentally removed.

---

## Batch 3: Header, navigation, buttons, links, and forms

### Goal

Make the global interface frame feel institutional and precise.

### Work

- Flatten header.
- Replace navigation pills with text or underline states.
- Refine theme and menu controls.
- Standardize buttons.
- Refine form controls and states.
- Preserve all tracking and accessibility behavior.

### Validation

- Navigation Playwright tests.
- Drawer focus and escape.
- Theme persistence.
- Contact-form success and error paths.
- Touch target audit.

### Acceptance

Only genuine actions look like controls.

---

## Batch 4: Photography and gallery system

### Goal

Make real photography the site’s main visual asset.

### Work

- Add ratio variants.
- Refine controls and count.
- Remove routine shadows and decorative image effects.
- Establish consistent media radii.
- Preserve image pipeline and responsive sources.

### Validation

- Cards and profiles with one, two, and three images.
- Portrait and landscape source images.
- No-JavaScript first image.
- Lightbox keyboard path.
- CLS and LCP.

### Acceptance

Photography feels larger, calmer, and more consistent without increasing page weight.

---

## Batch 5: Dog listing and profiles

### Goal

Improve suitability scanning and individual presentation.

### Work

- Refine filters.
- Recompose cards.
- Replace colored chip row.
- Clarify actions.
- Recompose profile layout.
- Refine current-need presentation.
- Preserve content and status logic.

### Validation

- Filters and counts.
- Every active dog route.
- External adoption form tracking.
- WhatsApp links.
- Instagram links.
- Sharing.
- Gallery.
- Mobile and desktop screenshots.

### Acceptance

Dogs read as individuals, not products.

---

## Batch 6: Foster, donation, success, why galgos, contact, and collaborator templates

### Goal

Give each content type a distinct but related composition.

### Work

- Foster: guidance and comparison.
- Donation: ledger and financial panel.
- Success: editorial archive.
- Why galgos: reading-focused composition.
- Contact: integrated channel and form layout.
- Collaborators: calm logo presentation.

### Validation

- Route-specific interactions.
- Exact content preservation.
- Financial-data copy.
- Form behavior.
- Gallery behavior.
- Mobile reflow.
- Theme parity.

### Acceptance

Each route has a recognizable purpose without feeling like a separate brand.

---

## Batch 7: Footer and final cross-site consistency

### Goal

Complete the institutional frame and remove remaining decorative residue.

### Work

- Simplify footer.
- Audit remaining glows, gradients, pills, and shadows.
- Remove obsolete one-off overrides.
- Normalize section-ending CTAs.
- Check visual alignment across templates.

### Validation

- All representative routes.
- Footer links and cookie control.
- External links.
- Social icons.
- Legal information.

### Acceptance

No page contains an obviously legacy-styled component.

---

## Batch 8: Light and dark mode audit

### Goal

Make both themes perceptually equivalent.

### Work

- Audit surfaces and borders.
- Audit accent saturation.
- Audit SVGs and images.
- Audit form controls.
- Audit focus rings.
- Audit modal, drawer, toast, and cookie banner.
- Remove unnecessary component-local dark overrides.

### Validation

Capture every representative route in:

- Explicit light
- Explicit dark
- System light without stored choice
- System dark without stored choice

### Acceptance

Dark mode is not a brighter, more colorful version of light mode.

---

## Batch 9: Responsive and accessibility audit

### Widths

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px or wider

### Checks

- 44px targets
- Focus order
- Focus visibility
- Text zoom
- Reflow
- No horizontal overflow
- Sticky elements
- Drawer
- Lightbox
- Forms
- Filter state
- Error state
- Reduced motion
- Screen-reader labels
- Heading order
- Color contrast

### Acceptance

Mobile is recomposed rather than merely stacked, and desktop is composed rather than merely expanded.

---

## Batch 10: Final validation

Run the repository’s complete required checks.

At minimum:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

Also run the repository’s Playwright and Lighthouse commands as defined in `package.json`, documentation, and `AGENTS.md`.

Representative Lighthouse routes:

- `/`
- `/adoptar/`
- One `/adoptar/[slug]/`
- `/hogar-temporal/`
- `/donar/`
- `/casos-de-exito/`
- `/contacto/`

Target:

- No regression from established Lighthouse requirements
- No axe violations
- No CLS introduced by media or theme
- No unnecessary hydration or new client dependency

The repository explicitly targets Lighthouse 100 on checked pages and requires formatting, linting, builds, unit tests, browser tests, and source-hygiene validation.

---

# Agent-ready Codex CLI brief

You are implementing a visual-presentation refinement for the Brigada Galgos Astro website.

Repository:
https://github.com/fanuneza/brigadagalgos.cl

Live site:
https://brigadagalgos.cl/

OBJECTIVE

Polish the site into a restrained, professional, trustworthy, contemporary editorial experience without changing its information architecture, content strategy, content model, or established color identity.

The result must feel intentionally art-directed rather than component-generated.

The primary design direction is:

EDITORIAL RESTRAINT WITH PHOTOGRAPHIC PRIMACY

Real dog photography, typography, composition, spacing, alignment, and practical information must carry the design. Decorative CSS must become exceptional rather than routine.

NON-NEGOTIABLE OPENING STEPS

1. Inspect the repository before editing.
2. Read AGENTS.md completely.
3. Follow every required opening move in AGENTS.md, including repository resolution, planning, code navigation, Astro documentation checks, and model-routing guidance.
4. Read:
   - docs/site-brief.md
   - docs/voice-and-tone.md
   - docs/prd.md
   - docs/spec.md
   - docs/feature-inventory.md
   - docs/content-model.md
   - docs/architecture-map.md
   - docs/developer-reference.md when relevant
5. Inspect the live site in both light and dark modes at mobile and desktop widths.
6. Capture baseline screenshots for:
   - /
   - /adoptar/
   - one active /adoptar/<slug>/
   - /hogar-temporal/
   - /donar/
   - /casos-de-exito/
   - /por-que-galgos/
   - /contacto/
   - /colaboradores/
7. Verify every file, selector, component, route, and test reference before changing it. Treat file references in this brief as likely current references, not permission to skip repository inspection.

SCOPE

This is a presentation and visual-system change.

Do not:

- Change site information architecture.
- Add new top-level routes.
- Rewrite substantive content.
- Change content schemas.
- Invent dog details, medical information, compatibility, urgency, metrics, outcomes, testimonials, or organizational claims.
- Change adoption status logic.
- Change success-story limits.
- Change redirects.
- Change structured data.
- Change consent or analytics behavior.
- Change shared external-link semantics.
- Remove post-adoption-support messaging.
- Reintroduce Tailwind.
- Add decorative JavaScript.
- Add dependencies unless a documented, unavoidable need is established.
- Trade Lighthouse performance for visual effects.

Preserve:

- Astro static output.
- Existing content collections.
- Adoption dog visibility and hidden-status rules.
- Success-story 260-character and adoption-outcome rules.
- Responsive Astro image generation.
- Three-image gallery limit.
- TrackedLink, ExternalLink, WhatsAppLink, and InstagramLink behavior.
- GTM consent requirements.
- Cloudflare analytics.
- Theme anti-flash behavior.
- Light and dark modes.
- Semantic HTML.
- Progressive enhancement.
- No-JavaScript access to essential content.
- WCAG 2.2 AA.
- 44px minimum interaction targets.
- Lighthouse 100 targets on checked pages.

DESIGN SYSTEM CHANGES

A. TYPOGRAPHY

Keep Barlow and Barlow Condensed.

Use Barlow Condensed only for:

- Page titles
- Major section titles
- Dog names
- Large confirmed statistics

Use Barlow for:

- Subsection headings
- Card headings
- Navigation
- Forms
- Labels
- Supporting information

Remove the global uppercase treatment from h1, h2, and h3.

Use uppercase only for:

- Eyebrows
- Compact metadata
- Short labels

Introduce semantic type roles approximately equivalent to:

--type-display-xl: clamp(2.75rem, 6vw, 4rem)
--type-display-lg: clamp(2rem, 4vw, 2.75rem)
--type-display-md: clamp(1.625rem, 3vw, 2rem)
--type-heading-sm: 1.375rem
--type-lead: clamp(1.125rem, 1.4vw, 1.25rem)
--type-body-lg: 1.0625rem
--type-body: 1rem
--type-small: 0.875rem
--type-meta: 0.75rem

Use:

- Display line height: 0.98 to 1.05
- Heading line height: about 1.2
- Body line height: 1.55 to 1.65
- Lead line height: 1.45 to 1.55
- Reading width: 62 to 68 characters

Do not change font delivery in a way that introduces CLS or unnecessary requests.

B. COLOR ROLES

Keep the current palette, but constrain it.

- Cyan: links, focus, selected controls, navigation emphasis
- Magenta: brand identity and rare editorial emphasis
- Orange: primary conversion action
- Green: confirmed positive or completed state
- Purple: rare illustrative accent
- Rainbow combination: one restrained brand signature only

Do not combine the full palette inside ordinary interface components.

Replace most tinted component surfaces with neutral surfaces.

C. DEPTH AND DECORATION

Remove:

- Body radial gradients
- Routine section gradients
- Blurred decorative color orbs
- Hero image glow
- Image rotation
- Universal card lift
- Routine card shadows
- Decorative entrance animation
- Gradient button fills
- Unnecessary translucent/glass surfaces

Allow shadows only for:

- Mobile drawer
- Lightbox
- Temporary toast
- Cookie banner where needed
- Extremely subtle scrolled header separation
- Focus ring

D. RADII

Use approximately:

- Controls: 8px
- Cards: 10px
- Media: 12px
- Major panels: 16px
- Pills: only genuine statuses, compact counts, or filters

Do not use pill styling for:

- Primary buttons
- Navigation links
- Brand links
- Theme controls
- Ordinary cards

E. BUTTONS

Primary:

- Flat orange
- Dark foreground
- 48px minimum height
- 8px radius
- No gradient
- No default shadow
- No translate animation

Secondary:

- Transparent or neutral surface
- Strong neutral or cyan border
- Same target size

Tertiary:

- Underlined text treatment
- 44px interaction area when isolated

Each section must have one visually dominant action.

F. LAYOUT AND RHYTHM

Retain the current content maximum unless visual testing supports a small adjustment.

Introduce semantic widths:

- Wide: 1200px
- Reading: about 680px
- Compact: about 560px
- Form: about 640px

Use mobile, tablet, and desktop gutters consistently.

Replace the universal section-padding assumption with:

- Compact related-section spacing
- Standard section spacing
- Generous major-transition spacing

Use desktop width to compose relationships, not only to increase grid column count.

G. LIGHT AND DARK MODES

Treat both as first-class.

Dark mode must use:

- Flat neutral surfaces
- Controlled accent area
- Visible neutral borders
- Clear text hierarchy
- No decorative glow
- No automatic image dimming
- No unnecessary shadow escalation

Preserve:

- data-theme
- light-dark()
- color-scheme
- Stored preference
- System preference
- Theme behavior during Astro transitions
- Anti-flash initialization

SHARED COMPONENT WORK

1. src/styles/tokens.css and src/styles/global.css
   - Implement semantic typography, spacing, radius, surface, action, and shadow roles.
   - Remove global heading uppercase.
   - Remove body gradients.
   - Flatten buttons.
   - Remove global card-elevation selectors.
   - Preserve compatibility aliases temporarily where needed.

2. PageHero
   - Add restrained variants such as editorial, conversion, and compact.
   - Add start alignment.
   - Remove default decorative radial and linear backgrounds.
   - Map routes intentionally.
   - Avoid page-specific one-off positioning.

3. Navbar
   - Remove backdrop blur and toolbar-like pill styling.
   - Use a flat sticky surface and subtle border.
   - Use text or underline active states.
   - Make theme and hamburger controls 44px with modest radius.
   - Keep donation as the only filled desktop header action.
   - Preserve drawer accessibility and behavior.

4. Footer
   - Remove blurred orb.
   - Reduce or eliminate rainbow top gradient.
   - Improve column hierarchy.
   - Simplify social treatments.
   - Reduce footer CTA competition.
   - Preserve RUT, contact, navigation, legal links, cookie preferences, credit, and external-link behavior.

5. Shared gallery
   - Support different aspect-ratio families.
   - Adoption listing: 4:5.
   - Dog profile: portrait-oriented.
   - Success stories: 4:5 or 3:4.
   - Reduce arrow and dot prominence.
   - Use an image count when appropriate.
   - Preserve first-image no-JavaScript access and full lightbox accessibility.

6. Forms
   - Use 1px resting border.
   - Use 8px radius.
   - Make select indicator theme-aware.
   - Implement complete focus, invalid, disabled, submitting, success, and network-error states.
   - Connect errors using aria-describedby.
   - Preserve native labels and autocomplete.
   - Prevent duplicate submissions.

ROUTE WORK

HOME

Likely files:

- src/pages/index.astro
- src/components/Hero.astro
- src/styles/components/hero.css
- FeaturedAdoptionDogs
- MissionSection
- TrustStatsSection
- WhyGalgosSection
- StoriesSection
- ProcessStepper
- HelpCards
- DonationBanner
- RainbowDivider

Implement:

- Flat editorial hero.
- Remove glow, hover rotation, floating pill, and paw emoji.
- Increase photographic primacy.
- Keep adoption primary and foster secondary.
- Recompose mission into heading/prose desktop columns.
- Replace mission value tags with a restrained list.
- Replace stat cards with an evidence strip.
- Replace repeated card grids where plain editorial layout or separators work.
- Render process as a restrained numbered sequence.
- Keep donation as one decisive ending action.

ADOPTION LISTING

Likely files:

- src/pages/adoptar.astro
- AdoptionGrid.astro
- adoption-grid.css
- filter-chips.css
- dog-card.css
- shared-gallery.css

Implement:

- Filter controls at least 44px.
- Modest control radius.
- Clear active state.
- Use card minimum width that does not force narrow three-column layouts.
- Change media to 4:5.
- Replace four colored chips with:
  - Neutral sex, age, and weight facts
  - One distinct current-need state
- Make profile viewing the dominant card action.
- Make application secondary.
- Make WhatsApp tertiary assistance.
- Keep Instagram quiet.
- Remove shadow and hover lift.
- Preserve filter logic, result count, content-visibility behavior where safe, tracking, and all dog data.

DOG PROFILE

Likely files:

- src/pages/adoptar/[slug].astro
- dog-profile.css
- dog-card.css
- shared gallery and lightbox

Implement:

- Treat page as an individual portrait.
- Increase gallery prominence.
- Use structured facts rather than colored chip row.
- Give character sketch strong prominence.
- Keep one filled application action.
- Keep WhatsApp secondary.
- Make sharing and Instagram tertiary.
- Consider sticky information column on desktop only where safe.
- Keep support reassurance near actions.
- Preserve gallery, share, external form, WhatsApp, tracking, status logic, SEO, and structured metadata.

FOSTER

Likely files:

- src/pages/hogar-temporal.astro
- FosterRequirements.astro
- RequirementCard.astro
- hogar-temporal.css
- requirement-card.css
- ProcessStepper
- FosterPostular

Implement:

- Convert requirement cards to structured guidance with simple icons and separators.
- Present safety notes as one advisory block.
- Present Brigada cubre and Tú aportas as a clear comparison.
- Simplify process styling.
- Keep one dominant application/contact area.
- Do not alter requirements or confirmed policy details.

DONATION

Likely files:

- src/pages/donar.astro
- DonationCards.astro
- donation-cards.css
- ImpactSection
- TrustStatsSection
- HelpTailCta
- copy scripts

Implement:

- Convert amount cards to a simple impact ledger.
- Remove multicolor rules, card shadows, and pricing-tier appearance.
- Make transfer information primary.
- Make recurring eSponsor option secondary.
- Keep bank rows copyable.
- Show persistent copy affordances.
- Use 44px targets.
- Keep visible and announced copy confirmation.
- Present transparency as documentary evidence, not promotional cards.
- Preserve exact amounts, bank details, claims, links, and tracking.

SUCCESS STORIES

Likely files:

- src/pages/casos-de-exito.astro
- StoryCard.astro
- stories.css
- shared gallery

Implement:

- Two-column editorial layout on desktop.
- One column mobile.
- Portrait image ratio.
- Remove glow, gradient, shadow, and hover lift.
- Differentiate adopted stories from active-dog cards.
- Preserve story limits, adoption outcome, gallery, Instagram, and content collection behavior.

WHY GALGOS

Likely files:

- src/pages/por-que-galgos.astro
- WhyGalgosEditorial
- CasesBand
- NextStepCta

Implement:

- Reading-focused left-aligned composition.
- Use spacing, rules, and images rather than card proliferation.
- Make practical compatibility information easy to scan.
- Keep caveats visible without requiring JavaScript.
- Keep final action clear but non-coercive.

CONTACT

Likely files:

- src/pages/contacto.astro
- ContactChannels
- ContactForm
- PressSection
- form.css
- form script

Implement:

- Integrate channel choice and form in one desktop composition.
- Use direct channel rows rather than promotional cards.
- Refine all form states.
- Keep press information secondary.
- Preserve submission, analytics, labels, privacy behavior, and contact details.

COLLABORATORS AND TRUST

Inspect:

- /colaboradores/
- Supporter collection components and CSS

Implement:

- Neutral logo stages.
- Consistent intrinsic logo sizing.
- No decorative shadows.
- No commercial sponsor-wall styling.
- Preserve logoAlt and content collection rules.

RESPONSIVE REQUIREMENTS

Validate at:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px or wider

Mobile must be recomposed rather than mechanically stacked.

Desktop must introduce meaningful column relationships rather than merely more cards.

ACCESSIBILITY REQUIREMENTS

- WCAG 2.2 AA
- 44px minimum targets
- Visible focus
- Correct heading order
- One h1
- No information communicated only through color
- Reduced motion
- Keyboard gallery and lightbox
- Keyboard drawer
- Correct inert and focus restoration
- Accessible form errors
- Accessible copy feedback
- No hover-only essential action
- 200 percent zoom
- No horizontal overflow
- No sticky element obscuring focus or content

PERFORMANCE REQUIREMENTS

- Do not add decorative JavaScript.
- Do not hydrate content unnecessarily.
- Preserve static server-rendered profiles, stories, donation information, and contact paths.
- Preserve image optimization.
- Avoid new web fonts.
- Avoid layout shift.
- Avoid idle will-change usage.
- Maintain or improve LCP, CLS, and INP.
- Maintain Lighthouse 100 targets on checked routes.

IMPLEMENTATION SEQUENCE

1. Foundations and tokens
2. Typography and global rhythm
3. Header, navigation, buttons, links, and forms
4. Photography and gallery system
5. Adoption listing and dog profile
6. Foster, donation, success, why galgos, contact, collaborators
7. Footer and cross-site consistency
8. Light/dark audit
9. Responsive and accessibility audit
10. Final tests and Lighthouse

After each meaningful batch:

- Run lightweight build and relevant tests.
- Capture representative mobile and desktop screenshots in both themes.
- Correct regressions before continuing.

FINAL VALIDATION

Run all repository-defined:

- Format checks
- Lint
- Type checks
- Build
- Vitest
- Playwright
- Source hygiene
- Accessibility tests
- Browser regression tests
- Lighthouse checks

Do not guess command names. Read package.json and AGENTS.md.

Run Lighthouse on at least:

- /
- /adoptar/
- one /adoptar/<slug>/
- /hogar-temporal/
- /donar/
- /casos-de-exito/
- /contacto/

DOCUMENTATION

Update current documentation in the same change when the implemented visual system makes existing design or component guidance inaccurate.

Do not rewrite documentation unrelated to the approved presentation work.

FINAL REPORT

Return:

1. Summary of visual direction implemented
2. Changed files grouped by batch
3. Before/after screenshots for representative templates
4. Validation commands and results
5. Lighthouse results
6. Accessibility results
7. Light/dark verification
8. Responsive verification
9. Remaining risks
10. Recommendations intentionally deferred because they would change structure, content, architecture, or product scope
