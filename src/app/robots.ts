import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/share/"],
        disallow: ["/api/", "/board/", "/test-board"],
      },
    ],
    sitemap: "https://draw.craftisle.com/sitemap.xml",
  }
}
