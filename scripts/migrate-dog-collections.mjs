#!/usr/bin/env node
// Migrates the legacy `adoption-dogs` and `success-dogs` collections into the
// unified `dogs` collection (task 02 of the dog-collection unification plan).
//
// For every dog it:
//   1. inserts `status: "adopcion"` or `status: "exito"` after the `name:` line,
//   2. rewrites gallery paths from `../../assets/casos/(adopcion|exito)/<slug>/`
//      to `../../assets/casos/<slug>/`,
//   3. moves the markdown file to `src/content/dogs/<slug>.md` via `git mv`,
//   4. moves the asset folder to `src/assets/casos/<slug>` via `git mv`.
//
// The transformation is intentionally textual (regex-based): the repo has no
// YAML parser dependency, so frontmatter is rewritten conservatively and any
// unexpected shape fails loudly instead of being silently dropped.
//
// Usage:
//   node scripts/migrate-dog-collections.mjs --dry-run   # print plan, change nothing
//   node scripts/migrate-dog-collections.mjs             # apply the migration

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const LEGACY_COLLECTIONS = [
  { status: "adopcion", contentDir: "src/content/adoption-dogs", assetDir: "src/assets/casos/adopcion" },
  { status: "exito", contentDir: "src/content/success-dogs", assetDir: "src/assets/casos/exito" },
];
const DOGS_CONTENT_DIR = "src/content/dogs";
const DOGS_ASSET_DIR = "src/assets/casos";

const EXPECTED_KEYS = {
  adopcion: new Set([
    "name",
    "sex",
    "age",
    "weight",
    "details",
    "location",
    "currentNeed",
    "characterSketch",
    "instagramUrl",
    "order",
    "gallery",
    "active",
    "hiddenSince",
    "hiddenReason",
  ]),
  exito: new Set(["name", "story", "instagramUrl", "gallery"]),
};

const errors = [];

function fail(message) {
  errors.push(message);
}

function parseFrontmatter(filePath, status) {
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    fail(`${filePath}: missing or malformed frontmatter block`);
    return null;
  }
  const keys = [...match[1].matchAll(/^([A-Za-z][A-Za-z0-9]*):/gm)].map((m) => m[1]);
  const unexpected = keys.filter((key) => !EXPECTED_KEYS[status].has(key));
  if (unexpected.length > 0) {
    fail(`${filePath}: unexpected frontmatter keys for status "${status}": ${unexpected.join(", ")}`);
  }
  if (!/^name:/m.test(match[1])) {
    fail(`${filePath}: frontmatter is missing the required "name" key`);
  }
  return { source, frontmatter: match[1] };
}

function extractGalleryPaths(frontmatter, filePath) {
  const galleryMatch = frontmatter.match(/^gallery:\s*\r?\n((?:[ \t]+-.*\r?\n?)+)/m);
  if (!galleryMatch) {
    return [];
  }
  return [...galleryMatch[1].matchAll(/^[ \t]+-[ \t]+["']?([^\s"']+)["']?[ \t]*$/gm)].map((m) => {
    const galleryPath = m[1];
    if (!galleryPath.startsWith("../../assets/casos/")) {
      fail(`${filePath}: gallery path does not point at src/assets/casos: ${galleryPath}`);
    }
    return galleryPath;
  });
}

function planDog(status, contentDir, assetDir, fileName) {
  const slug = fileName.replace(/\.md$/, "");
  const contentPath = path.join(root, contentDir, fileName);
  const parsed = parseFrontmatter(contentPath, status);
  if (!parsed) {
    return null;
  }

  const galleryPaths = extractGalleryPaths(parsed.frontmatter, contentPath);
  const expectedPrefix = `../../assets/casos/${status === "adopcion" ? "adopcion" : "exito"}/${slug}/`;
  for (const galleryPath of galleryPaths) {
    if (!galleryPath.startsWith(expectedPrefix)) {
      fail(`${contentPath}: gallery path does not match the dog's asset folder: ${galleryPath}`);
    } else if (!existsSync(path.resolve(path.dirname(contentPath), galleryPath))) {
      fail(`${contentPath}: gallery image not found on disk: ${galleryPath}`);
    }
  }

  const assetSource = path.join(root, assetDir, slug);
  const hasAssetFolder = existsSync(assetSource);
  if (galleryPaths.length > 0 && !hasAssetFolder) {
    fail(`${contentPath}: gallery references missing asset folder ${assetDir}/${slug}`);
  }

  let rewritten = parsed.source.replace(/^name:.*$/m, (line) => `${line}\nstatus: "${status}"`);
  rewritten = rewritten.replaceAll(
    `../../assets/casos/${status === "adopcion" ? "adopcion" : "exito"}/${slug}/`,
    `../../assets/casos/${slug}/`
  );

  return {
    slug,
    status,
    contentFrom: `${contentDir}/${fileName}`,
    contentTo: `${DOGS_CONTENT_DIR}/${fileName}`,
    rewritten,
    assetFrom: hasAssetFolder ? `${assetDir}/${slug}` : null,
    assetTo: hasAssetFolder ? `${DOGS_ASSET_DIR}/${slug}` : null,
    galleryRewrites: galleryPaths.length,
  };
}

const plans = [];
const slugs = new Map();

for (const legacy of LEGACY_COLLECTIONS) {
  const dir = path.join(root, legacy.contentDir);
  const files = readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort();
  for (const file of files) {
    const plan = planDog(legacy.status, legacy.contentDir, legacy.assetDir, file);
    if (!plan) {
      continue;
    }
    if (slugs.has(plan.slug)) {
      fail(`duplicate slug "${plan.slug}" in ${slugs.get(plan.slug)} and ${plan.contentFrom}`);
    }
    slugs.set(plan.slug, plan.contentFrom);
    plans.push(plan);
  }
}

if (errors.length > 0) {
  console.error("Migration aborted due to validation errors:");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const adopcionCount = plans.filter((plan) => plan.status === "adopcion").length;
const exitoCount = plans.filter((plan) => plan.status === "exito").length;

for (const plan of plans) {
  console.log(`[${plan.status}] ${plan.slug}`);
  console.log(`  insert status: "${plan.status}" after name:`);
  if (plan.galleryRewrites > 0) {
    console.log(`  rewrite ${plan.galleryRewrites} gallery path(s) to ../../assets/casos/${plan.slug}/`);
  }
  console.log(`  git mv ${plan.contentFrom} ${plan.contentTo}`);
  if (plan.assetFrom) {
    console.log(`  git mv ${plan.assetFrom} ${plan.assetTo}`);
  }
}

console.log(
  `Planned migration for ${plans.length} dogs (${adopcionCount} adopcion, ${exitoCount} exito): ` +
    `${plans.length} content moves, ${plans.filter((plan) => plan.assetFrom).length} asset moves.`
);

if (dryRun) {
  console.log("Dry run: no changes made.");
  process.exit(0);
}

mkdirSync(path.join(root, DOGS_CONTENT_DIR), { recursive: true });

for (const plan of plans) {
  execFileSync("git", ["mv", plan.contentFrom, plan.contentTo], { cwd: root, stdio: "inherit" });
  writeFileSync(path.join(root, plan.contentTo), plan.rewritten, "utf8");
  if (plan.assetFrom) {
    execFileSync("git", ["mv", plan.assetFrom, plan.assetTo], { cwd: root, stdio: "inherit" });
  }
}

console.log(`Migration applied for ${plans.length} dogs.`);
