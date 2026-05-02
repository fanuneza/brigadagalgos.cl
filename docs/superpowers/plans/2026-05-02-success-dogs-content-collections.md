# Success Dogs Content Collections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the 18 success-story dogs from a client-side `fetch('/casos/exito.json')` runtime pipeline into an Astro 6 Content Collection rendered fully at build time, with a "Ver más" button that reveals 6 more cards per click.

**Architecture:** Add a `success-dogs` collection to `src/content.config.ts`. Move source images from `public/casos/exito/[id]/` to `src/assets/casos/exito/[id]/`. Create 18 Markdown entries. Update `index.astro` to load the collection at build time and pass data as props to `StoriesSection`. Rewrite `StoriesSection.astro` to render all 18 cards statically, replace the fetch/skeleton script with a DOM-shuffle + progressive-reveal script, and add a "Ver más" button.

**Tech Stack:** Astro 6 Content Layer (`glob()` loader, `image()`), `astro:assets` (`getImage`), TypeScript, PowerShell (file migration), existing `SharedPhotoGallery`, `SharedGalleryLightbox`, `shared-gallery.ts`.

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/content.config.ts` |
| Move | `public/casos/exito/[18 dogs]/[source files]` → `src/assets/casos/exito/[18 dogs]/` |
| Create | `src/content/success-dogs/[18 ids].md` |
| Rewrite | `src/components/StoriesSection.astro` |
| Modify | `src/pages/index.astro` |
| Modify | `src/styles/components/stories.css` |
| Create | `public/casos/exito-OBSOLETE.txt` |
| Modify | `README.md` |

**Do NOT touch:**
- `src/components/SharedPhotoGallery.astro`
- `src/components/SharedGalleryLightbox.astro`
- `src/scripts/shared-gallery.ts`
- `public/casos/exito.json` (kept as reference, only documented as obsolete)
- `src/content/adoption-dogs/` or `src/content/dogs/`

---

## Task 1 — Update `src/content.config.ts`

Add `successDogs` collection alongside the existing `adoptionDogs`.

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Replace the entire file with the following content**

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const adoptionDogs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/adoption-dogs' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      sex: z.enum(['Macho', 'Hembra']),
      age: z.string(),
      weight: z.string(),
      details: z.string(),
      order: z.number().int().optional(),
      gallery: z.array(image()),
    }),
});

const successDogs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/success-dogs' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      story: z.string(),
      gallery: z.array(image()),
    }),
});

export const collections = {
  'adoption-dogs': adoptionDogs,
  'success-dogs': successDogs,
};
```

- [ ] **Step 2: Verify by reading the file back** — confirm both collections are exported.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add success-dogs content collection schema"
```

---

## Task 2 — Move source images to `src/assets/casos/exito/`

Copy `.jpg`/`.png` source files from `public/casos/exito/[id]/` to `src/assets/casos/exito/[id]/`, then remove the entire `public/casos/exito/` directory tree from git.

**Files:**
- Move: `public/casos/exito/[18 dirs]/` → `src/assets/casos/exito/[18 dirs]/`

**Important:** Only copy source `.jpg`/`.png` files, not the pre-processed `-mobile.webp`/`-desktop.webp`/`-lightbox.webp` variants. Astro will generate equivalents from source at build time.

**Special cases:**
- `bolt-1.jpg` (no zero-padding) — copy as-is, reference exactly as `bolt-1.jpg`
- Alfonsina: `alfonsina-02.png`, `alfonsina-03.png`, `alfonsina-04.png` are `.png` not `.jpg` — include them

- [ ] **Step 1: Create target base directory**

```powershell
New-Item -ItemType Directory -Path "src\assets\casos\exito" -Force
```

- [ ] **Step 2: Copy source files for all 18 dogs**

Run these commands in the project root. Each command creates the subdirectory and copies `.jpg`/`.png` files only:

```powershell
foreach ($dog in @("alfonsina","avena","bolt","bruno","canela","fermin","francia","leo","lille","lisboa","malta","marsella","mora","mozzarella","parmesana","praga","trigo","trufa")) {
    New-Item -ItemType Directory -Path "src\assets\casos\exito\$dog" -Force
    Get-ChildItem "public\casos\exito\$dog" -Include "*.jpg","*.png" | Copy-Item -Destination "src\assets\casos\exito\$dog\"
}
```

- [ ] **Step 3: Verify all expected files were copied**

```powershell
Get-ChildItem "src\assets\casos\exito" -Recurse -Include "*.jpg","*.png" | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: **100** (alfonsina 6, avena 6, bolt 2, bruno 6, canela 6, fermin 3, francia 6, leo 4, lille 6, lisboa 6, malta 6, marsella 6, mora 6, mozzarella 6, parmesana 6, praga 6, trigo 6, trufa 6 = 100 total).

