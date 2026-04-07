import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");
const assetsDir = path.join(rootDir, "assets");
const distDir = path.join(rootDir, "dist");

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function copySourceTree() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  ensureDirectory(distDir);
  fs.cpSync(assetsDir, path.join(distDir, "assets"), { recursive: true });
}

function rewriteHtmlForPublish(content) {
  return content
    .replaceAll('../assets/', 'assets/')
    .replace('data-asset-root="../assets/"', 'data-asset-root="assets/"');
}

function publishHtmlShells() {
  const htmlFiles = fs.readdirSync(siteDir).filter((fileName) => fileName.endsWith(".html"));

  htmlFiles.forEach((fileName) => {
    const sourcePath = path.join(siteDir, fileName);
    const targetPath = path.join(distDir, fileName);
    const html = fs.readFileSync(sourcePath, "utf8");
    fs.writeFileSync(targetPath, rewriteHtmlForPublish(html), "utf8");
  });
}

function writeStaticPublishMarkers() {
  fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf8");
}

copySourceTree();
publishHtmlShells();
writeStaticPublishMarkers();

console.log("Built static publish artifact in dist/.");
