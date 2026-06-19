/**
 * generate-sitemap.js
 *
 * Generates static sitemap.xml for draw.craftisle.com.
 * Run during build: node scripts/generate-sitemap.js
 *
 * Why static? Cloudflare Bot Protection blocks Googlebot
 * from reaching the Next.js SSR sitemap.ts route.
 * A static file in public/ is served directly by CF.
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://draw.craftisle.com";

const LOCALES = [
  "en", "zh", "zh-TW", "es", "ja", "de", "fr",
  "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro",
];

// Static pages per locale (excluded: /board/*, /test-board, API routes)
const STATIC_PAGES = [
  { path: "", priority: 1.0, changefreq: "daily" },
  { path: "/use-cases", priority: 0.9, changefreq: "weekly" },
  { path: "/privacy", priority: 0.3, changefreq: "monthly" },
  { path: "/terms", priority: 0.3, changefreq: "monthly" },
];

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

async function main() {
  const lines = [];
  const now = new Date();

  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
  );
  lines.push(`<!--`);
  lines.push(`  Static sitemap for ${BASE_URL}`);
  lines.push(`  Generated: ${now.toISOString()}`);
  lines.push(`  Locales: ${LOCALES.length} | Static pages per locale: ${STATIC_PAGES.length}`);
  lines.push(`-->`);

  // Generate URLs for each locale × each static page
  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      const url = `${BASE_URL}/${locale}${page.path}`;
      const isHomepage = page.path === "";

      lines.push(`<url>`);
      lines.push(`<loc>${escapeXml(url)}</loc>`);

      // Add hreflang alternates for homepage only (standard SEO practice)
      if (isHomepage) {
        lines.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en" />`);
        for (const l of LOCALES) {
          lines.push(
            `<xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}" />`
          );
        }
      }

      lines.push(`<lastmod>${formatDate(now)}</lastmod>`);
      lines.push(`<changefreq>${page.changefreq}</changefreq>`);
      lines.push(`<priority>${page.priority}</priority>`);
      lines.push(`</url>`);
    }
  }

  // Try to fetch public boards from DB for share URLs (optional, non-fatal)
  let boardUrls = [];
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    const boards = await prisma.boards.findMany({
      where: { is_public: true },
      select: { id: true, updated_at: true },
      take: 1000, // cap to avoid oversized sitemap
    });
    boardUrls = boards.map((b) => ({
      url: `${BASE_URL}/en/share/${b.id}`,
      lastmod: b.updated_at,
    }));
    await prisma.$disconnect();
    console.log(`[sitemap] Fetched ${boardUrls.length} public boards from DB`);
  } catch (err) {
    console.warn(
      "[sitemap] DB query skipped (Prisma not available or no DB connection):",
      err.message?.substring(0, 100)
    );
  }

  // Add public board share URLs (English only — they're user-generated content)
  for (const b of boardUrls) {
    lines.push(`<url>`);
    lines.push(`<loc>${escapeXml(b.url)}</loc>`);
    lines.push(`<lastmod>${formatDate(new Date(b.lastmod))}</lastmod>`);
    lines.push(`<changefreq>weekly</changefreq>`);
    lines.push(`<priority>0.8</priority>`);
    lines.push(`</url>`);
  }

  lines.push(`</urlset>`);

  const xml = lines.join("\n") + "\n";
  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  const totalUrls =
    LOCALES.length * STATIC_PAGES.length + boardUrls.length;
  console.log(`[sitemap] ✅ Generated ${outPath} (${totalUrls} URLs, ${(xml.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("[sitemap] ❌ Failed:", err);
  process.exit(1);
});
