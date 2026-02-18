/** @type {import('next').NextConfig} */

const nextConfig = {
<<<<<<< HEAD
  // Enable static export for Hostinger deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
=======
  // Enable static export for Hostinger deployment (commented out for development)
  // output: 'export',
  trailingSlash: true,
  // distDir: 'out', // Commented out for development
>>>>>>> 6a1e58b (Save: commit by ClickAsia <clickasiaweb@gmail.com>)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  compress: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  basePath: process.env.NODE_ENV === "production" ? "" : "",
  // Generate static sitemap for better SEO
<<<<<<< HEAD
  generateBuildId: false,
=======
>>>>>>> 6a1e58b (Save: commit by ClickAsia <clickasiaweb@gmail.com>)
  // Skip build-time generation of client-side manifest
  generateEtags: false,
};

module.exports = nextConfig;
