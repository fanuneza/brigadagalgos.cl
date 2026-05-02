import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const repoRoot = process.cwd();
const jsonPath = path.join(repoRoot, 'public', 'casos', 'index.json');
const outputRoot = path.join(repoRoot, 'public', 'casos', 'site');

const CARD_SIZES = {
  mobile: 318,
  desktop: 350,
};

const LIGHTBOX_SIZE = 1600;

const BOLT_PHOTOS = [
  'photos/bolt/bolt-1.jpg',
  'photos/bolt/bolt-02.heic',
  'photos/bolt/bolt-03.jpg',
  'photos/bolt/bolt-04.heic',
  'photos/bolt/bolt-05.heic',
  'photos/bolt/bolt-06.heic',
];

const SITE_STORIES = {
  mozzarella: 'A Mozzarella la rescatamos en Buin. Pasó por anemia, controles tiroideos y cardiología antes de encontrar un hogar; después de todo ese cuidado, fue adoptada.',
  trigo: 'Trigo llegó desde Talca. Pasó por hogar temporal, ecografías, radiografías y varios controles antes de estar estable; después de ese recorrido, fue adoptado.',
  praga: 'De Praga no tenemos una cronología completa, pero sí fotos y 21 archivos médicos y administrativos. Sabemos que pasó por atención veterinaria y después fue adoptado.',
  lisboa: 'A Lisboa la rescatamos en Melipilla junto a sus cachorros. Pasó por quimioterapia por TVT, cirugía y reconstrucción de vulva; más tarde fue adoptada.',
  parmesana: 'Parmesana salió del operativo de Buin. Pasó por peritonitis, exámenes, radiografías y cirugía antes de estabilizarse; después fue adoptada.',
  nina: 'A Nina la rescatamos con apoyo de la PDI en Paine. Pasó por cirugía por piometra y varios exámenes en agosto de 2025; después fue adoptada, también con el nombre Huayca.',
  malta: 'De Malta tenemos registros entre enero y diciembre de 2023, con exámenes, atención veterinaria y difusión de adopción. Después de ese año de cuidado, fue adoptada.',
  canela: 'Canela fue una de las cachorras encontradas entre matorrales en Melipilla. Llegó con bajo peso, recibió su primera vacuna y más tarde fue adoptada.',
  coraline: 'Coraline había sido rescatada antes y luego volvió a nuestro apoyo. La planilla registra mastocitoma y hallazgos pulmonares; falleció el 30/04/2026.',
  marsella: 'Marsella llegó a nuestro apoyo como una de las hijas de Francia. Recibió desparasitación y primera vacuna cuando era cachorra; después fue adoptada.',
  foxy: 'Foxy entró a nuestro apoyo después de pasar por el cerro El Carbón y un club de polo en Santa María de Manquehue. La planilla registra infección dental severa, anaplasma y anemia leve; sigue en hogar temporal.',
  francia: 'A Francia la rescatamos en La Serena junto a cuatro cachorros. Pasó por esterilización y controles por vómitos y decaimiento postoperatorio; después fue adoptada.',
  mora: 'Mora fue rescatada en Los Andes con 17,5 kilos. Tenía muchas garrapatas, una diferencia entre ambos riñones y una limitación visible en la cola; después fue adoptada.',
  bolt: 'A Bolt lo rescatamos con dardo y al día siguiente hubo que salir a buscarlo después de que se escapó de su hogar temporal. Luego siguió con hemogramas por neutropenia leve y más tarde fue adoptado.',
  lille: 'Lille, hija de Francia, pasó por hogar temporal y etapa a prueba mientras crecía. Recibió desparasitación y primera vacuna antes de ser adoptada.',
  turron: 'Turrón llegó desde Isla de Maipo después de ser atropellado, con una fractura expuesta en la pata delantera derecha. Fue operado y sigue en hogar temporal mientras se recupera.',
  alfonsina: 'De Alfonsina no tenemos una cronología completa, pero sí fotos y 7 archivos médicos y de imagen. Sabemos que pasó por atención veterinaria y después fue adoptada.',
  trufa: 'A Trufa la rescatamos en la Quinta Región. Fue esterilizada, estuvo hospitalizada y recibió tratamiento antes de pasar por hogar temporal; después fue adoptada.',
  bruno: 'Bruno fue rescatado en Catemu. No tenemos un expediente clínico largo, pero sí evidencia de esterilización y señales de ceguera en fotos posteriores; después fue adoptado.',
  avena: 'Avena llegó desde Talca. La planilla registra miedo extremo, trazodona por cinco días y recomendación de evaluación con etólogo; después pasó por hogar temporal y fue adoptada.',
};

