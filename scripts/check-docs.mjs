import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();

const pathPrefixes = ["src/", "docs/", "scripts/", "tests/", "public/", ".github/"];
const problems = [];

function trackedMarkdownFiles() {
  const output = execFileSync("git", ["ls-files", "--", "*.md"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((file) => file.length > 0)
    .filter((file) => !file.includes("/") || file.startsWith("docs/"));
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function report(file, line, message) {
  problems.push(`${toPosix(file)}:${line}: ${message}`);
}

// Turns a backticked token into a repo-relative candidate path, or null when
// the token is not a path (enum values, CSS classes, npm commands, URLs,
// bare filenames like `Navbar.astro`).
function normalizePathToken(token) {
  if (/\s/.test(token)) return null;
  if (/^(https?:|mailto:|tel:|www\.)/i.test(token)) return null;

  if (!pathPrefixes.some((prefix) => token.startsWith(prefix))) return null;

  let candidate = token.replace(/[?#].*$/, "");
  const segments = candidate.split("/").filter((segment) => {
    if (segment === "" || segment === "*" || segment === "**") return false;
    if (segment.includes("*")) return false;
    // A placeholder segment reduced to a bare extension (e.g. `<slug>.md`).
    if (segment.includes("<") && /^<[^>]*>\.[a-z0-9]+$/i.test(segment)) return false;
    return true;
  });
  candidate = segments
    .map((segment) => segment.replace(/<[^>]*>/g, ""))
    .filter((segment) => segment !== "")
    .join("/")
    .replace(/\/+$/, "");
  if (candidate === "") return null;
  return candidate;
}

function checkBacktickPaths(file, text) {
  for (const match of text.matchAll(/`([^`\n]+)`/g)) {
    const token = match[1].trim();
    const candidate = normalizePathToken(token);
    if (candidate === null) continue;
    if (!existsSync(path.join(repoRoot, candidate))) {
      report(file, lineOf(text, match.index), `backticked path does not exist: \`${token}\``);
    }
  }
}

// GitHub-style heading anchors: lowercase, punctuation stripped, spaces to hyphens.
function anchorize(heading) {
  return heading
    .trim()
    .replace(/`([^`]*)`/g, "$1")
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
}

const headingAnchorsCache = new Map();
function headingAnchors(absolutePath) {
  if (!headingAnchorsCache.has(absolutePath)) {
    const anchors = new Set();
    const targetText = readFileSync(absolutePath, "utf8");
    for (const match of targetText.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
      anchors.add(anchorize(match[1]));
    }
    headingAnchorsCache.set(absolutePath, anchors);
  }
  return headingAnchorsCache.get(absolutePath);
}

function checkMarkdownLinks(file, text) {
  for (const match of text.matchAll(/\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const rawTarget = match[2];
    if (/^(https?:|mailto:|tel:)/i.test(rawTarget)) continue;
    if (rawTarget.startsWith("#")) continue; // pure-fragment link within the same file

    const hashIndex = rawTarget.indexOf("#");
    const targetPath = hashIndex === -1 ? rawTarget : rawTarget.slice(0, hashIndex);
    const anchor = hashIndex === -1 ? null : rawTarget.slice(hashIndex + 1);

    let decoded = targetPath;
    try {
      decoded = decodeURIComponent(targetPath);
    } catch {
      // Leave undecodable targets as-is; existence check will report them.
    }

    const absoluteTarget = path.resolve(repoRoot, path.dirname(file), decoded);
    if (!existsSync(absoluteTarget)) {
      report(file, lineOf(text, match.index), `link target does not resolve: ${rawTarget}`);
      continue;
    }

    if (anchor !== null && anchor !== "" && decoded.toLowerCase().endsWith(".md")) {
      const anchors = headingAnchors(absoluteTarget);
      let decodedAnchor = anchor;
      try {
        decodedAnchor = decodeURIComponent(anchor);
      } catch {
        // Keep the raw anchor.
      }
      if (!anchors.has(anchorize(decodedAnchor))) {
        report(file, lineOf(text, match.index), `link anchor not found in target: ${rawTarget}`);
      }
    }
  }
}

const files = trackedMarkdownFiles();
for (const file of files) {
  const text = readFileSync(path.join(repoRoot, file), "utf8");
  checkBacktickPaths(file, text);
  checkMarkdownLinks(file, text);
}

if (problems.length > 0) {
  console.error(`Documentation check failed with ${problems.length} issue(s):`);
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.warn(`Documentation check passed (${files.length} file(s)).`);
