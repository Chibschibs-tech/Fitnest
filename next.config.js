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
  webpack: (config) => {
    // Add alias for bcrypt
    config.resolve.alias = {
      ...config.resolve.alias,
      bcrypt: require.resolve("./lib/bcrypt-stub.js"),
    }
    return config
  },
}

module.exports = nextConfig
