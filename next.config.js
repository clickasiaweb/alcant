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
  generateBuildId: async () => `build-${Date.now()}`, // Add timestamp for cache-busting
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
    // We need to add specific handling for product-details routes
    const pathMap = { ...defaultPathMap };
    
    // Add fallback for dynamic product routes
    pathMap['/product-details/[slug]'] = { page: '/product-details/[slug]' };
    
    return pathMap;
  },
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
