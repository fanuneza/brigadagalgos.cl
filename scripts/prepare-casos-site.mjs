import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = process.cwd();
const publicCasosRoot = path.join(repoRoot, "public", "casos");
const successFeedPath = path.join(publicCasosRoot, "exito.json");
const adoptionFeedPath = path.join(publicCasosRoot, "adopcion.json");
const legacyFeedPath = path.join(publicCasosRoot, "index.json");
const externalFeedPath = path.join("C:", "Users", "fanun", "Desktop", "Fotos casos - Brigada", "output", "index.json");

const CARD_SIZES = {
  mobile: 318,
  desktop: 350,
};

const LIGHTBOX_SIZE = 1600;
const SUCCESS_STATES = new Set(["Adoptado", "Adoptada"]);
const ADOPTION_IDS = ["turron", "huayca", "foxy", "arepita", "loica", "olga"];
const MOVED_TO_ADOPTION = new Set(["huayca"]);

const SUCCESS_OVERRIDES = {
  fermin: {
    id: "fermin",
    nombre_publico: "Fermín",
    aliases: ["Fermín"],
    source_folders: ["docs/EXTRA-INFO.md"],
    spreadsheet_match: null,
    estado: "Adoptado",
    sexo: "Macho",
    fecha_rescate: null,
    edad: null,
    tamano: null,
    esterilizado: null,
    vacunas: null,
    chip: null,
    compatibilidad_perros: null,
    compatibilidad_gatos: null,
    tutor: null,
    descripcion_fisica: "Galgo macho de pelaje claro y mirada suave.",
    descripcion_confianza: "alta",
    historia_breve:
      "Lo abandonaron fracturado y muy herido en El Melón. Vecinos del sector le armaron una casita en la vereda hasta que pudimos rescatarlo.",
    historia_breve_site:
      "A Fermín lo dejaron fracturado y muy herido en El Melón. Vecinos le armaron una casita en la vereda para que aguantara hasta que llegáramos; hoy está adoptado y ya no tiene esa mirada triste.",
    medical_summary:
      "Llegó con lesiones graves y una fractura, luego pasó por recuperación y finalmente encontró familia.",
    medical_files: [],
    selected_photos: [
      "/casos/exito/fermin/fermin-01.jpg",
      "/casos/exito/fermin/fermin-02.jpg",
      "/casos/exito/fermin/fermin-03.jpg",
    ],
    other_media_counts: {},
    confidence_notes: ["Historia y fotos agregadas desde docs/EXTRA-INFO.md."],
  },
  leo: {
    id: "leo",
    nombre_publico: "Leo",
    aliases: ["Leo"],
    source_folders: ["docs/EXTRA-INFO.md"],
    spreadsheet_match: null,
    estado: "Adoptado",
    sexo: "Macho",
    fecha_rescate: null,
    edad: null,
    tamano: null,
    esterilizado: null,
    vacunas: null,
    chip: null,
    compatibilidad_perros: null,
    compatibilidad_gatos: null,
    tutor: null,
    descripcion_fisica: "Galgo macho de pelaje claro con expresion atenta.",
    descripcion_confianza: "alta",
    historia_breve:
      "Lo atropellaron en Lampa y quisieron eutanasiarlo por falta de recursos. Pasó por dos cirugías por una fractura en la espalda y hoy vive adoptado.",
    historia_breve_site:
      "Leo fue atropellado en Lampa y lo rescatamos cuando querían eutanasiarlo por falta de recursos. Pasó por dos cirugías por su fractura de espalda y hoy está adoptado; no camina, pero eso no le ha quitado las ganas de vivir bonito.",
    medical_summary:
      "Pasó por dos cirugías por una fractura en la espalda. No recuperó la marcha, pero sí estabilidad y una vida segura en familia.",
    medical_files: [],
    selected_photos: [
      "/casos/exito/leo/leo-01.jpg",
      "/casos/exito/leo/leo-02.jpg",
      "/casos/exito/leo/leo-03.jpg",
      "/casos/exito/leo/leo-04.jpg",
    ],
    other_media_counts: {},
    confidence_notes: ["Historia y fotos agregadas desde docs/EXTRA-INFO.md."],
  },
};

