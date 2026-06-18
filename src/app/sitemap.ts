import { MetadataRoute } from "next"
import { prisma } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - expanded with all public pages
  const staticUrls = [
    {
      url: "https://draw.craftisle.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: "https://draw.craftisle.com/use-cases",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: "https://draw.craftisle.com/privacy",
      lastModified: new Date("2026-06-18"),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: "https://draw.craftisle.com/terms",
      lastModified: new Date("2026-06-18"),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ]

  try {
    // Fetch all public boards from the database
    const publicBoards = await prisma.boards.findMany({
      where: { is_public: true },
      select: { id: true, updated_at: true },
    })

    // Generate sitemap entries for public boards
    const boardUrls = publicBoards.map((board) => ({
      url: `https://draw.craftisle.com/share/${board.id}`,
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
