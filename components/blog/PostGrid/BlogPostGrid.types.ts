import { BlogPostWithMetadata } from '@/types/content.types';
import { BlogCardVariant } from '../BlogCard/BlogCard.types';

/**
 * Props for the BlogPostGrid component
 */
export interface BlogPostGridProps {
  /** Array of blog posts to display */
  posts: BlogPostWithMetadata[];
  /** Number of posts to show (defaults to 3) */
  count?: number;
  /** Whether to show only featured posts */
  featured?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Grid layout variant */
  variant?: BlogPostGridVariant;
  /** Current post slug to exclude from grid */
  excludeSlug?: string;
}

/**
 * BlogPostGrid layout variants
 */
export type BlogPostGridVariant = 'horizontal' | 'vertical' | 'masonry';

/**
 * Props for the VerticalTilesGrid component
 */
export interface VerticalTilesGridProps {
  /** Child elements to render in vertical tiles */
  children: React.ReactNode[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Grid configuration for responsive layouts
 */
export interface GridConfig {
  /** Number of columns for different screen sizes */
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  /** Gap between grid items */
  gap: string;
  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;
}

/**
 * Post grid item configuration
 */
export interface PostGridItemProps {
  /** Blog post data */
  post: BlogPostWithMetadata;
  /** Index in the grid for styling purposes */
  index: number;
  /** Card variant to use */
  cardVariant?: BlogCardVariant;
  /** Whether this item is featured */
  featured?: boolean;
  /** Priority for image loading */
  priority?: boolean;
}
