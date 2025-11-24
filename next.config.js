/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "**.facebook.com",
      },
      {
        protocol: "https",
        hostname: "scontent*.fbcdn.net",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  eslint: {
    // Ignore ESLint errors during build (tests may have different linting rules)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build (optional, but recommended for production)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;

