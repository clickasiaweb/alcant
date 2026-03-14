/** @type {import('next').NextConfig} */

const nextConfig = {
  // Enable static export for Hostinger deployment
  output: "export",
  trailingSlash: true,
  distDir: "out",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compress: true,
  // Remove assetPrefix and basePath for deployment
  // Generate static sitemap for better SEO
  generateBuildId: async () => 'build',
  // Skip build-time generation of client-side manifest
  generateEtags: false,
  // Add better handling for static export
  skipTrailingSlashRedirect: true,
  // Ensure proper handling of dynamic routes
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // In static export mode, ensure all dynamic routes are properly handled
    return defaultPathMap;
  },
};

module.exports = nextConfig;
