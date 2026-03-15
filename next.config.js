/** @type {import('next').NextConfig} */

const nextConfig = {
  // ✅ Remove static export - this was causing the 404 issues with dynamic routes
  // output: "export", // ❌ REMOVED - this conflicts with dynamic routes
  trailingSlash: true,
  distDir: "out",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compress: true,
  // Generate static sitemap for better SEO
  generateBuildId: async () => `build-${Date.now()}`, // Add timestamp for cache-busting
  // Skip build-time generation of client-side manifest
  generateEtags: false,
  // Add better handling for static export
  skipTrailingSlashRedirect: true,
  // ✅ Remove exportPathMap - not needed when not using static export
  // exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
  //   const pathMap = { ...defaultPathMap };
  //   pathMap['/product-details/[slug]'] = { page: '/product-details/[slug]' };
  //   return pathMap;
  // },
  // Add headers for cache control
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
