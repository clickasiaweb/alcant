/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ["your-domain.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  // Generate static sitemap for better SEO
  generateBuildId: false,
  // Skip build-time generation of client-side manifest
  generateEtags: false,
};

module.exports = nextConfig;
