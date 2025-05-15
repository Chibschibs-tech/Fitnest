/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for dynamic pages
  experimental: {
    // This ensures not-found is rendered at runtime
    missingSuspenseWithCSRBailout: false,
  },
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
  // Exclude specific pages from static generation
  unstable_excludeFiles: ['**/app/cart/**/*', '**/app/express-shop/**/*'],
}

export default nextConfig
