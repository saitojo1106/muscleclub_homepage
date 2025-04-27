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
    return config;
  },
};

module.exports = nextConfig;