const ADOPTION_OVERRIDES = {
  turron: {
    name: "Turrón",
    age: "6 años aprox.",
    weight: "29,8 kg",
    details:
      "A Turrón lo arrojaron desde una camioneta en Isla de Maipo y quedó con una fractura que hubo que operar. Hoy está recuperado y listo para encontrar una familia tranquila.",
  },
  huayca: {
    name: "Huayca",
    age: "Edad por confirmar",
    weight: "Peso por confirmar",
    details:
      "A Huayca la rescatamos con apoyo de la PDI en Paine. Pasó por cirugía por piometra y varios exámenes, y ahora queremos encontrarle una familia paciente que respete su ritmo.",
  },
  foxy: {
    age: "7 años aprox.",
    weight: "Peso por confirmar",
    details:
      "Foxy llegó después de un rescate en el cerro El Carbón y hoy sigue en hogar temporal. Buscamos una familia tranquila para acompañar su recuperación y su tratamiento dental.",
  },
  arepita: {
    age: "Menor de 1 año",
    weight: "Peso por confirmar",
    details:
      "Arepita fue rescatada en Limache y pasó directo por clínica. Es una galga muy joven que sigue recuperándose mientras espera una familia comprometida.",
  },
  loica: {
    age: "Edad por confirmar",
    weight: "Peso por confirmar",
    details:
      "Loica llegó desde Maipú después de haber sido mamá hace pocos meses. Está en hogar temporal y buscamos una casa paciente para que siga ganando seguridad a su ritmo.",
  },
  olga: {
    age: "6 años aprox.",
    weight: "17 kg",
    details:
      "Olga fue rescatada en Curacaví con una herida grave en una patita y tuvo que pasar por amputación. Buscamos una familia muy tranquila y comprometida con su adaptación.",
  },
};

function isTransformablePhoto(filePath) {
  return /\.(jpe?g|png)$/i.test(filePath);
}