- [ ] **Step 4: Stage new files and remove old directory from git**

```bash
git add src/assets/casos/exito/
git rm -r --cached public/casos/exito/
```

Then physically delete remaining files:

```powershell
Remove-Item -Recurse -Force "public\casos\exito"
```

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: move success story source images to src/assets for Astro optimization"
```

---

## Task 3 — Create 18 Markdown dog entries

Create `src/content/success-dogs/` directory and write one `.md` file per dog. Each file has only YAML frontmatter and an empty body. Image paths are relative from `src/content/success-dogs/` to `src/assets/`: use `../../assets/casos/exito/[id]/[filename]`.

**Files:**
- Create: `src/content/success-dogs/` (18 files)

- [ ] **Step 1: Create `src/content/success-dogs/alfonsina.md`**

```markdown
---
name: Alfonsina
story: "De Alfonsina no tenemos una cronología completa, pero sí fotos y 7 archivos médicos y de imagen. Sabemos que pasó por atención veterinaria y después fue adoptada."
gallery:
  - ../../assets/casos/exito/alfonsina/alfonsina-01.jpg
  - ../../assets/casos/exito/alfonsina/alfonsina-02.png
  - ../../assets/casos/exito/alfonsina/alfonsina-03.png
  - ../../assets/casos/exito/alfonsina/alfonsina-04.png
  - ../../assets/casos/exito/alfonsina/alfonsina-05.jpg
  - ../../assets/casos/exito/alfonsina/alfonsina-06.jpg
---
```

- [ ] **Step 2: Create `src/content/success-dogs/avena.md`**

```markdown
---
name: Avena
story: "Avena llegó desde Talca. La planilla registra miedo extremo, trazodona por cinco días y recomendación de evaluación con etólogo; después pasó por hogar temporal y fue adoptada."
gallery:
  - ../../assets/casos/exito/avena/avena-01.jpg
  - ../../assets/casos/exito/avena/avena-02.jpg
  - ../../assets/casos/exito/avena/avena-03.jpg
  - ../../assets/casos/exito/avena/avena-04.jpg
  - ../../assets/casos/exito/avena/avena-05.jpg
  - ../../assets/casos/exito/avena/avena-06.jpg
---
```

- [ ] **Step 3: Create `src/content/success-dogs/bolt.md`**

Note: `bolt-1.jpg` has no zero-padding — reference it exactly.

```markdown
---
name: Bolt
story: "A Bolt lo rescatamos con dardo y al día siguiente hubo que salir a buscarlo después de que se escapó de su hogar temporal. Luego siguió con hemogramas por neutropenia leve y más tarde fue adoptado."
gallery:
  - ../../assets/casos/exito/bolt/bolt-1.jpg
  - ../../assets/casos/exito/bolt/bolt-03.jpg
