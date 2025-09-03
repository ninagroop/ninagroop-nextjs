import { SubNavItem } from './navigation.types';

/**
 * Blog post frontmatter structure
 */

/**
 * Navigation item structure used in the home page frontmatter
 */
export interface NavigationItem {
  title: string;
  slug: string;
  showcartindicator?: boolean;
  subnav?: SubNavItem[];
}

/**
 * Social link structure used in the home page frontmatter
 */
export interface SocialLink {
  title: string;
  url: string;
  icon: string;
}

/**
 * Footer credit structure used in the home page frontmatter
 */
export interface FooterCredit {
  text: string;
  linktext: string;
  url: string;
}

/**
 * Blog post frontmatter structure
 */
export interface BlogPost {
  templatekey: 'blog-post';
  title: string;
  date: string; // ISO date string
  description?: string;
  featuredpost?: boolean;
  featuredimage?: string;
}

/**
 * Generic page frontmatter structure
 */
export interface Page {
  templatekey: 'page';
  title: string;
}

/**
 * Home page frontmatter structure
 */
export interface HomeContent {
  templatekey: 'index-page';
  title: string;
  navigation: NavigationItem[];
  tagline: string;
  homequote: string;
  featuredimage: string;
  footerbioimage: string;
  footerbiotext: string;
  sociallinks: SocialLink[];
  footermeettext: string;
  footercredits: FooterCredit[];
}

/**
 * Union type for all content types
 */
export type ContentFrontmatter = BlogPost | Page | HomeContent;

/**
 * Template key for type safety
 */
export type TemplateKey = 'blog-post' | 'page' | 'index-page';

/**
 * Parsed markdown file with frontmatter and content
 */
export interface ParsedMarkdown<T = ContentFrontmatter> {
  frontmatter: T;
  content: string;
  htmlContent?: string;
  excerpt?: string;
  slug?: string;
}

/**
 * Blog post with computed fields
 */
export interface BlogPostWithMetadata extends ParsedMarkdown<BlogPost> {
  slug: string;
  readingTime?: number;
  formattedDate?: string;
  imageBasePath?: string;
}

/**
 * Page with computed fields
 */
export interface PageWithMetadata extends ParsedMarkdown<Page> {
  slug: string;
}

/**
 * Home content with parsed HTML
 */
export interface HomeContentWithMetadata extends ParsedMarkdown<HomeContent> {
  htmlContent: string;
}

/**
 * Type guard to check if content is a blog post
 */
export function isBlogPost(content: ContentFrontmatter): content is BlogPost {
  return content.templatekey === 'blog-post';
}

/**
 * Type guard to check if content is a page
 */
export function isPage(content: ContentFrontmatter): content is Page {
  return content.templatekey === 'page';
}

/**
 * Type guard to check if content is home content
 */
export function isHomeContent(
  content: ContentFrontmatter
): content is HomeContent {
  return content.templatekey === 'index-page';
}
