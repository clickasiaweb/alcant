/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
};

module.exports = nextConfig;