---
```

- [ ] **Step 4: Create `src/content/success-dogs/bruno.md`**

```markdown
---
name: Bruno
story: "Bruno fue rescatado en Catemu. No tenemos un expediente clínico largo, pero sí evidencia de esterilización y señales de ceguera en fotos posteriores; después fue adoptado."
gallery:
  - ../../assets/casos/exito/bruno/bruno-01.jpg
  - ../../assets/casos/exito/bruno/bruno-02.jpg
  - ../../assets/casos/exito/bruno/bruno-03.jpg
  - ../../assets/casos/exito/bruno/bruno-04.jpg
  - ../../assets/casos/exito/bruno/bruno-05.jpg
  - ../../assets/casos/exito/bruno/bruno-06.jpg
---
```

- [ ] **Step 5: Create `src/content/success-dogs/canela.md`**

```markdown
---
name: Canela
story: "Canela fue una de las cachorras encontradas entre matorrales en Melipilla. Llegó con bajo peso, recibió su primera vacuna y más tarde fue adoptada."
gallery:
  - ../../assets/casos/exito/canela/canela-01.jpg
  - ../../assets/casos/exito/canela/canela-02.jpg
  - ../../assets/casos/exito/canela/canela-03.jpg
  - ../../assets/casos/exito/canela/canela-04.jpg
  - ../../assets/casos/exito/canela/canela-05.jpg
  - ../../assets/casos/exito/canela/canela-06.jpg
---
```

- [ ] **Step 6: Create `src/content/success-dogs/fermin.md`**

```markdown
---
name: Fermín
story: "A Fermín lo dejaron fracturado y muy herido en El Melón. Vecinos le armaron una casita en la vereda para que aguantara hasta que llegáramos; hoy está adoptado y ya no tiene esa mirada triste."
gallery:
  - ../../assets/casos/exito/fermin/fermin-01.jpg
  - ../../assets/casos/exito/fermin/fermin-02.jpg
  - ../../assets/casos/exito/fermin/fermin-03.jpg
---
```

- [ ] **Step 7: Create `src/content/success-dogs/francia.md`**

```markdown
---
name: Francia
story: "A Francia la rescatamos en La Serena junto a cuatro cachorros. Pasó por esterilización y controles por vómitos y decaimiento postoperatorio; después fue adoptada."
gallery:
  - ../../assets/casos/exito/francia/francia-01.jpg
  - ../../assets/casos/exito/francia/francia-02.jpg
  - ../../assets/casos/exito/francia/francia-03.jpg
  - ../../assets/casos/exito/francia/francia-04.jpg
  - ../../assets/casos/exito/francia/francia-05.jpg
  - ../../assets/casos/exito/francia/francia-06.jpg
---
```

- [ ] **Step 8: Create `src/content/success-dogs/leo.md`**

```markdown
---
name: Leo
story: "Leo fue atropellado en Lampa y lo rescatamos cuando querían eutanasiarlo por falta de recursos. Pasó por dos cirugías por su fractura de espalda y hoy está adoptado; no camina, pero eso no le ha quitado las ganas de vivir bonito."
gallery:
  - ../../assets/casos/exito/leo/leo-01.jpg
  - ../../assets/casos/exito/leo/leo-02.jpg
  - ../../assets/casos/exito/leo/leo-03.jpg
  - ../../assets/casos/exito/leo/leo-04.jpg
---
```

- [ ] **Step 9: Create `src/content/success-dogs/lille.md`**

```markdown
---
name: Lille
story: "Lille, hija de Francia, pasó por hogar temporal y etapa a prueba mientras crecía. Recibió desparasitación y primera vacuna antes de ser adoptada."
gallery:
  - ../../assets/casos/exito/lille/lille-01.jpg
  - ../../assets/casos/exito/lille/lille-02.jpg
  - ../../assets/casos/exito/lille/lille-03.jpg
  - ../../assets/casos/exito/lille/lille-04.jpg
  - ../../assets/casos/exito/lille/lille-05.jpg
  - ../../assets/casos/exito/lille/lille-06.jpg
