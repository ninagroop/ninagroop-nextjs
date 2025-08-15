import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js Image component to optimize local images
    unoptimized: process.env.NODE_ENV === 'development',
    // Define allowed image formats
    formats: ['image/avif', 'image/webp'],
  },
  // Enable static exports if needed
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
