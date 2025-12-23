/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 外部画像ドメインを許可（必要に応じて追加）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;

