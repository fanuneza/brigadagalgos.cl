import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { expect, test } from "@playwright/test";

const root = process.cwd();
const textExtensions = new Set([".astro", ".css", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".txt"]);

function filesIn(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return filesIn(path);
    return path;
  });
}

function textFilesIn(directory: string) {
  return filesIn(directory).filter((file) => textExtensions.has(extname(file)));
}

test("source does not load direct GA4 scripts or placeholders", () => {
  for (const file of [...textFilesIn(join(root, "src")), ...textFilesIn(join(root, "public"))]) {
    const source = readFileSync(file, "utf8");
    expect(source, relative(root, file)).not.toContain("gtag/js");
    expect(source, relative(root, file)).not.toContain("google-analytics.com/gtag");
    expect(source, relative(root, file)).not.toContain("REPLACE_WITH_");
  }
});

test("cookie consent persists as a first-party SameSite cookie", () => {
  const source = readFileSync(join(root, "src", "scripts", "cookie-consent.ts"), "utf8");

  expect(source).toContain("document.cookie");
  expect(source).toContain("SameSite=Lax");
  expect(source).not.toContain("localStorage");
});
