'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Component for vertical tiles grid
interface VerticalTilesGridProps {
  children: React.ReactNode[];
}

const VerticalTilesGrid: React.FC<VerticalTilesGridProps> = ({ children }) => {
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== ''
  );

  return (
    <div className="mb-8">
      <ol className="grid list-none gap-5 p-0 lg:grid-rows-3">
        {filteredChildren.map((child, index) => (
          <li key={index} className="relative p-0">
            <article>
              <div
                className={`relative block h-56 min-w-full overflow-hidden p-4 transition-opacity hover:opacity-70 md:h-52 ${
                  index === 0
                    ? 'bg-gradient-to-br from-transparent to-[#63a9b6]'
                    : index === 1
                      ? 'bg-gradient-to-br from-transparent to-[#dfc9a0]'
                      : 'bg-gradient-to-br from-transparent to-[#c97e9a]'
                }`}
              >
                {child}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Component for post grid
interface PostGridProps {
  featured?: boolean;
  count?: number;
  slug?: string;
}

const PostGrid: React.FC<PostGridProps> = ({ featured = true, count = 3 }) => {
  // For now, render a placeholder since we'd need to implement the blog data fetching
  return (
    <div className="mb-8">
      <div className="bg-border-bg rounded-lg p-8 text-center">
        <p className="text-body-text">Featured Blog Posts</p>
        <p className="text-text-light text-sm">
          Showing {count} {featured ? 'featured' : 'recent'} posts
        </p>
      </div>
    </div>
  );
};

// Component for Calendly button
interface CalendlyButtonProps {
  children: React.ReactNode;
  url?: string;
}

const CalendlyButton: React.FC<CalendlyButtonProps> = ({ children, url }) => {
  return (
    <button
      className="rounded bg-orange-600 px-6 py-3 text-white transition-colors hover:bg-orange-700"
      onClick={() => {
        if (url) {
          window.open(url, '_blank');
        }
      }}
    >
      {children}
    </button>
  );
};

// Component for featured products
interface FeaturedProductsProps {
  count?: number;
  featured?: boolean;
  id?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  count = 3,
  featured = false,
}) => {
  // For now, render a placeholder since we'd need to implement Stripe product data fetching
  return (
    <div className="mb-8">
      <div className="bg-border-bg rounded-lg p-8 text-center">
        <p className="text-body-text">Featured Products</p>
        <p className="text-text-light text-sm">
          Showing {count} {featured ? 'featured' : 'recent'} products
        </p>
      </div>
    </div>
  );
};

// Helper function to process images in markdown content
const processImagePaths = (content: string, imagePath: string = '') => {
  if (!imagePath) return content;

  // Replace relative image paths with absolute paths
  return content.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
    (match, beforeSrc, src, afterSrc) => {
      // Skip if already processed or is external URL
      if (src.startsWith('http') || src.startsWith('/')) {
        return match;
      }

      // Convert relative path to absolute path
      const absoluteSrc = `${imagePath}/${src}`;
      return `<img${beforeSrc}src="${absoluteSrc}"${afterSrc}>`;
    }
  );
};

// Enhanced markdown renderer with custom components
interface MarkdownRendererProps {
  content: string;
  className?: string;
  imagePath?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  imagePath = '',
}) => {
  // Process the content to handle custom components
  const processedContent = React.useMemo(() => {
    let processed = processImagePaths(content, imagePath);

    // Handle vertical-tiles-grid with proper React rendering
    if (processed.includes('<vertical-tiles-grid>')) {
      const verticalTilesMatch = processed.match(
        /<vertical-tiles-grid>([\s\S]*?)<\/vertical-tiles-grid>/i
      );
      if (verticalTilesMatch) {
        const gridContent = verticalTilesMatch[1];
        // Extract anchor elements
        const anchors = gridContent
          .split(/(?=<a\s+href=)/)
          .filter((item) => item.trim());

        return (
          <div className={className}>
            <div
              dangerouslySetInnerHTML={{
                __html: processed.replace(
                  /<vertical-tiles-grid>[\s\S]*?<\/vertical-tiles-grid>/i,
                  ''
                ),
              }}
            />
            <VerticalTilesGrid>
              {anchors.map((anchor, index) => {
                const href = anchor.match(/href="([^"]*?)"/)?.[1] || '#';
                const title = anchor.match(/<h2[^>]*?>(.*?)<\/h2>/)?.[1] || '';
                const imgSrc = anchor.match(/src="\.\/([^"]+)"/)?.[1] || '';

                return (
                  <Link
                    key={index}
                    href={href}
                    className="border-none no-underline"
                  >
                    <h2 className="relative z-10 mb-4 text-lg font-bold text-white">
                      {title}
                    </h2>
                    {imgSrc && (
                      <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden md:relative md:mt-4 md:w-full">
                        <Image
                          src={`/content/home/${imgSrc}`}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
            </VerticalTilesGrid>
          </div>
        );
      }
    }

    // Handle post-grid
    const postGridMatch = processed.match(/<post-grid([^>]*?)><\/post-grid>/i);
    if (postGridMatch) {
      const attributes = postGridMatch[1];
      const featuredMatch = attributes.match(/featured="([^"]*?)"/);
      const countMatch = attributes.match(/count="([^"]*?)"/);
      const slugMatch = attributes.match(/slug="([^"]*?)"/);

      const postGridProps = {
        featured: featuredMatch ? featuredMatch[1] === 'true' : true,
        count: countMatch ? parseInt(countMatch[1]) : 3,
        slug: slugMatch ? slugMatch[1] : undefined,
      };

      return (
        <div className={className}>
          <div
            dangerouslySetInnerHTML={{
              __html: processed.replace(/<post-grid[^>]*?><\/post-grid>/i, ''),
            }}
          />
          <PostGrid {...postGridProps} />
        </div>
      );
    }

    // Default: render as HTML
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  }, [content, className, imagePath]);

  return <>{processedContent}</>;
};

export default MarkdownRenderer;

// Named exports for individual components
export { VerticalTilesGrid, PostGrid, CalendlyButton, FeaturedProducts };