---
```

- [ ] **Step 10: Create `src/content/success-dogs/lisboa.md`**

```markdown
---
name: Lisboa
story: "A Lisboa la rescatamos en Melipilla junto a sus cachorros. Pasó por quimioterapia por TVT, cirugía y reconstrucción de vulva; más tarde fue adoptada."
gallery:
  - ../../assets/casos/exito/lisboa/lisboa-01.jpg
  - ../../assets/casos/exito/lisboa/lisboa-02.jpg
  - ../../assets/casos/exito/lisboa/lisboa-03.jpg
  - ../../assets/casos/exito/lisboa/lisboa-04.jpg
  - ../../assets/casos/exito/lisboa/lisboa-05.jpg
  - ../../assets/casos/exito/lisboa/lisboa-06.jpg
---
```

- [ ] **Step 11: Create `src/content/success-dogs/malta.md`**

```markdown
---
name: Malta
story: "De Malta tenemos registros entre enero y diciembre de 2023, con exámenes, atención veterinaria y difusión de adopción. Después de ese año de cuidado, fue adoptada."
gallery:
  - ../../assets/casos/exito/malta/malta-01.jpg
  - ../../assets/casos/exito/malta/malta-02.jpg
  - ../../assets/casos/exito/malta/malta-03.jpg
  - ../../assets/casos/exito/malta/malta-04.jpg
  - ../../assets/casos/exito/malta/malta-05.jpg
  - ../../assets/casos/exito/malta/malta-06.jpg
---
```

- [ ] **Step 12: Create `src/content/success-dogs/marsella.md`**

```markdown
---
name: Marsella
story: "Marsella llegó a nuestro apoyo como una de las hijas de Francia. Recibió desparasitación y primera vacuna cuando era cachorra; después fue adoptada."
gallery:
  - ../../assets/casos/exito/marsella/marsella-01.jpg
  - ../../assets/casos/exito/marsella/marsella-02.jpg
  - ../../assets/casos/exito/marsella/marsella-03.jpg
  - ../../assets/casos/exito/marsella/marsella-04.jpg
  - ../../assets/casos/exito/marsella/marsella-05.jpg
  - ../../assets/casos/exito/marsella/marsella-06.jpg
---
```

- [ ] **Step 13: Create `src/content/success-dogs/mora.md`**

```markdown
---
name: Mora
story: "Mora fue rescatada en Los Andes con 17,5 kilos. Tenía muchas garrapatas, una diferencia entre ambos riñones y una limitación visible en la cola; después fue adoptada."
gallery:
  - ../../assets/casos/exito/mora/mora-01.jpg
  - ../../assets/casos/exito/mora/mora-02.jpg
  - ../../assets/casos/exito/mora/mora-03.jpg
  - ../../assets/casos/exito/mora/mora-04.jpg
  - ../../assets/casos/exito/mora/mora-05.jpg
  - ../../assets/casos/exito/mora/mora-06.jpg
---
```

- [ ] **Step 14: Create `src/content/success-dogs/mozzarella.md`**

```markdown
---
name: Mozzarella
story: "A Mozzarella la rescatamos en Buin. Pasó por anemia, controles tiroideos y cardiología antes de encontrar un hogar; después de todo ese cuidado, fue adoptada."
gallery:
  - ../../assets/casos/exito/mozzarella/mozzarella-01.jpg
  - ../../assets/casos/exito/mozzarella/mozzarella-02.jpg
  - ../../assets/casos/exito/mozzarella/mozzarella-03.jpg
  - ../../assets/casos/exito/mozzarella/mozzarella-04.jpg
  - ../../assets/casos/exito/mozzarella/mozzarella-05.jpg
  - ../../assets/casos/exito/mozzarella/mozzarella-06.jpg
