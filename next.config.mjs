/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    // Handle problematic imports
    config.resolve.alias = {
      ...config.resolve.alias,
      bcrypt: require.resolve('./lib/bcrypt-stub.ts'),
      '@prisma/client': require.resolve('./lib/db-connection.ts'),
    };
    
    return config;
  },
  experimental: {
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
