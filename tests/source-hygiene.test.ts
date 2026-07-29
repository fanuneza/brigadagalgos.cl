import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

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

  it("keeps the CSP strict with the required analytics and form allowances", () => {
    const headers = readFileSync(join(root, "public", "_headers"), "utf8");
    const csp = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1] ?? "";
    expect(csp, "public/_headers is missing a Content-Security-Policy").not.toBe("");

    const directives = Object.fromEntries(
      csp
        .split(";")
        .map((directive) => directive.trim())
        .filter(Boolean)
        .map((directive) => {
          const [name, ...values] = directive.split(/\s+/);
          return [name, values];
        })
    ) as Record<string, string[]>;

    expect(directives["default-src"]).toEqual(["'self'"]);
    expect(directives["object-src"]).toEqual(["'none'"]);
    expect(directives["script-src-attr"]).toEqual(["'none'"]);

    for (const source of ["'self'", "https://www.googletagmanager.com", "https://static.cloudflareinsights.com"]) {
      expect(directives["script-src"], `script-src must allow ${source}`).toContain(source);
      expect(directives["script-src-elem"], `script-src-elem must allow ${source}`).toContain(source);
    }
    expect(directives["script-src"]).not.toContain("'unsafe-inline'");
    expect(directives["script-src-elem"]).toContain("'unsafe-inline'");

    for (const source of [
      "https://api.web3forms.com",
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com",
      "https://analytics.google.com",
      "https://www.googletagmanager.com",
      "https://stats.g.doubleclick.net",
      "https://cloudflareinsights.com",
      "https://static.cloudflareinsights.com",
    ]) {
      expect(directives["connect-src"], `connect-src must allow ${source}`).toContain(source);
    }

    for (const source of [
      "'self'",
      "data:",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://stats.g.doubleclick.net",
    ]) {
      expect(directives["img-src"], `img-src must allow ${source}`).toContain(source);
    }

    expect(directives["frame-src"]).toContain("https://www.googletagmanager.com");

    // GA4 must only ever arrive through GTM, never as a direct gtag.js allowance.
    expect(csp).not.toContain("gtag.js");
    expect(csp).not.toContain("gtag/js");
    expect(csp).not.toContain("*");
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

  it("does not hardcode absolute filesystem paths", () => {
    const rootMarkdown = readdirSync(root)
      .filter((entry) => entry.endsWith(".md") && statSync(join(root, entry)).isFile())
      .map((entry) => join(root, entry));
    const files = [
      ...textFilesIn(join(root, "src")),
      ...textFilesIn(join(root, "public")),
      ...textFilesIn(join(root, "scripts")),
      ...textFilesIn(join(root, "tests")),
      ...rootMarkdown,
    ];

    const absolutePathPattern = /(?:\/home|\/Users)\/[A-Za-z0-9._-]+|[A-Za-z]:[\\/]Users[\\/]/;

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, relative(root, file)).not.toMatch(absolutePathPattern);
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

  it("redirects every retired or hidden adoption profile to the success archive", () => {
    const redirects = readFileSync(join(root, "public", "_redirects"), "utf8");
    const adoptionDogsDir = join(root, "src", "content", "adoption-dogs");
    const files = readdirSync(adoptionDogsDir).filter((file) => file.endsWith(".md"));

    const activeSlugs: string[] = [];
    const hiddenSlugs: string[] = [];

    for (const file of files) {
      const content = readFileSync(join(adoptionDogsDir, file), "utf8");
      const slug = basename(file, ".md");

      if (/^active:\s*false/m.test(content)) {
        hiddenSlugs.push(slug);
      } else {
        activeSlugs.push(slug);
      }
    }

    // Slugs that once had an /adoptar/<slug>/ page and were moved to success-dogs
    // live only in git history. On shallow clones the history is unavailable and
    // the rule degrades to currently hidden dogs only.
    let retiredSlugs: string[] = [];
    try {
      retiredSlugs = execSync('git log --diff-filter=D --name-only --format= -- "src/content/adoption-dogs/"', {
        encoding: "utf8",
      })
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.endsWith(".md"))
        .map((line) => basename(line, ".md"));
    } catch {
      retiredSlugs = [];
    }

    for (const slug of new Set([...retiredSlugs, ...hiddenSlugs])) {
      expect(redirects, `missing redirect for retired profile /adoptar/${slug}/`).toContain(
        `/adoptar/${slug}/ /casos-de-exito/ 301`
      );
    }

    for (const slug of activeSlugs) {
      expect(redirects, `active profile /adoptar/${slug}/ must not be redirected`).not.toContain(`/adoptar/${slug}/`);
    }
  });
});