---
```

- [ ] **Step 15: Create `src/content/success-dogs/parmesana.md`**

```markdown
---
name: Parmesana
story: "Parmesana salió del operativo de Buin. Pasó por peritonitis, exámenes, radiografías y cirugía antes de estabilizarse; después fue adoptada."
gallery:
  - ../../assets/casos/exito/parmesana/parmesana-01.jpg
  - ../../assets/casos/exito/parmesana/parmesana-02.jpg
  - ../../assets/casos/exito/parmesana/parmesana-03.jpg
  - ../../assets/casos/exito/parmesana/parmesana-04.jpg
  - ../../assets/casos/exito/parmesana/parmesana-05.jpg
  - ../../assets/casos/exito/parmesana/parmesana-06.jpg
---
```

- [ ] **Step 16: Create `src/content/success-dogs/praga.md`**

```markdown
---
name: Praga
story: "De Praga no tenemos una cronología completa, pero sí fotos y 21 archivos médicos y administrativos. Sabemos que pasó por atención veterinaria y después fue adoptado."
gallery:
  - ../../assets/casos/exito/praga/praga-01.jpg
  - ../../assets/casos/exito/praga/praga-02.jpg
  - ../../assets/casos/exito/praga/praga-03.jpg
  - ../../assets/casos/exito/praga/praga-04.jpg
  - ../../assets/casos/exito/praga/praga-05.jpg
  - ../../assets/casos/exito/praga/praga-06.jpg
---
```

- [ ] **Step 17: Create `src/content/success-dogs/trigo.md`**

```markdown
---
name: Trigo
story: "Trigo llegó desde Talca. Pasó por hogar temporal, ecografías, radiografías y varios controles antes de estar estable; después de ese recorrido, fue adoptado."
gallery:
  - ../../assets/casos/exito/trigo/trigo-01.jpg
  - ../../assets/casos/exito/trigo/trigo-02.jpg
  - ../../assets/casos/exito/trigo/trigo-03.jpg
  - ../../assets/casos/exito/trigo/trigo-04.jpg
  - ../../assets/casos/exito/trigo/trigo-05.jpg
  - ../../assets/casos/exito/trigo/trigo-06.jpg
---
```

- [ ] **Step 18: Create `src/content/success-dogs/trufa.md`**

```markdown
---
name: Trufa
story: "A Trufa la rescatamos en la Quinta Región. Fue esterilizada, estuvo hospitalizada y recibió tratamiento antes de pasar por hogar temporal; después fue adoptada."
gallery:
  - ../../assets/casos/exito/trufa/trufa-01.jpg
  - ../../assets/casos/exito/trufa/trufa-02.jpg
  - ../../assets/casos/exito/trufa/trufa-03.jpg
  - ../../assets/casos/exito/trufa/trufa-04.jpg
  - ../../assets/casos/exito/trufa/trufa-05.jpg
  - ../../assets/casos/exito/trufa/trufa-06.jpg
---
```

- [ ] **Step 19: Verify all 18 files exist**

```powershell
Get-ChildItem "src\content\success-dogs\*.md" | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: `18`

- [ ] **Step 20: Commit**

```bash
git add src/content/success-dogs/
git commit -m "feat: add success dog entries as content collection Markdown files"
```

---

## Task 4 — Rewrite `src/components/StoriesSection.astro`

Full rewrite: remove fetch/skeleton/script, accept `dogs` prop, render all 18 cards statically, add "Ver más" button, replace script with DOM-shuffle + progressive-reveal.

**Files:**
- Rewrite: `src/components/StoriesSection.astro`

- [ ] **Step 1: Read the current file** to understand what is being replaced.

- [ ] **Step 2: Write the complete new file**

