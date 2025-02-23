/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack caching
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: '.next/cache/webpack',
      name: isServer ? 'server' : 'client',
      version: '1.0.0',
    };

    return config;
  },
  // Enable streaming responses
  experimental: {
    serverActions: true,
  },
  // Optimize image handling
  images: {
    domains: ['*'],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig; 