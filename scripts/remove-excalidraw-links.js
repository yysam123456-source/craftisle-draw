#!/usr/bin/env node
/**
 * Patch Excalidraw bundles to remove unwanted UI sections:
 * 1. "Excalidraw links" (Socials) section in menu
 * 2. "Browse libraries" button in Library panel
 *
 * Uses EXACT string matching (not regex) for reliability.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const EXCALIDRAW_DIR = path.join(
  ROOT,
  "node_modules",
  "@excalidraw",
  "excalidraw",
  "dist"
);

function patchProdBundle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch] Skip (not found): ${path.relative(ROOT, filePath)}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalLen = content.length;
  let changes = [];

  // === 1. Remove "Excalidraw links" Group+Socials+Separator block ===
  const linksBlock = 'Z(ft.Group,{title:"Excalidraw links",children:Z(ft.DefaultItems.Socials,{})}),Z(ft.Separator,{}),';
  if (content.includes(linksBlock)) {
    content = content.split(linksBlock).join("");
    changes.push('Removed Excalidraw links block');
  }

  // === 2. Remove "Browse libraries" button (QI component + Uv usage) ===
  // Full QI definition from var QI= to Uv=QI;
  const qiFullStart = 'var QI=(';
  const qiFullEnd = '},Uv=QI;';
  const qiStartIdx = content.indexOf(qiFullStart);
  if (qiStartIdx >= 0) {
    const qiEndIdx = content.indexOf(qiFullEnd, qiStartIdx);
    if (qiEndIdx >= 0) {
      const fullDef = content.substring(qiStartIdx, qiEndIdx + qiFullEnd.length);
      // Replace entire QI+Uv with empty component
      content = content.split(fullDef).join("var QI=()=>null,Uv=QI;");
      changes.push(`Nullified BrowseLibrariesButton (removed ${fullDef.length} chars)`);
    }
  }

  // Also nullify the oS(Uv,{...}) call in Mc component
  const uvUsage = 'oS(Uv,{id:t,libraryReturnUrl:e,theme:o})';
  if (content.includes(uvUsage)) {
    content = content.split(uvUsage).join("null");
    changes.push('Removed BrowseLibrariesButton rendering call');
  }

  // === 3. Fallback string replacements ===
  const fallbackReplacements = [
    ['"Excalidraw links"', '""'],
    ['"Discord chat"', '""'],
    ['"Follow us"', '""'],
    ["https://discord.gg/UexuTaE", ""],
    ["https://github.com/excalidraw/excalidraw", ""],
    ["https://twitter.com/excalidraw", ""],
    ["https://x.com/excalidraw", ""],
  ];

  for (const [find, replace] of fallbackReplacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      changes.push(`Fallback: removed "${find}"`);
    }
  }

  // Save
  if (content.length !== originalLen) {
    fs.writeFileSync(filePath, content, "utf8");
    const saved = originalLen - content.length;
    console.log(`[patch] ✅ Patched ${path.relative(ROOT, filePath)} (-${saved} bytes)`);
    changes.forEach(c => console.log(`[patch]   • ${c}`));
    
    // Verify no syntax errors by checking basic JS validity
    try {
      new Function(content); // eslint-disable-line no-new-func
      console.log(`[patch]   • Syntax check passed`);
    } catch (e) {
      console.log(`[patch]   ⚠️  SYNTAX ERROR: ${e.message}`);
    }
    
    return true;
  } else {
    console.log(`[patch] ℹ️  No changes needed for ${path.relative(ROOT, filePath)}`);
    return false;
  }
}

function patchDevBundle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch] Skip (not found): ${path.relative(ROOT, filePath)}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalLen = content.length;
  let changes = [];

  // Dev bundle is multi-line — find and remove lines containing these patterns
  const lines = content.split("\n");
  let newLines = [];
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Remove "Excalidraw links" Group line + following Separator/Socials
    if (line.includes('"Excalidraw links"')) {
      skipNext = true;
      changes.push('Removed "Excalidraw links" line');
      continue;
    }
    if (skipNext && (line.includes("Separator") || line.includes("Socials"))) {
      skipNext = false;
      changes.push('Removed Separator/Socials line');
      continue;
    }

    // Remove BrowseLibrariesButton / library-menu-browse-button
    if (line.includes("library-menu-browse-button") ||
        (line.includes("VITE_APP_LIBRARY_URL") && line.includes("libraries")) ||
        line.includes("BrowseLibrariesButton") ||
        (line.includes('"libraries"') && line.includes("labels"))) {
      // Replace the return statement with return null
      let patched = line.replace(/return\s*\([^)]*\)\s*;\s*$/, "return null;");
      if (patched !== line) {
        changes.push('Patched BrowseLibrariesButton to return null');
        newLines.push(patched);
        continue;
      }
    }

    newLines.push(line);
  }

  content = newLines.join("\n");

  // String fallbacks
  const replacements = [
    ['"Excalidraw links"', '""'],
    ['"Discord chat"', '""'],
    ['"Follow us"', '""'],
    ["https://discord.gg/UexuTaE", ""],
    ["https://github.com/excalidraw/excalidraw", ""],
  ];
  
  for (const [find, replace] of replacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      changes.push(`Fallback: removed "${find}"`);
    }
  }

  if (changes.length > 0 || content.length !== originalLen) {
    fs.writeFileSync(filePath, content, "utf8");
    const saved = originalLen - content.length;
    console.log(`[patch] ✅ Patched ${path.relative(ROOT, filePath)} (-${saved} bytes)`);
    changes.forEach(c => console.log(`[patch]   • ${c}`));
    return true;
  } else {
    console.log(`[patch] ℹ️  No changes needed for ${path.relative(ROOT, filePath)}`);
    return false;
  }
}

// Run patches on both bundles
const files = [
  { path: path.join(EXCALIDRAW_DIR, "prod", "index.js"), fn: patchProdBundle },
  { path: path.join(EXCALIDRAW_DIR, "dev", "index.js"), fn: patchDevBundle },
];

let totalPatched = 0;
for (const { path: filePath, fn } of files) {
  if (fn(filePath)) totalPatched++;
}

console.log(`[patch] Done — patched ${totalPatched} file(s)`);