```astro
---
import SharedPhotoGallery from './SharedPhotoGallery.astro';
import SharedGalleryLightbox from './SharedGalleryLightbox.astro';
import type { SharedGalleryPhoto } from '../scripts/shared-gallery';

interface StoryDog {
  id: string;
  name: string;
  story: string;
  photos: SharedGalleryPhoto[];
}

interface Props {
  dogs: StoryDog[];
}

const { dogs } = Astro.props;
---

<section class="section-padding stories" data-stories-root>
  <div class="container">
    <p class="stories__eyebrow">Historias</p>
    <h2 class="stories__heading">Nuestros casos de éxito.</h2>

    <div class="stories__grid" data-stories-list>
      {dogs.map((dog) => (
        <article class="story-card" data-story-card>
          <SharedPhotoGallery name={dog.name} photos={dog.photos} />
          <div class="story-card__body">
            <p class="story-card__name">{dog.name}</p>
            <p class="story-card__quote">{dog.story}</p>
          </div>
        </article>
      ))}
    </div>

    {dogs.length > 6 && (
      <div class="stories__ver-mas-wrap">
        <button type="button" class="btn btn--secondary" data-stories-ver-mas>
          Ver más historias
        </button>
      </div>
    )}
  </div>
</section>

<SharedGalleryLightbox ariaLabel="Galería de historias" />

<script>
  import { initSharedGalleries, initSharedGalleryLightbox } from '../scripts/shared-gallery';

  const PAGE_SIZE = 6;
  const grid = document.querySelector<HTMLElement>('[data-stories-list]');
  const button = document.querySelector<HTMLButtonElement>('[data-stories-ver-mas]');

  if (grid) {
    const cards = [...grid.querySelectorAll<HTMLElement>('[data-story-card]')];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach(card => grid.appendChild(card));

    let shown = Math.min(PAGE_SIZE, cards.length);

    function applyVisibility() {
      cards.forEach((card, i) => { card.hidden = i >= shown; });
      if (button) button.hidden = shown >= cards.length;
    }

    button?.addEventListener('click', () => {
      shown = Math.min(shown + PAGE_SIZE, cards.length);
      applyVisibility();
    });

    applyVisibility();
    initSharedGalleries(grid);
  }

  initSharedGalleryLightbox();
</script>
```

- [ ] **Step 3: Verify removed and added elements**

Read the file back and confirm:
- No `fetch(` anywhere
- No `data-stories-skeleton` anywhere
- No `data-stories-status` anywhere
- `data-stories-ver-mas` button is present
- `SharedPhotoGallery` import is present
- `initSharedGalleries` and `initSharedGalleryLightbox` are imported from `../scripts/shared-gallery`

- [ ] **Step 4: Commit**

```bash
git add src/components/StoriesSection.astro
git commit -m "refactor: replace client-side fetch with static render and Ver más pagination in StoriesSection"
```

---

## Task 5 — Update `src/pages/index.astro`

Add `getCollection('success-dogs')` + `getImage()` in the frontmatter, then pass the built array as `dogs` prop to `<StoriesSection>`.

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read the current file**

- [ ] **Step 2: Replace the entire frontmatter block** (between the opening `---` and closing `---`).

Current imports (preserve these):
```typescript
import '../styles/components/mission.css';
import '../styles/components/help-cards.css';
import '../styles/components/stepper.css';
import '../styles/components/stories.css';
import '../styles/components/donation-banner.css';
import '../styles/components/rainbow-divider.css';
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import RainbowDivider from '../components/RainbowDivider.astro';
import MissionSection from '../components/MissionSection.astro';
import HelpCards from '../components/HelpCards.astro';
import ProcessStepper from '../components/ProcessStepper.astro';
import StoriesSection from '../components/StoriesSection.astro';
import DonationBanner from '../components/DonationBanner.astro';
import Footer from '../components/Footer.astro';
```

New additions to add after the existing imports:
```typescript
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { SharedGalleryPhoto } from '../scripts/shared-gallery';
```

Preserve `rescueSteps` array unchanged.

