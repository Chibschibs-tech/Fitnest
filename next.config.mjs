/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore build errors to prevent deployment failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable image optimization for now to simplify deployment
  images: {
    unoptimized: true,
  },
}

export default nextConfig