function sanitizeBaseName(filePath) {
  return path.parse(filePath).name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeSquareVariant(sourcePath, destinationPath, size) {
  await sharp(sourcePath)
    .rotate()
    .resize(size, size, {
      fit: 'cover',
      position: sharp.strategy.attention,
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(destinationPath);
}

async function writeLightboxVariant(sourcePath, destinationPath) {
  await sharp(sourcePath)
    .rotate()
    .resize({
      width: LIGHTBOX_SIZE,
      height: LIGHTBOX_SIZE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toFile(destinationPath);
}

function buildSitePhoto(caseId, photoPath) {
  const baseName = sanitizeBaseName(photoPath);
  const baseUrl = `/casos/site/${caseId}/${baseName}`;

  return {
    source: `/casos/${photoPath}`,
    card_mobile: `${baseUrl}-mobile.webp`,
    card_desktop: `${baseUrl}-desktop.webp`,
    lightbox: `${baseUrl}-lightbox.webp`,
  };
}

function isTransformablePhoto(photoPath) {
  return /\.(jpe?g|png)$/i.test(photoPath);
}

function validateStoryLengths() {
  const tooLong = Object.entries(SITE_STORIES).filter(([, story]) => story.length > 240);
  if (tooLong.length > 0) {
    const details = tooLong.map(([id, story]) => `${id}:${story.length}`).join(', ');
    throw new Error(`historia_breve_site exceeds 240 characters: ${details}`);
  }
}

function normalizePhotos(entry) {
  if (entry.id === 'bolt') {
    return BOLT_PHOTOS;
  }

  return entry.selected_photos;
}

async function generateAssets(entries) {
  for (const entry of entries) {
    const caseOutputDir = path.join(outputRoot, entry.id);
    await ensureDir(caseOutputDir);

    for (const photo of entry.site_photos.map((sitePhoto) => sitePhoto.source.replace('/casos/', ''))) {
      const sourcePath = path.join(repoRoot, 'public', 'casos', photo);
      const sourceExists = await fs.access(sourcePath).then(() => true).catch(() => false);

      if (!sourceExists) {
        throw new Error(`Missing source image: ${photo}`);
      }

      const baseName = sanitizeBaseName(photo);
      const mobilePath = path.join(caseOutputDir, `${baseName}-mobile.webp`);
      const desktopPath = path.join(caseOutputDir, `${baseName}-desktop.webp`);
      const lightboxPath = path.join(caseOutputDir, `${baseName}-lightbox.webp`);

      await writeSquareVariant(sourcePath, mobilePath, CARD_SIZES.mobile);
      await writeSquareVariant(sourcePath, desktopPath, CARD_SIZES.desktop);
      await writeLightboxVariant(sourcePath, lightboxPath);
    }
  }
}

function enrichEntries(entries) {
  return entries.map((entry) => {
    const historiaBreveSite = SITE_STORIES[entry.id];

    if (!historiaBreveSite) {
      throw new Error(`Missing historia_breve_site for ${entry.id}`);
    }

    const selectedPhotos = normalizePhotos(entry);
    const sitePhotos = selectedPhotos
      .filter((photoPath) => isTransformablePhoto(photoPath))
      .map((photoPath) => buildSitePhoto(entry.id, photoPath));

    if (sitePhotos.length === 0) {
      throw new Error(`No transformable site photos available for ${entry.id}`);
    }

    return {
      id: entry.id,
      nombre_publico: entry.nombre_publico,
      aliases: entry.aliases,
      source_folders: entry.source_folders,
      spreadsheet_match: entry.spreadsheet_match,
      estado: entry.estado,
      sexo: entry.sexo,
      fecha_rescate: entry.fecha_rescate,
      edad: entry.edad,
      tamano: entry.tamano,
      esterilizado: entry.esterilizado,
      vacunas: entry.vacunas,
      chip: entry.chip,
      compatibilidad_perros: entry.compatibilidad_perros,
      compatibilidad_gatos: entry.compatibilidad_gatos,
      tutor: entry.tutor,
      descripcion_fisica: entry.descripcion_fisica,
      descripcion_confianza: entry.descripcion_confianza,
      historia_breve: entry.historia_breve,
      historia_breve_site: historiaBreveSite,
      medical_summary: entry.medical_summary,
      medical_files: entry.medical_files,
      selected_photos: selectedPhotos,
      site_photos: sitePhotos,
      other_media_counts: entry.other_media_counts,
      confidence_notes: entry.confidence_notes,
    };
  });
}

async function main() {
  validateStoryLengths();

  const raw = await fs.readFile(jsonPath, 'utf8');
  const entries = JSON.parse(raw);
  const enrichedEntries = enrichEntries(entries);

  await generateAssets(enrichedEntries);
  await fs.writeFile(jsonPath, `${JSON.stringify(enrichedEntries, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
