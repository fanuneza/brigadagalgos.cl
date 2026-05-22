import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

sharp.cache(false);

const repoRoot = process.cwd();
const assetsRoot = path.join(repoRoot, "src", "assets", "casos");
const contentRoots = {
  adopcion: path.join(repoRoot, "src", "content", "adoption-dogs"),
  exito: path.join(repoRoot, "src", "content", "success-dogs"),
};
const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 82;

const mode = process.argv.includes("--write") ? "write" : "check";
const shouldWrite = mode === "write";
const problems = [];
const actions = [];
const warnings = [];

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function removeEmptyDirs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  if (dir !== assetsRoot) {
    const remaining = await fs.readdir(dir);
    if (remaining.length === 0) {
      await fs.rmdir(dir);
      actions.push(`Removed empty directory ${toPosix(path.relative(repoRoot, dir))}`);
    }
  }
}

async function unlinkWithRetry(filePath) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (error) {
      if (error?.code !== "EBUSY" || attempt === 7) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
}

function parseFrontmatter(filePath, raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing frontmatter in ${toPosix(path.relative(repoRoot, filePath))}`);
  }
  return { frontmatter: match[1], body: match[2] };
}

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|(.+))$`, "m"));
  if (!match) {
    return null;
  }
  return (match[1] ?? match[2] ?? match[3]).trim();
}

function readGallery(frontmatter) {
  const match = frontmatter.match(/^gallery:\r?\n((?:\s+- .*(?:\r?\n|$))+)/m);
  if (!match) {
    return [];
  }
  return [...match[1].matchAll(/^\s+-\s+(.+)$/gm)].map((item) => item[1].trim());
}

function replaceGallery(frontmatter, galleryPaths) {
  const gallery = `gallery:\n${galleryPaths.map((item) => `  - ${item}`).join("\n")}`;
  if (/^gallery:\r?\n(?:\s+- .*(?:\r?\n|$))+/m.test(frontmatter)) {
    return frontmatter.replace(/^gallery:\r?\n(?:\s+- .*(?:\r?\n|$))+/m, `${gallery}\n`);
  }
  return `${frontmatter.trimEnd()}\n${gallery}`;
}

async function readEntries(kind) {
  const dir = contentRoots[kind];
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith(".md")).sort();
  return files.map((file) => {
    const filePath = path.join(dir, file);
    return { kind, file, filePath };
  });
}

