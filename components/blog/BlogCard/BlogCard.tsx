'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BlogCardVariantProps } from './BlogCard.types';

const BlogCard: React.FC<BlogCardVariantProps> = ({
  post,
  className,
  variant = 'default',
  showFullDescription = false,
  showDate = true,
  featured = false,
  priority = false,
}) => {
  const { frontmatter, slug, formattedDate, excerpt, imageBasePath } = post;
  const { title, description, featuredimage } = frontmatter;

  // Build image path to match blog page implementation
  const imageSrc =
    featuredimage && imageBasePath
      ? `/content/blog/${imageBasePath}/${featuredimage}`
      : featuredimage
        ? `/content/blog/${featuredimage}`
        : '/images/placeholder-blog.jpg';

  const displayDescription = description || excerpt || '';
  const displayTitle = title || 'Untitled Post';

  // Gradient backgrounds for featured posts (matching original design)
  const getGradientClass = (index: number) => {
    const gradients = [
      'from-transparent to-[#63a9b6]/60', // teal
      'from-transparent to-[#dfc9a0]/60', // beige
      'from-transparent to-[#c97e9a]/60', // pink
    ];
    return `bg-gradient-to-br ${gradients[index % gradients.length]}`;
  };

  const cardVariants = {
    default: 'aspect-square',
    featured: 'aspect-square',
    compact: 'aspect-[4/3]',
    vertical: 'h-56 md:h-64',
  };

  return (
    <article
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        cardVariants[variant],
        className
      )}
      itemScope
      itemType="http://schema.org/Article"
    >
      <Link href={slug} className="block h-full w-full" itemProp="url">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 600px) 100vw, (max-width: 800px) 50vw, 33vw"
            priority={priority}
          />
        </div>

        {/* Gradient Overlay for Featured Posts */}
        {featured && (
          <div
            className={cn(
              'absolute inset-0',
              getGradientClass(0) // You might want to pass an index prop for different gradients
            )}
          />
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/55 via-white/85 to-white/90 p-2.5">
          <header>
            <h4 className="font-raleway m-0 text-base">
              <span
                className="font-normal tracking-[0] text-black no-underline"
                itemProp="headline"
                style={{
                  letterSpacing: 0,
                  fontFamily: 'Raleway, Helvetica, sans-serif',
                }}
              >
                {displayTitle}
              </span>
            </h4>

            {showDate && formattedDate && (
              <time
                className="text-sm text-gray-600"
                dateTime={frontmatter.date}
              >
                {formattedDate}
              </time>
            )}
          </header>

          {displayDescription && (
            <section className="block h-px overflow-hidden">
              <p
                className="text-sm font-normal text-black"
                dangerouslySetInnerHTML={{
                  __html: displayDescription,
                }}
                itemProp="description"
                style={{
                  color: '#000',
                  fontFamily: 'Montserrat, Helvetica, sans-serif',
                }}
              />
            </section>
          )}
        </div>

        {/* Screen reader only content for better accessibility */}
        <span className="sr-only">Read article: {displayTitle}</span>
      </Link>
    </article>
  );
};

export default BlogCard;