Add after `rescueSteps`:
```typescript
const rawStoryDogs = await getCollection('success-dogs');

const storyDogs = await Promise.all(
  rawStoryDogs.map(async (entry) => ({
    id: entry.id,
    name: entry.data.name,
    story: entry.data.story,
    photos: await Promise.all(
      entry.data.gallery.map(async (img): Promise<SharedGalleryPhoto> => ({
        card_mobile:  (await getImage({ src: img, width: 400,  format: 'avif' })).src,
        card_desktop: (await getImage({ src: img, width: 700,  format: 'avif' })).src,
        lightbox:     (await getImage({ src: img, width: 1200, format: 'avif' })).src,
      }))
    ),
  }))
);
```

- [ ] **Step 3: Update the template** — change `<StoriesSection />` to `<StoriesSection dogs={storyDogs} />`.

The full updated line (only this one template line changes):
```astro
<StoriesSection dogs={storyDogs} />
```

- [ ] **Step 4: Verify**

Read the file and confirm:
- `getCollection('success-dogs')` is called
- `storyDogs` is built with `getImage()` at 400/700/1200 px avif
- `<StoriesSection dogs={storyDogs} />` is in the template (not `<StoriesSection />`)
- `rescueSteps` array is unchanged

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: load success-dogs collection at build time and pass to StoriesSection"
```

---

## Task 6 — Add CSS for "Ver más" wrapper

**Files:**
- Modify: `src/styles/components/stories.css`

- [ ] **Step 1: Read `src/styles/components/stories.css`** to find the end of the file.

- [ ] **Step 2: Append the following rule at the end of the file**

```css
.stories__ver-mas-wrap {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/components/stories.css
git commit -m "feat: add Ver más button wrapper style to stories"
```

---

## Task 7 — Document `public/casos/exito.json` as obsolete

**Files:**
- Create: `public/casos/exito-OBSOLETE.txt`

- [ ] **Step 1: Create the file**

```
exito.json is no longer fetched by the site at runtime.

The source of truth for success stories is now:
  src/content/success-dogs/*.md   (dog metadata + story text + image references)
  src/assets/casos/exito/         (source images, optimized by Astro at build time)

This file continues to be regenerated by:
  npm run prepare:casos

That script reads from an external source and is preserved for record-keeping
and future use. The site build no longer depends on this file or this directory.
```

- [ ] **Step 2: Commit**

```bash
git add public/casos/exito-OBSOLETE.txt
git commit -m "docs: mark public/casos/exito.json as obsolete after content collection migration"
```

---

## Task 8 — Run `npm run build` and fix errors

**Files:**
- Modify: any file with a build error

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: build completes with no errors. Astro generates avif variants for ~100 source images (3 sizes each = ~300 image files). The `/` page is emitted with all 18 story cards pre-rendered.

- [ ] **Step 2: If build fails — common causes and fixes**

**A) Image not found for a gallery path**

The error names the MD file and the missing path. Check:
- File physically exists in `src/assets/casos/exito/[id]/[filename]`
- Filename matches exactly (case-sensitive): `bolt-1.jpg` not `bolt-01.jpg`
- Extension matches: `alfonsina-02.png` not `alfonsina-02.jpg`

**B) `StoriesSection` TypeScript error on `dogs` prop**

`dogs` must match `StoryDog[]` defined in the component. If `storyDogs` in `index.astro` has a type mismatch, add an explicit return type to the `getImage` mapping:
```typescript
(img): Promise<SharedGalleryPhoto> => ({ ... })
```

**C) `getCollection('success-dogs')` returns empty**

Verify `src/content.config.ts` exports `'success-dogs'` with the `glob()` loader pointed at `'./src/content/success-dogs'` and that the 18 `.md` files exist in that directory.

**D) `shared-gallery` type import error**

`import type { SharedGalleryPhoto }` — ensure the `type` keyword is present (type-only import).

- [ ] **Step 3: Verify rendered output**

```bash
grep -c "data-story-card" dist/index.html
```
Expected: `18`

```bash
grep -c "data-stories-skeleton" dist/index.html
```
Expected: `0`

```bash
grep -c "data-stories-ver-mas" dist/index.html
```
Expected: `1`

```bash
grep -c "casos/exito" dist/index.html
```
Expected: `0` (no raw public paths in output)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors in success dogs content collection migration"
```

---

## Task 9 — Update `README.md`

Add a "Cómo agregar una historia de éxito" section.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current `README.md`**

- [ ] **Step 2: Add the following section** immediately after the existing "Cómo agregar un galgo en adopción" section (before "### Para retirar un galgo"):

```markdown
## Cómo agregar una historia de éxito

1. **Agrega las fotos** a `src/assets/casos/exito/[dog-id]/`
   - Usa `.jpg` o `.png`. Nombra los archivos en orden: `01.jpg`, `02.jpg`, etc.
   - Astro genera automáticamente variantes optimizadas a partir de estos archivos.

2. **Crea el archivo Markdown** en `src/content/success-dogs/[dog-id].md`:

   ```markdown
   ---
   name: Nombre del galgo
   story: "Historia breve del caso adoptado (máx. ~240 caracteres)."
   gallery:
     - ../../assets/casos/exito/[dog-id]/01.jpg
     - ../../assets/casos/exito/[dog-id]/02.jpg
   ---
   ```

3. **Corre `npm run build`** y verifica que compile sin errores.

### Para retirar una historia de éxito

Elimina o mueve su archivo `.md` de `src/content/success-dogs/`. Las imágenes en `src/assets/` pueden eliminarse después.
```

Also update the "Estructura relevante" section to add the `success-dogs` directory entry:

```
  content/
    adoption-dogs/         # un .md por galgo en adopción (fuente de verdad)
    success-dogs/          # un .md por historia de éxito (fuente de verdad)
    dogs/                  # registros legacy (sistema separado)
```

And update the public/casos section:

```
public/
  casos/
    exito.json             # OBSOLETO — ver public/casos/exito-OBSOLETE.txt
    adopcion.json          # OBSOLETO — ver public/casos/adopcion-OBSOLETE.txt
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add success story onboarding instructions to README"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Covered by |
|---|---|
| `success-dogs` collection with `name`, `story`, `gallery: z.array(image())` | Task 1 |
| `glob()` loader from `astro/loaders` (Astro 6 Content Layer) | Task 1 |
| Source images moved from `public/` to `src/assets/` | Task 2 |
| 18 Markdown entries with correct image paths | Task 3 |
| `StoriesSection` accepts `dogs` prop, renders statically | Task 4 |
| Skeleton and fetch removed | Task 4 |
| DOM shuffle (Fisher-Yates, same as filter-chips.ts) | Task 4 |
| "Ver más" button reveals 6 more per click, hides when all visible | Task 4 |
| `index.astro` loads collection, calls `getImage()`, passes prop | Task 5 |
| `.stories__ver-mas-wrap` centering CSS | Task 6 |
| `public/casos/exito.json` documented as obsolete | Task 7 |
| `npm run build` passes, 18 cards in output | Task 8 |
| README onboarding for success stories | Task 9 |

### Placeholder scan

None. All 18 dog MD files contain exact content. `StoriesSection.astro` full file shown. `index.astro` diff shown line by line.

### Type consistency

- `StoryDog` defined in `StoriesSection.astro` uses `id: string, name: string, story: string, photos: SharedGalleryPhoto[]`
- `storyDogs` in `index.astro` produces exactly that shape: `id` from `entry.id`, `name`/`story` from `entry.data`, `photos` from `getImage()` mapping
- `SharedGalleryPhoto` from `../scripts/shared-gallery` used consistently in both files
- `data-story-card` attribute: added in template (Task 4), queried in script (Task 4) — same string
- `data-stories-ver-mas`: added on button (Task 4), queried in script (Task 4) — same string
- `data-stories-list`: kept on grid element (Task 4), queried in script (Task 4) — same string
