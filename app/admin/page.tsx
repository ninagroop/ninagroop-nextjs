'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCMS = async () => {
      try {
        // Dynamically import DecapCMS to avoid SSR issues
        const CMS = (await import('decap-cms-app')).default;

        // Initialize the CMS
        // DecapCMS will automatically load config from /admin/config.yml
        CMS.init();

        setLoading(false);
      } catch (err) {
        console.error('Failed to load DecapCMS:', err);
        setError(err instanceof Error ? err.message : 'Failed to load CMS');
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeCMS();
    }
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading CMS</h1>
          <p className="text-body-text mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-primary mt-4 rounded px-4 py-2 text-white hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-text-bold mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-body-text">Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* DecapCMS will mount its own UI here */}
      <div id="nc-root" />

      {/* Add identity widget for Netlify Identity (if using git-gateway) */}
      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize Netlify Identity
          if (
            (
              window as unknown as {
                netlifyIdentity?: {
                  on: (
                    event: string,
                    callback: (user?: unknown) => void
                  ) => void;
                };
              }
            ).netlifyIdentity
          ) {
            (
              window as unknown as {
                netlifyIdentity: {
                  on: (
                    event: string,
                    callback: (user?: unknown) => void
                  ) => void;
                };
              }
            ).netlifyIdentity.on('init', (user: unknown) => {
              if (!user) {
                (
                  window as unknown as {
                    netlifyIdentity: {
                      on: (event: string, callback: () => void) => void;
                    };
                  }
                ).netlifyIdentity.on('login', () => {
                  document.location.href = '/admin/';
                });
              }
            });
          }
        }}
      />
    </>
  );
}
