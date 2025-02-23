/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize image handling
  images: {
    domains: ['*'],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig; 