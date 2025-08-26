'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPostGrid } from '@/components/blog';
import type { BlogPostWithMetadata } from '@/types/content.types';

// Component for vertical tiles grid specific to markdown parsing
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
            <article className="post-list-item">
              <div
                className={`featured-post-wrapper relative block h-auto min-w-full overflow-hidden transition-opacity hover:opacity-70 sm:h-40 lg:h-56 ${
                  index === 0
                    ? 'bg-[linear-gradient(45deg,transparent,#63a9b6)]'
                    : index === 1
                      ? 'bg-[linear-gradient(45deg,transparent,#dfc9a0)]'
                      : 'bg-[linear-gradient(45deg,transparent,#c97e9a)]'
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

// Component for post grid with server-side data fetching
interface PostGridProps {
  featured?: boolean;
  count?: number;
  slug?: string;
  posts?: BlogPostWithMetadata[];
}

const PostGrid: React.FC<PostGridProps> = ({
  featured = true,
  count = 3,
  slug,
  posts,
}) => {
  // If posts are provided, render the actual BlogPostGrid
  if (posts && posts.length > 0) {
    return (
      <div className="mb-8">
        <BlogPostGrid
          posts={posts}
          featured={featured}
          count={count}
          excludeSlug={slug}
          variant="horizontal"
        />
      </div>
    );
  }

  // Fallback placeholder when no posts are provided
  return (
    <div className="mb-8">
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div className="mb-4 text-gray-400">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          Blog Post Grid
        </h3>
        <p className="mb-1 text-gray-600">
          {featured ? 'Featured' : 'Recent'} Blog Posts ({count} posts)
        </p>
        <p className="mb-3 text-sm text-gray-500">
          No posts data provided to MarkdownRenderer
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
  posts?: BlogPostWithMetadata[];
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  imagePath = '',
  posts = [],
}) => {
  // Process the content to handle custom components
  // Enhanced markdown renderer with custom components
  const processedContent = React.useMemo(() => {
    const processed = processImagePaths(content, imagePath);

    // Function to split content around a tag and render components in correct position
    const renderContentWithCustomTags = (htmlContent: string) => {
      const parts: React.ReactNode[] = [];
      let currentContent = htmlContent;
      let partIndex = 0;

      // Handle vertical-tiles-grid
      const verticalTilesMatch = currentContent.match(
        /<vertical-tiles-grid>([\s\S]*?)<\/vertical-tiles-grid>/i
      );
      if (verticalTilesMatch) {
        const beforeVerticalTiles = currentContent.substring(
          0,
          verticalTilesMatch.index
        );
        const afterVerticalTiles = currentContent.substring(
          verticalTilesMatch.index! + verticalTilesMatch[0].length
        );

        const verticalTilesContent = [
          {
            href: '/blog',
            title: 'Writing & Editing',
            image: 'rana-sawalha-W_-6PWGbYaU-unsplash.jpg',
          },
          {
            href: '/blog',
            title: 'Grant Writing',
            image: 'unseen-studio-s9CC2SKySJM-unsplash.jpg',
          },
          {
            href: '/coaching',
            title: 'Life Coaching',
            image: 'pine-watt-3_Xwxya43hE-unsplash.jpg',
          },
        ];

        // Add content before vertical tiles
        if (beforeVerticalTiles.trim()) {
          parts.push(
            <div
              key={`before-vertical-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforeVerticalTiles }}
            />
          );
        }

        // Add vertical tiles
        parts.push(
          <VerticalTilesGrid key={`vertical-tiles-${partIndex++}`}>
            {verticalTilesContent.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="absolute inset-0 block h-full w-full border-none p-4 no-underline"
              >
                <div className="relative z-10 flex h-full max-w-full flex-col justify-center md:max-w-[50%]">
                  <h2 className="relative z-10 mb-4 text-lg font-bold text-white">
                    {item.title}
                  </h2>
                </div>
                <div className="absolute top-0 right-0 h-full w-full overflow-hidden md:w-1/2">
                  <Image
                    src={`/content/home/${item.image}`}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </Link>
            ))}
          </VerticalTilesGrid>
        );

        currentContent = afterVerticalTiles;
      }

      // Handle post-grid
      const postGridMatch = currentContent.match(
        /<post-grid([^>]*?)><\/post-grid>/i
      );
      if (postGridMatch) {
        const beforePostGrid = currentContent.substring(0, postGridMatch.index);
        const afterPostGrid = currentContent.substring(
          postGridMatch.index! + postGridMatch[0].length
        );

        const attributes = postGridMatch[1];
        const featuredMatch = attributes.match(/featured="([^"]*?)"/);
        const countMatch = attributes.match(/count="([^"]*?)"/);
        const slugMatch = attributes.match(/slug="([^"]*?)"/);

        const postGridProps = {
          featured: featuredMatch ? featuredMatch[1] === 'true' : true,
          count: countMatch ? parseInt(countMatch[1]) : 3,
          slug: slugMatch ? slugMatch[1] : undefined,
        };

        // Add content before post grid
        if (beforePostGrid.trim()) {
          parts.push(
            <div
              key={`before-post-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforePostGrid }}
            />
          );
        }

        // Add post grid
        parts.push(
          <PostGrid
            key={`post-grid-${partIndex++}`}
            {...postGridProps}
            posts={posts}
          />
        );

        currentContent = afterPostGrid;
      }

      // Add any remaining content
      if (currentContent.trim()) {
        parts.push(
          <div
            key={`remaining-${partIndex++}`}
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        );
      }

      return parts.length > 0 ? parts : null;
    };

    const customTagsContent = renderContentWithCustomTags(processed);

    if (customTagsContent) {
      return <div className={className}>{customTagsContent}</div>;
    }

    // Default: render as HTML
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  }, [content, className, imagePath, posts]);

  return <>{processedContent}</>;
};

export default MarkdownRenderer;

// Named exports for individual components
export { VerticalTilesGrid, PostGrid, CalendlyButton, FeaturedProducts };
