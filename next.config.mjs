/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow all hosts for Replit proxy
  async rewrites() {
    return []
  },
  // Configure for development in Replit
  ...(process.env.NODE_ENV === 'development' && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, max-age=0, must-revalidate',
            },
          ],
        },
      ]
    },
  }),
}

export default nextConfig
