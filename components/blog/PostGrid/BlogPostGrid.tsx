'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import BlogCard from '../BlogCard';
import {
  BlogPostGridProps,
  VerticalTilesGridProps,
  PostGridItemProps,
} from './BlogPostGrid.types';

const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  posts,
  count = 3,
  featured = true,
  className,
  variant = 'horizontal',
  excludeSlug,
}) => {
  // Filter posts based on criteria
  const filteredPosts = posts
    .filter((post) => {
      // Exclude current post if specified
      if (excludeSlug && post.slug === excludeSlug) return false;

      // Filter by featured status if requested
      if (featured) {
        return post.frontmatter.featuredpost && post.frontmatter.featuredimage;
      }

      return true;
    })
    .slice(0, count);

  if (filteredPosts.length === 0) {
    return null;
  }

  const gridVariants = {
    horizontal: cn(
      'grid gap-5',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      'auto-rows-auto'
    ),
    vertical: cn('grid gap-5', 'grid-cols-1', 'auto-rows-auto'),
    masonry: cn('columns-1 sm:columns-2 lg:columns-3', 'gap-5'),
  };

  return (
    <div className={cn('w-full', className)}>
      <ol className={cn(gridVariants[variant], 'list-none p-0')}>
        {filteredPosts.map((post, index) => (
          <PostGridItem
            key={post.slug}
            post={post}
            index={index}
            featured={featured}
            cardVariant={variant === 'vertical' ? 'vertical' : 'featured'}
            priority={index < 3} // Prioritize loading for first 3 images
          />
        ))}
      </ol>
    </div>
  );
};

const PostGridItem: React.FC<PostGridItemProps> = ({
  post,
  index,
  featured,
  cardVariant = 'featured',
  priority = false,
}) => {
  return (
    <li className="list-none transition-opacity duration-300 hover:opacity-70">
      <BlogCard
        post={post}
        variant={cardVariant}
        featured={featured}
        priority={priority}
        showDate={false}
        className="h-full"
      />
    </li>
  );
};

export const VerticalTilesGrid: React.FC<VerticalTilesGridProps> = ({
  children,
  className,
}) => {
  // Gradient backgrounds for vertical tiles (matching original design)
  const getGradientBackground = (index: number): string => {
    const gradients = [
      'bg-gradient-to-br from-transparent to-[#63a9b6]/60', // teal
      'bg-gradient-to-br from-transparent to-[#dfc9a0]/60', // beige
      'bg-gradient-to-br from-transparent to-[#c97e9a]/60', // pink
    ];
    return gradients[index % gradients.length];
  };

  const validChildren = React.Children.toArray(children).filter(
    (child) => child !== '\n' && React.isValidElement(child)
  );

  return (
    <div className={cn('w-full', className)}>
      <ol className="grid list-none auto-rows-auto grid-cols-1 gap-5 p-0">
        {validChildren.map((child, index) => {
          if (!React.isValidElement(child)) return null;

          const childProps = child.props as {
            className?: string;
            featuredimage?: string;
            title?: string;
            href?: string;
            children?: React.ReactNode;
          };

          return (
            <li key={index} className="list-none">
              <article className="post-list-item">
                <div
                  className={cn(
                    'relative block h-56 w-full p-4 transition-opacity duration-300 hover:opacity-70 md:h-64',
                    getGradientBackground(index),
                    'overflow-hidden'
                  )}
                >
                  <a href={childProps.href} className="absolute inset-0">
                    {/* Content positioned on left side on larger screens */}
                    <div className="relative z-10 flex h-full max-w-full flex-col justify-center md:max-w-[50%]">
                      <div
                        className={cn(
                          'relative z-10 text-white',
                          childProps.className
                        )}
                      >
                        {childProps.children}
                      </div>
                    </div>

                    {/* Image positioned on right side on larger screens */}
                    {childProps.featuredimage && (
                      <div className="absolute top-0 right-0 h-full w-full overflow-hidden md:w-1/2">
                        <img
                          src={childProps.featuredimage}
                          alt={childProps.title || ''}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </a>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default BlogPostGrid;
