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

  it("verifies temporarily hidden dogs have required tracking metadata and haven't expired", () => {
    const adoptionDogsDir = join(root, "src", "content", "adoption-dogs");
    const files = readdirSync(adoptionDogsDir).filter((file) => file.endsWith(".md"));

    const MAX_HIDDEN_DAYS = 90;
    const now = new Date();

    for (const file of files) {
      const filePath = join(adoptionDogsDir, file);
      const content = readFileSync(filePath, "utf8");

      const activeMatch = content.match(/^active:\s*(true|false)/m);
      const active = activeMatch ? activeMatch[1] === "true" : true;

      if (!active) {
        const hiddenSinceMatch = content.match(/^hiddenSince:\s*["']?([^"'\n\r]+)["']?/m);
        const hiddenReasonMatch = content.match(/^hiddenReason:\s*["']?([^"'\n\r]+)["']?/m);

        expect(hiddenSinceMatch, `${file} is marked inactive but has no hiddenSince date`).not.toBeNull();
        expect(hiddenReasonMatch, `${file} is marked inactive but has no hiddenReason`).not.toBeNull();

        const hiddenSinceStr = hiddenSinceMatch![1].trim();
        const hiddenReasonStr = hiddenReasonMatch![1].trim();

        expect(hiddenReasonStr.length, `${file} hiddenReason is empty`).toBeGreaterThan(0);

        const hiddenDate = new Date(hiddenSinceStr);
        expect(isNaN(hiddenDate.getTime()), `${file} has an invalid hiddenSince date: ${hiddenSinceStr}`).toBe(false);

        const diffDays = Math.ceil(Math.abs(now.getTime() - hiddenDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(
          diffDays,
          `${file} has been temporarily hidden for ${diffDays} days, which exceeds the limit of ${MAX_HIDDEN_DAYS} days. Please confirm their status.`
        ).toBeLessThanOrEqual(MAX_HIDDEN_DAYS);
      }
    }
  });

  it("keeps every success dog story at 260 characters or less and explicitly adopted", () => {
    const successDogsDir = join(root, "src", "content", "success-dogs");
    const files = readdirSync(successDogsDir).filter((file) => file.endsWith(".md"));

    for (const file of files) {
      const filePath = join(successDogsDir, file);
      const content = readFileSync(filePath, "utf8");
      const storyMatch = content.match(/^story:\s*"([^"]*)"/m);

      expect(storyMatch, `${file} has no story field`).not.toBeNull();

      const story = storyMatch![1];

      expect(story.length, `${file} story exceeds 260 characters`).toBeLessThanOrEqual(260);
      expect(story, `${file} story must mention the adoption outcome`).toMatch(/adopt/i);
    }
  });
});
