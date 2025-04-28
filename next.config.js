const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // TypeScriptのエラーを無視してビルドを続行
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLintのエラーも無視
    ignoreDuringBuilds: true,
  },
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
    
    // エイリアスの設定を明示的に追加
    config.resolve.alias['@'] = path.join(process.cwd(), 'src');
    
    return config;
  },
};

module.exports = nextConfig;