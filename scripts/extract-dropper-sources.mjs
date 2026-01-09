import fs from "node:fs";
import path from "node:path";

/**
 * Extracts original source files from CRA babel-loader cache JSONs.
 *
 * Why: The `DropperKIOSK-luka` folder appears to have lost its `src/` folder,
 * but CRA caches often include `sourcesContent`, which lets us recover code
 * before the folder is deleted.
 *
 * Usage:
 *   node scripts/extract-dropper-sources.mjs
 */

const workspaceRoot = process.cwd();
const dropperDir = path.join(workspaceRoot, "DropperKIOSK-luka");
const cacheDir = path.join(dropperDir, "node_modules", ".cache", "babel-loader");
const outDir = path.join(workspaceRoot, "dropper-extracted");

function safeMkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function toPosix(p) {
  return p.replaceAll("\\", "/");
}

function normalizeSourcePath(sourcePath) {
  const s = toPosix(sourcePath);

  // Common absolute prefixes we’ve seen in cache:
  // - C:/Users/.../DropperKIOSK-luka/src/...
  // - /app/src/... (docker)
  // - webpack:///src/... (rare)
  const idx = s.toLowerCase().lastIndexOf("/dropperkiosk-luka/");
  if (idx >= 0) return s.slice(idx + "/dropperkiosk-luka/".length);

  const srcIdx = s.toLowerCase().lastIndexOf("/src/");
  if (srcIdx >= 0) return s.slice(srcIdx + 1); // keep "src/..."

  const webpackIdx = s.toLowerCase().lastIndexOf("webpack:///");
  if (webpackIdx >= 0) return s.slice(webpackIdx + "webpack:///".length);

  return s.replace(/^\/+/, "");
}

function collectCacheFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".json"))
    .map((d) => path.join(dir, d.name));
}

function isNonEmptyString(x) {
  return typeof x === "string" && x.trim().length > 0;
}

// Keep the "best" content per file (some files may appear in multiple cache entries)
const bestByRelPath = new Map(); // relPath -> { content, sourcePath, fromCacheFile }

const cacheFiles = collectCacheFiles(cacheDir);
if (cacheFiles.length === 0) {
  console.error(`No babel-loader cache JSONs found at: ${cacheDir}`);
  process.exit(1);
}

for (const cacheFile of cacheFiles) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {
    continue;
  }

  const map = parsed?.map;
  const sources = Array.isArray(map?.sources) ? map.sources : [];
  const sourcesContent = Array.isArray(map?.sourcesContent) ? map.sourcesContent : [];
  if (sources.length === 0 || sourcesContent.length === 0) continue;

  const pairs = Math.min(sources.length, sourcesContent.length);
  for (let i = 0; i < pairs; i++) {
    const srcPath = sources[i];
    const content = sourcesContent[i];
    if (!isNonEmptyString(srcPath) || !isNonEmptyString(content)) continue;

    const rel = normalizeSourcePath(srcPath);
    if (!rel || rel.endsWith("/") || rel.includes("\0")) continue;

    const prev = bestByRelPath.get(rel);
    if (!prev || content.length > prev.content.length) {
      bestByRelPath.set(rel, { content, sourcePath: srcPath, fromCacheFile: cacheFile });
    }
  }
}

safeMkdirp(outDir);

let wrote = 0;
for (const [rel, info] of bestByRelPath.entries()) {
  const dest = path.join(outDir, ...rel.split("/"));
  safeMkdirp(path.dirname(dest));
  fs.writeFileSync(dest, info.content, "utf8");
  wrote++;
}

const summary = {
  cacheDir,
  outDir,
  cacheFilesScanned: cacheFiles.length,
  filesExtracted: wrote,
};

fs.writeFileSync(path.join(outDir, "extract-summary.json"), JSON.stringify(summary, null, 2), "utf8");
console.log("✅ Dropper sources extracted");
console.log(JSON.stringify(summary, null, 2));


