/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@excalidraw/excalidraw"],
  images: {
    domains: ["craftisle.com", "localhost"],
  },
}

module.exports = nextConfig
