import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // This allows handling dynamic local images better
  },
  experimental: {
    // Ensure proper metadata handling in Next.js 15.3.0
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
