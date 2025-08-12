/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Prevent API routes from being statically analyzed during build
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Skip API routes during static generation
  generateStaticParams: async () => {
    return []
  },
}

module.exports = nextConfig