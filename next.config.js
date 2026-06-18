/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@excalidraw/excalidraw"],
  images: {
    domains: ["craftisle.com", "localhost"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'draw.craftisle.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // SEO-friendly redirects
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Common URL patterns users might try
      {
        source: '/whiteboard',
        destination: '/board/new',
        permanent: true,
      },
      {
        source: '/draw',
        destination: '/board/new',
        permanent: true,
      },
      {
        source: '/create',
        destination: '/board/new',
        permanent: true,
      },
      {
        source: '/new',
        destination: '/board/new',
        permanent: true,
      },
      // Trailing slash redirect
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
