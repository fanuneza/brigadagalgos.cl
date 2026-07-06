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

// Voice rules from docs/voice-and-tone.md: Chilean neutral tuteo, no voseo, never "encajar".
// Only applied under src/ so docs and tooling can quote counterexamples.
const voicePatterns = [
  {
    pattern: /[Ii]ntent\u00e1|[Rr]evis\u00e1|[Pp]od\u00e9s|[Qq]uer\u00e9s|[Tt]en\u00e9s|[Cc]ontanos|[Ee]scribinos|[Aa]poyanos/,
    label: "voseo (la voz del sitio usa tuteo chileno)",
  },
  {
    pattern: /\bencaj(?:a|an|e|en|ar|ar\u00eda)\b/i,
    label: 'verbo "encajar" prohibido por la gu\u00eda de voz',
  },
];

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
    if (path.startsWith("src")) {
      for (const { pattern, label } of voicePatterns) {
        if (pattern.test(text)) {
          failures.push(`${path} (${label})`);
          break;
        }
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
