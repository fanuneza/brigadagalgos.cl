import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

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

describe("source hygiene", () => {
  it("keeps analytics behind consent instead of direct GA4 loading", () => {
    for (const file of [...textFilesIn(join(root, "src")), ...textFilesIn(join(root, "public"))]) {
      const source = readFileSync(file, "utf8");
      expect(source, relative(root, file)).not.toContain("gtag/js");
      expect(source, relative(root, file)).not.toContain("google-analytics.com/gtag");
    }
  });

  it("uses first-party cookie consent instead of localStorage", () => {
    const analyticsSource = readFileSync(join(root, "src", "scripts", "cookie-consent.ts"), "utf8");

    expect(analyticsSource).toContain("document.cookie");
    expect(analyticsSource).toContain("SameSite=Lax");
    expect(analyticsSource).not.toContain("localStorage");
  });

  it("does not ship placeholder values", () => {
    const files = [...textFilesIn(join(root, "src")), ...textFilesIn(join(root, "public"))];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, relative(root, file)).not.toContain("REPLACE_WITH_");
    }
  });

  it("vendors FontAwesome Free icons locally when icons are used", () => {
    const vendorDir = join(root, "public", "vendor", "fontawesome");
    if (!existsSync(vendorDir)) return;

    const sprite = readFileSync(join(vendorDir, "icons.svg"), "utf8");
    const license = readFileSync(join(vendorDir, "LICENSE.txt"), "utf8");

    expect(sprite).toContain("Font Awesome Free");
    expect(license).toContain("Font Awesome Free");
  });
});