function sanitizeBaseName(filePath) {
  return path
    .parse(filePath)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function toPublicPath(filePath) {
  return `/${path.relative(path.join(repoRoot, "public"), filePath).replace(/\\/g, "/")}`;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeSquareVariant(sourcePath, destinationPath, size) {
  await sharp(sourcePath)
    .rotate()
    .resize(size, size, {
      fit: "cover",
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
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toFile(destinationPath);
}

async function migratePhotoToFolder(sourceRelativePath, destinationDir) {
  const sourceAbsolutePath = path.join(publicCasosRoot, sourceRelativePath.replace(/^\/?casos\//, ""));
  const fileName = path.basename(sourceRelativePath);
  const destinationAbsolutePath = path.join(destinationDir, fileName);

  if (!(await exists(sourceAbsolutePath))) {
    throw new Error(`Missing source image: ${sourceRelativePath}`);
  }

  await ensureDir(destinationDir);

  if (!(await exists(destinationAbsolutePath))) {
    await fs.copyFile(sourceAbsolutePath, destinationAbsolutePath);
  }

  return destinationAbsolutePath;
}

async function copyFileIfMissing(sourcePath, destinationPath) {
  await ensureDir(path.dirname(destinationPath));
  if (!(await exists(destinationPath))) {
    await fs.copyFile(sourcePath, destinationPath);
  }
}

async function generateVariantsForPhoto(photoAbsolutePath) {
  const baseName = sanitizeBaseName(photoAbsolutePath);
  const folder = path.dirname(photoAbsolutePath);
  const mobilePath = path.join(folder, `${baseName}-mobile.webp`);
  const desktopPath = path.join(folder, `${baseName}-desktop.webp`);
  const lightboxPath = path.join(folder, `${baseName}-lightbox.webp`);

  await writeSquareVariant(photoAbsolutePath, mobilePath, CARD_SIZES.mobile);
  await writeSquareVariant(photoAbsolutePath, desktopPath, CARD_SIZES.desktop);
  await writeLightboxVariant(photoAbsolutePath, lightboxPath);

  return {
    source: toPublicPath(photoAbsolutePath),
    card_mobile: toPublicPath(mobilePath),
    card_desktop: toPublicPath(desktopPath),
    lightbox: toPublicPath(lightboxPath),
  };
}

function validateStoryLengths(entries) {
  const tooLong = entries
    .filter((entry) => typeof entry.historia_breve_site === "string" && entry.historia_breve_site.length > 240)
    .map((entry) => `${entry.id}:${entry.historia_breve_site.length}`);

  if (tooLong.length > 0) {
    throw new Error(`historia_breve_site exceeds 240 characters: ${tooLong.join(", ")}`);
  }
}

function sortById(items) {
  return [...items].sort((a, b) => a.id.localeCompare(b.id, "es"));
}

function normalizeAge(rawAge, overrideAge) {
  if (overrideAge) {
    return overrideAge;
  }

  if (typeof rawAge !== "string") {
    return "Edad por confirmar";
  }

  const trimmed = rawAge.trim();
  if (!trimmed) {
    return "Edad por confirmar";
  }

  if (trimmed === "-1.0") {
    return "Menor de 1 año";
  }

  const numericAge = Number(trimmed.replace(",", "."));
  if (Number.isFinite(numericAge) && numericAge > 0) {
    const wholeAge = Number.isInteger(numericAge) ? String(numericAge) : trimmed.replace(".0", "");
    return `${wholeAge} años aprox.`;
  }

  return trimmed;
}

function normalizeWeight(entry, overrideWeight) {
  if (overrideWeight) {
    return overrideWeight;
  }

  const summary = [entry.medical_summary, entry.historia_breve_site, entry.historia_breve]
    .filter((value) => typeof value === "string")
    .join(" ");

  const match = summary.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  return match ? `${match[1].replace(".", ",")} kg` : "Peso por confirmar";
}

function normalizeDetails(entry, overrideDetails) {
  if (overrideDetails) {
    return overrideDetails;
  }

  const sourceText = [entry.historia_breve_site, entry.historia_breve, entry.medical_summary].find(
    (value) => typeof value === "string" && value.trim().length > 0
  );

  if (!sourceText) {
    return "Estamos preparando mejor su historia para presentarlo con más contexto.";
  }

  const compact = sourceText.trim().replace(/\s+/g, " ");
  if (compact.length <= 210) {
    return compact;
  }

  const slice = compact.slice(0, 207);
  const lastSentence = slice.lastIndexOf(". ");
  if (lastSentence >= 120) {
    return slice.slice(0, lastSentence + 1).trim();
  }

  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace).trim()}...`;
}

function adoptionNameFor(entry) {
  return ADOPTION_OVERRIDES[entry.id]?.name ?? entry.nombre_publico;
}

async function buildSuccessEntry(entry) {
  const targetDir = path.join(publicCasosRoot, "exito", entry.id);
  const legacySelected = Array.isArray(entry.selected_photos) ? entry.selected_photos : [];
  const sourcePhotos = legacySelected.filter((photoPath) => isTransformablePhoto(photoPath));

  if (sourcePhotos.length === 0) {
    throw new Error(`No transformable success photos available for ${entry.id}`);
  }

  const migratedPhotoPaths = [];
  for (const photoPath of sourcePhotos) {
    const migratedPath = await migratePhotoToFolder(photoPath, targetDir);
    migratedPhotoPaths.push(migratedPath);
  }

  const sitePhotos = [];
  for (const migratedPhotoPath of migratedPhotoPaths) {
    sitePhotos.push(await generateVariantsForPhoto(migratedPhotoPath));
  }

  return {
    ...entry,
    selected_photos: migratedPhotoPaths.map(toPublicPath),
    site_photos: sitePhotos,
  };
}

async function buildSuccessOverrides() {
  const entries = [];

  for (const entry of Object.values(SUCCESS_OVERRIDES)) {
    const targetDir = path.join(publicCasosRoot, "exito", entry.id);
    const selectedPhotos = [];
    const sitePhotos = [];

    for (const photoUrl of entry.selected_photos) {
      const photoAbsolutePath = path.join(repoRoot, "public", photoUrl.replace(/^\//, ""));
      if (!(await exists(photoAbsolutePath))) {
        throw new Error(`Missing override success photo: ${photoUrl}`);
      }

      selectedPhotos.push(toPublicPath(photoAbsolutePath));
      sitePhotos.push(await generateVariantsForPhoto(photoAbsolutePath));
    }

    entries.push({
      ...entry,
      selected_photos: selectedPhotos,
      site_photos: sitePhotos,
    });

    await ensureDir(targetDir);
  }

  return entries;
}

async function buildSuccessFeed() {
  const sourceFeedPath = (await exists(successFeedPath)) ? successFeedPath : legacyFeedPath;
  const legacyEntries = await readJson(sourceFeedPath);

  const migratedEntries = [];
  for (const entry of legacyEntries) {
    if (!SUCCESS_STATES.has(entry.estado) || MOVED_TO_ADOPTION.has(entry.id)) {
      continue;
    }

    migratedEntries.push(await buildSuccessEntry(entry));
  }

  const overriddenEntries = await buildSuccessOverrides();
  const deduped = new Map();

  [...migratedEntries, ...overriddenEntries].forEach((entry) => {
    deduped.set(entry.id, entry);
  });

  const finalEntries = sortById([...deduped.values()]);
  validateStoryLengths(finalEntries);
  return finalEntries;
}

async function buildGeneratedAdoptionPictures(id) {
  const targetDir = path.join(publicCasosRoot, "adopcion", id);
  const files = (await fs.readdir(targetDir))
    .filter((fileName) => isTransformablePhoto(fileName))
    .sort((a, b) => a.localeCompare(b, "es"));

  if (files.length === 0) {
    throw new Error(`No adoption photos found in ${targetDir}`);
  }

  const pictures = [];
  for (const fileName of files) {
    const absolutePath = path.join(targetDir, fileName);
    pictures.push(await generateVariantsForPhoto(absolutePath));
  }

  return pictures;
}

async function findExistingPhotoName(directory, baseName) {
  const candidates = [`${baseName}.jpg`, `${baseName}.jpeg`, `${baseName}.png`];

  for (const candidate of candidates) {
    if (await exists(path.join(directory, candidate))) {
      return candidate;
    }
  }

  return null;
}

async function buildCopiedPictureSetFromExistingVariants(id, sourceDir) {
  const destinationDir = path.join(publicCasosRoot, "adopcion", id);
  const pictures = [];

  const desktopFiles = (await fs.readdir(sourceDir))
    .filter((fileName) => fileName.endsWith("-desktop.webp"))
    .sort((a, b) => a.localeCompare(b, "es"));

  if (desktopFiles.length === 0) {
    throw new Error(`No prepared adoption assets found in ${sourceDir}`);
  }

  for (const desktopFile of desktopFiles) {
    const baseName = desktopFile.replace(/-desktop\.webp$/, "");
    const mobileFile = `${baseName}-mobile.webp`;
    const lightboxFile = `${baseName}-lightbox.webp`;
    const sourcePhotoName = await findExistingPhotoName(sourceDir, baseName);
    const sourcePhotoPath = sourcePhotoName ? path.join(sourceDir, sourcePhotoName) : null;
    const destinationPhotoPath = sourcePhotoName ? path.join(destinationDir, sourcePhotoName) : null;

    if (sourcePhotoPath && destinationPhotoPath) {
      await copyFileIfMissing(sourcePhotoPath, destinationPhotoPath);
    }
    await copyFileIfMissing(
      path.join(sourceDir, `${baseName}-mobile.webp`),
      path.join(destinationDir, `${baseName}-mobile.webp`)
    );
    await copyFileIfMissing(
      path.join(sourceDir, `${baseName}-desktop.webp`),
      path.join(destinationDir, `${baseName}-desktop.webp`)
    );
    await copyFileIfMissing(
      path.join(sourceDir, `${baseName}-lightbox.webp`),
      path.join(destinationDir, `${baseName}-lightbox.webp`)
    );

    pictures.push({
      source:
        sourcePhotoPath && destinationPhotoPath
          ? toPublicPath(destinationPhotoPath)
          : toPublicPath(path.join(destinationDir, `${baseName}-lightbox.webp`)),
      card_mobile: toPublicPath(path.join(destinationDir, `${baseName}-mobile.webp`)),
      card_desktop: toPublicPath(path.join(destinationDir, `${baseName}-desktop.webp`)),
      lightbox: toPublicPath(path.join(destinationDir, `${baseName}-lightbox.webp`)),
    });
  }

  return pictures;
}

async function buildCopiedPictureSetFromPreparedWebp(id, sourceDir) {
  const destinationDir = path.join(publicCasosRoot, "adopcion", id);
  const webpFiles = (await fs.readdir(sourceDir))
    .filter((fileName) => fileName.endsWith("-desktop.webp"))
    .sort((a, b) => a.localeCompare(b, "es"));

  if (webpFiles.length === 0) {
    throw new Error(`No prepared adoption webp files found in ${sourceDir}`);
  }

  const pictures = [];
  for (const desktopFile of webpFiles) {
    const baseName = desktopFile.replace(/-desktop\.webp$/, "");
    const mobileFile = `${baseName}-mobile.webp`;
    const lightboxFile = `${baseName}-lightbox.webp`;

    await copyFileIfMissing(path.join(sourceDir, desktopFile), path.join(destinationDir, desktopFile));
    await copyFileIfMissing(path.join(sourceDir, mobileFile), path.join(destinationDir, mobileFile));
    await copyFileIfMissing(path.join(sourceDir, lightboxFile), path.join(destinationDir, lightboxFile));

    pictures.push({
      source: toPublicPath(path.join(destinationDir, lightboxFile)),
      card_mobile: toPublicPath(path.join(destinationDir, mobileFile)),
      card_desktop: toPublicPath(path.join(destinationDir, desktopFile)),
      lightbox: toPublicPath(path.join(destinationDir, lightboxFile)),
    });
  }

  return pictures;
}

function normalizeAdoptionEntry(entry, pictures) {
  const override = ADOPTION_OVERRIDES[entry.id] ?? {};

  return {
    id: entry.id,
    name: adoptionNameFor(entry),
    sex: entry.sexo === "Hembra" ? "Hembra" : "Macho",
    age: normalizeAge(entry.edad, override.age),
    weight: normalizeWeight(entry, override.weight),
    details: normalizeDetails(entry, override.details),
    pictures,
  };
}

async function buildAdoptionFeed() {
  const successEntries = await readJson(successFeedPath);
  const externalEntries = await readJson(externalFeedPath);

  const successById = new Map(successEntries.map((entry) => [entry.id, entry]));
  const externalById = new Map(externalEntries.map((entry) => [entry.id, entry]));

  const records = [];
  for (const id of ADOPTION_IDS) {
    const record = successById.get(id) ?? externalById.get(id);
    if (!record) {
      throw new Error(`Missing adoption source entry for ${id}`);
    }

    let pictures;
    if (id === "huayca") {
      pictures = await buildCopiedPictureSetFromExistingVariants(id, path.join(publicCasosRoot, "exito", id));
    } else if (id === "foxy") {
      pictures = await buildCopiedPictureSetFromPreparedWebp(id, path.join(publicCasosRoot, "site", id));
    } else {
      pictures = await buildGeneratedAdoptionPictures(id);
    }

    records.push(normalizeAdoptionEntry(record, pictures));
  }

  return records;
}

async function removeLegacyTurronAssets() {
  const legacyPaths = [path.join(publicCasosRoot, "photos", "turron"), path.join(publicCasosRoot, "site", "turron")];

  for (const legacyPath of legacyPaths) {
    if (await exists(legacyPath)) {
      await fs.rm(legacyPath, { recursive: true, force: true });
    }
  }
}

async function main() {
  const successFeed = await buildSuccessFeed();
  await fs.writeFile(successFeedPath, `${JSON.stringify(successFeed, null, 2)}\n`, "utf8");

  const adoptionFeed = await buildAdoptionFeed();
  await fs.writeFile(adoptionFeedPath, `${JSON.stringify(adoptionFeed, null, 2)}\n`, "utf8");

  await removeLegacyTurronAssets();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
