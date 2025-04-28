const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドビルドでは fs, path などのNode.jsモジュールを無視
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // エイリアス設定を追加
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src')
    };
    
    return config;
  },
};

module.exports = nextConfig;