/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add aliases for problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      bcrypt: require.resolve("./stubs/bcrypt-stub.js"),
      "@prisma/client": require.resolve("./stubs/prisma-stub.js"),
      libpq: require.resolve("./stubs/libpq-stub.js"),
    }

    return config
  },
  // Increase memory limit for build
  experimental: {
    memoryBasedWorkersCount: true,
  },
}

module.exports = nextConfig
