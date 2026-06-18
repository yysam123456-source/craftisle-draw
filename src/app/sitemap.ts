import { MetadataRoute } from "next"
import { prisma } from "@/lib/db"

const locales = ["en", "zh", "zh-TW", "es", "ja", "de", "fr", "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate URLs for all locales
  const staticUrls: MetadataRoute.Sitemap = []
  
  for (const locale of locales) {
    // Homepage
    staticUrls.push({
      url: `https://draw.craftisle.com/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `https://draw.craftisle.com/${l}`])
        ),
      },
    })
    
    // Use cases page
    staticUrls.push({
      url: `https://draw.craftisle.com/${locale}/use-cases`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })
    
    // Privacy page
    staticUrls.push({
      url: `https://draw.craftisle.com/${locale}/privacy`,
      lastModified: new Date("2026-06-18"),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })
    
    // Terms page
    staticUrls.push({
      url: `https://draw.craftisle.com/${locale}/terms`,
      lastModified: new Date("2026-06-18"),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })
  }
  
  try {
    // Fetch all public boards from the database
    const publicBoards = await prisma.boards.findMany({
      where: { is_public: true },
      select: { id: true, updated_at: true },
    })
    
    // Generate sitemap entries for public boards (only English version for now)
    const boardUrls = publicBoards.map((board) => ({
      url: `https://draw.craftisle.com/en/share/${board.id}`,
      lastModified: board.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
    
    return [...staticUrls, ...boardUrls]
  } catch (error) {
    // If database query fails, return only static URLs
    console.error("Failed to fetch public boards for sitemap:", error)
    return staticUrls
  }
}