async function loadEntry(entry) {
  const raw = await fs.readFile(entry.filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(entry.filePath, raw);
  const currentSlug = path.basename(entry.file, ".md");
  const name = readScalar(frontmatter, "name");
  const canonicalSlug = entry.kind === "exito" ? slugify(name ?? currentSlug) : currentSlug;
  const gallery = readGallery(frontmatter);

  return {
    ...entry,
    raw,
    frontmatter,
    body,
    currentSlug,
    canonicalSlug,
    canonicalFilePath: path.join(contentRoots[entry.kind], `${canonicalSlug}.md`),
    gallery,
  };
}

function expectedGalleryPath(entry, index) {
  return `../../assets/casos/${entry.kind}/${entry.canonicalSlug}/${entry.canonicalSlug}-${String(index + 1).padStart(2, "0")}.jpg`;
}

function resolveGalleryPath(entry, galleryPath) {
  return path.resolve(path.dirname(entry.filePath), galleryPath);
}

async function normalizeImage(sourcePath, targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const tempPath = `${targetPath}.tmp-${Date.now()}.jpg`;
  await sharp(sourcePath, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .toColorspace("srgb")
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(tempPath);
  await fs.rename(tempPath, targetPath);
}

async function validateImage(targetPath) {
  if (!(await exists(targetPath))) {
    problems.push(`Missing image: ${toPosix(path.relative(repoRoot, targetPath))}`);
    return;
  }

  const metadata = await sharp(targetPath).metadata();
  if (metadata.format !== "jpeg") {
    problems.push(`Non-JPEG image: ${toPosix(path.relative(repoRoot, targetPath))}`);
  }

  if ((metadata.width ?? 0) > MAX_LONG_EDGE || (metadata.height ?? 0) > MAX_LONG_EDGE) {
    problems.push(
      `Image exceeds ${MAX_LONG_EDGE}px: ${toPosix(path.relative(repoRoot, targetPath))} (${metadata.width}x${metadata.height})`
    );
  }
}

async function processEntry(entry) {
  const expectedPaths = entry.gallery.map((_, index) => expectedGalleryPath(entry, index));
  const nextFrontmatter = replaceGallery(entry.frontmatter, expectedPaths);
  const nextRaw = `---\n${nextFrontmatter.trimEnd()}\n---\n${entry.body}`;

  if (entry.kind === "exito" && entry.filePath !== entry.canonicalFilePath) {
    if (shouldWrite) {
      await fs.writeFile(entry.canonicalFilePath, nextRaw);
      await fs.unlink(entry.filePath);
      actions.push(
        `Renamed ${toPosix(path.relative(repoRoot, entry.filePath))} -> ${toPosix(
          path.relative(repoRoot, entry.canonicalFilePath)
        )}`
      );
    } else {
      problems.push(
        `Success entry filename should be ${entry.canonicalSlug}.md: ${toPosix(path.relative(repoRoot, entry.filePath))}`
      );
    }
  } else if (entry.raw !== nextRaw) {
    if (shouldWrite) {
      await fs.writeFile(entry.filePath, nextRaw);
      actions.push(`Updated gallery paths in ${toPosix(path.relative(repoRoot, entry.filePath))}`);
    } else {
      problems.push(`Gallery paths are not canonical in ${toPosix(path.relative(repoRoot, entry.filePath))}`);
    }
  }

  const targetPaths = [];
  for (let index = 0; index < entry.gallery.length; index += 1) {
    const sourcePath = resolveGalleryPath(entry, entry.gallery[index]);
    const targetPath = path.join(
      assetsRoot,
      entry.kind,
      entry.canonicalSlug,
      `${entry.canonicalSlug}-${String(index + 1).padStart(2, "0")}.jpg`
    );
    targetPaths.push(targetPath);

    if (!(await exists(sourcePath))) {
      problems.push(`Referenced source does not exist: ${entry.gallery[index]} in ${entry.file}`);
      continue;
    }

    const sourceRel = toPosix(path.relative(repoRoot, sourcePath));
    const targetRel = toPosix(path.relative(repoRoot, targetPath));
    const needsMove = path.resolve(sourcePath) !== path.resolve(targetPath);
    const metadata = await sharp(sourcePath).metadata();
    const needsNormalize =
      metadata.format !== "jpeg" || (metadata.width ?? 0) > MAX_LONG_EDGE || (metadata.height ?? 0) > MAX_LONG_EDGE;

    if (shouldWrite) {
      await normalizeImage(sourcePath, targetPath);
      actions.push(`${needsMove ? "Moved" : "Normalized"} ${sourceRel} -> ${targetRel}`);
    } else if (needsMove || needsNormalize) {
      problems.push(`Image should be normalized to ${targetRel}`);
    }

    await validateImage(targetPath);
  }

  return targetPaths;
}

async function main() {
  const entries = [
    ...(await Promise.all((await readEntries("adopcion")).map(loadEntry))),
    ...(await Promise.all((await readEntries("exito")).map(loadEntry))),
  ];
  const keepFiles = new Set();

  for (const entry of entries) {
    const targetPaths = await processEntry(entry);
    for (const targetPath of targetPaths) {
      keepFiles.add(path.resolve(targetPath));
    }
  }

  const assetFiles = await listFiles(assetsRoot);
  if (shouldWrite) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  for (const file of assetFiles) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) {
      continue;
    }

    if (!keepFiles.has(path.resolve(file))) {
      const rel = toPosix(path.relative(repoRoot, file));
      if (shouldWrite) {
        try {
          await unlinkWithRetry(file);
          actions.push(`Removed stale dog image ${rel}`);
        } catch (error) {
          warnings.push(`Could not remove stale dog image ${rel}: ${error.message}`);
        }
      } else {
        problems.push(`Stale dog image: ${rel}`);
      }
    }
  }

  if (shouldWrite) {
    await removeEmptyDirs(assetsRoot);
  }

  if (problems.length > 0) {
    console.error(`Dog image ${mode} failed with ${problems.length} issue(s):`);
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exit(1);
  }

  if (shouldWrite) {
    console.log(`Dog image normalization complete (${actions.length} action(s)).`);
    for (const action of actions) {
      console.log(`- ${action}`);
    }
    for (const warning of warnings) {
      console.warn(`- Warning: ${warning}`);
    }
  } else {
    console.log("Dog image check passed.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
