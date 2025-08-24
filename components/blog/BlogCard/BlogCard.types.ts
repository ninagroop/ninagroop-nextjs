import { BlogPostWithMetadata } from '@/types/content.types';

/**
 * Props for the BlogCard component
 */
export interface BlogCardProps {
  /** Blog post data with metadata */
  post: BlogPostWithMetadata;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the full description or truncate it */
  showFullDescription?: boolean;
  /** Whether to show the date */
  showDate?: boolean;
  /** Whether this is a featured post (affects styling) */
  featured?: boolean;
  /** Priority for image loading */
  priority?: boolean;
}

/**
 * Blog card variant types for different display styles
 */
export type BlogCardVariant = 'default' | 'featured' | 'compact' | 'vertical';

/**
 * Extended BlogCard props with variant support
 */
export interface BlogCardVariantProps extends BlogCardProps {
  /** Visual variant of the card */
  variant?: BlogCardVariant;
}
