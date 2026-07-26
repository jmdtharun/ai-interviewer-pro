/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
