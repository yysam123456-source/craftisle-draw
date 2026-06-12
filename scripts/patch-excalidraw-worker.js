#!/usr/bin/env node
/**
 * Build a self-contained Excalidraw subset worker bundle.
 *
 * Saves the bundled worker code to .next/worker-bundle.js so the
 * /api/excalidraw-worker route can serve it.
 *
 * The bundle is loaded client-side, converted to a Blob URL, and
 * passed to Excalidraw's Worker constructor — bypassing Cloudflare's
 * CSP "worker-src blob:" restriction.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, ".next");
const OUT_FILE = path.join(OUT_DIR, "worker-bundle.js");

function buildWorkerBundle() {
  const files = [
    "chunk-SRAX5OIU.js",
    "chunk-ZUYEQ4TG.js",
    "chunk-EIO257PC.js",
    "subset-worker.chunk.js",
  ];

  let code = "";

  // File 1: chunk-SRAX5OIU.js — exports {f as a, g as b, h as c, i as d}
  let f1 = fs.readFileSync(path.join(PUBLIC_DIR, files[0]), "utf-8");
  f1 = f1.replace(/export\{[^}]*\}/, "var __SRAX5OIU={a:f,b:g,c:h,d:i}");
  code += f1 + "\n";

  // File 2: chunk-ZUYEQ4TG.js — side effects only (env config)
  code += fs.readFileSync(path.join(PUBLIC_DIR, files[1]), "utf-8") + "\n";

  // File 3: chunk-EIO257PC.js (the big one with WASM)
  //     import{a as Qg}from"./chunk-SRAX5OIU.js" → var Qg=__SRAX5OIU.a
  //     export{CB as a,QB as b,NQ as c,AI as d}  → var __EIO257PC=...
  let f3 = fs.readFileSync(path.join(PUBLIC_DIR, files[2]), "utf-8");
  f3 = f3.replace(
    /import\{a as Qg\}from"\.\/chunk-SRAX5OIU\.js"/,
    "var Qg=__SRAX5OIU.a"
  );
  f3 = f3.replace(
    /export\{CB as a,QB as b,NQ as c,AI as d\}/,
    "var __EIO257PC={a:CB,b:QB,c:NQ,d:AI}"
  );
  code += f3 + "\n";

  // File 4: subset-worker.chunk.js
  //     import{a as r,c as t}from"./chunk-EIO257PC.js" → var r=__EIO257PC.a;var t=__EIO257PC.c
  //     import"./..." side effects → remove
  //     export{s as WorkerUrl} → remove
  let f4 = fs.readFileSync(path.join(PUBLIC_DIR, files[3]), "utf-8");
  f4 = f4.replace(
    /import\{a as r,c as t\}from"\.\/chunk-EIO257PC\.js"/,
    "var r=__EIO257PC.a;var t=__EIO257PC.c"
  );
  f4 = f4.replace(/import"\.\/chunk-ZUYEQ4TG\.js";?/, "");
  f4 = f4.replace(/import"\.\/chunk-SRAX5OIU\.js";?/, "");
  f4 = f4.replace(/export\{s as WorkerUrl\};?/, "");
  code += f4 + "\n";

  return code;
}

const bundle = buildWorkerBundle();
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, bundle, "utf-8");
console.log(`[patch-worker] Worker bundle written to ${OUT_FILE} (${bundle.length} bytes)`);

// Also patch the built chunk to use the Blob URL
const CHUNKS_DIR = path.join(ROOT, ".next", "static", "chunks");
if (fs.existsSync(CHUNKS_DIR)) {
  const glob = require("glob");
  const files = glob.sync(`${CHUNKS_DIR}/**/*.js`);
  let patched = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, "utf-8");

    // Replace file:// URL
    if (/file:\/\/.*subset-worker\.chunk\.js/.test(content)) {
      content = content.replace(
        /`file:\/\/\$\{[^}]*node_modules\/@excalidraw\/excalidraw\/dist\/prod\/subset-worker\.chunk\.js[^}`]*\}`/g,
        "window.__EXCALIDRAW_WORKER_BLOB_URL__"
      );
      patched++;
    }

    // Replace previously patched static URL
    if (content.includes('"/subset-worker.chunk.js"')) {
      content = content.replace(
        /"\/subset-worker\.chunk\.js"/g,
        "window.__EXCALIDRAW_WORKER_BLOB_URL__"
      );
      if (!patched) patched++;
    }

    fs.writeFileSync(file, content, "utf-8");
  }

  if (patched > 0) {
    console.log(`[patch-worker] Patched worker URL in ${patched} chunk(s).`);
  } else {
    console.log("[patch-worker] WARNING: No chunk patched.");
  }
}

console.log("[patch-worker] Done.");
