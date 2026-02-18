/** @type {import('next').NextConfig} */

const nextConfig = {
  // Remove static export for Vercel deployment
  // output: "export",
  trailingSlash: true,
  // distDir: "out",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compress: true,
  // Generate static sitemap for better SEO
  generateBuildId: async () => 'build',
  // Skip build-time generation of client-side manifest
  generateEtags: false,
};

module.exports = nextConfig;
