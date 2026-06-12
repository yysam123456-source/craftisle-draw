#!/usr/bin/env node
/**
 * Post-build script: patches Excalidraw's worker URL.
 *
 * Problem: Turbopack builds the worker URL as a file:// URL which doesn't
 * work in the browser. The actual worker chunks are copied to public/.
 *
 * Solution: Replace the file:// URL with the correct public path.
 */
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const chunksDir = path.join(__dirname, "..", ".next", "static", "chunks");

if (!fs.existsSync(chunksDir)) {
  console.error("[patch-worker] .next/static/chunks not found. Run `next build` first.");
  process.exit(1);
}

const files = glob.sync(`${chunksDir}/**/*.js`);
let patched = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  // Match the Turbopack-generated file:// URL pattern for the subset worker
  const pattern = /file:\/\/.*?node_modules\/@excalidraw\/excalidraw\/dist\/prod\/subset-worker\.chunk\.js/;
  if (pattern.test(content)) {
    // Replace the entire template literal with the correct public path
    content = content.replace(
      /`file:\/\/\$\{.*?node_modules\/@excalidraw\/excalidraw\/dist\/prod\/subset-worker\.chunk\.js[^}`]*\}`/,
      "\"/subset-worker.chunk.js\""
    );
    fs.writeFileSync(file, content, "utf-8");
    patched++;
    console.log(`[patch-worker] Patched: ${path.basename(file)}`);
  }
}

if (patched === 0) {
  console.log("[patch-worker] No worker URL found to patch. Build may have changed.");
} else {
  console.log(`[patch-worker] Done. Patched ${patched} file(s).`);
}
