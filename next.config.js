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
};

module.exports = nextConfig;
