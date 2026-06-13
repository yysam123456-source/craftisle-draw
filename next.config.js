/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@excalidraw/excalidraw"],
  images: {
    domains: ["craftisle.com", "localhost"],
  },
}

module.exports = nextConfig
