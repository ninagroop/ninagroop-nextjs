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

  // Security headers including CSP
  async headers() {
    return [
      // CSP for admin/CMS routes - more permissive for DecapCMS functionality
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://identity.netlify.com https://unpkg.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://unpkg.com https://cdn.jsdelivr.net",
              "img-src 'self' data: https: http: blob:",
              "connect-src 'self' https://api.netlify.com https://identity.netlify.com https://unpkg.com blob:",
              "frame-src 'self' https://identity.netlify.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://identity.netlify.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      // CSP for main site - more restrictive but allows Calendly and Substack
      {
        source: '/((?!admin).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://calendly.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
              "font-src 'self' https://fonts.gstatic.com https://assets.calendly.com",
              "img-src 'self' data: https: http:",
              "connect-src 'self' https://api.calendly.com https://calendly.com https://ninagroop.substack.com",
              "frame-src 'self' https://calendly.com https://ninagroop.substack.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://ninagroop.substack.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },

  // Rewrite /admin to serve the static DecapCMS HTML file
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/config.yml',
        destination: '/admin/config.yml',
      },
      {
        source: '/preview.css',
        destination: '/admin/preview.css',
      },
    ];
  },
};

export default nextConfig;
