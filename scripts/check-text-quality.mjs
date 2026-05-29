import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["src", "docs", "public", "tests", "scripts"];
const extensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".md",
  ".mjs",
  ".ts",
  ".txt",
  ".yml",
  ".yaml",
]);
const ignoredDirectories = new Set([
  "node_modules",
  "dist",
  ".astro",
  ".cache",
  ".git",
  ".lighthouseci",
  "playwright-report",
]);
const mojibakePatterns = [/\u00c3/, /\u00c2/, /\u00e2[\u0080-\u009d]/, /\ufffd/];

const failures = [];

async function walk(directory) {
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await walk(path);
      continue;
    }

    if (!extensions.has(extname(entry.name))) continue;

    const text = await readFile(path, "utf8");
    for (const pattern of mojibakePatterns) {
      if (pattern.test(text)) {
        failures.push(path);
        break;
      }
    }
  }
}

for (const root of roots) {
  await walk(root);
}

if (failures.length > 0) {
  console.error("Mojibake or replacement characters found:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
