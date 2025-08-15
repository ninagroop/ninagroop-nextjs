import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type {
  BlogPost,
  Page,
  HomeContent,
  BlogPostWithMetadata,
  PageWithMetadata,
  HomeContentWithMetadata,
} from '../types/content.types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get the content directory path for a specific content type
 */
function getContentDirectory(contentType: 'blog' | 'pages' | 'home'): string {
  return path.join(contentDirectory, contentType);
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name === 'index.md' || entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Generate a slug from a file path
 * Matches Gatsby's behavior of creating slugs from file paths
 */
function generateSlugFromPath(
  filePath: string,
  contentType: 'blog' | 'pages' | 'home'
): string {
  const relativePath = path.relative(
    getContentDirectory(contentType),
    filePath
  );
  const dirPath = path.dirname(relativePath);

  // For index.md files, use the directory name as the slug
  let slug = dirPath === '.' ? '' : dirPath;

  // Replace backslashes with forward slashes (for Windows compatibility)
  slug = slug.replace(/\\/g, '/');

  // Add leading slash and content type prefix
  if (contentType === 'blog') {
    slug = `/blog/${slug}`;
  } else if (contentType === 'pages') {
    // Pages don't include '/pages' in their slug (matches Gatsby behavior)
    slug = `/${slug}`;
  } else if (contentType === 'home') {
    slug = '/';
  }

  // Clean up any double slashes
  slug = slug.replace(/\/+/g, '/');

  return slug;
}

/**
 * Process markdown content to HTML
 */
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithMetadata | null> {
  try {
    const blogDir = getContentDirectory('blog');
    const normalizedSlug = slug.replace(/^\/blog\//, '').replace(/\/$/, '');

    // Try to find the markdown file
    const possiblePaths = [
      path.join(blogDir, normalizedSlug, 'index.md'),
      path.join(blogDir, `${normalizedSlug}.md`),
    ];

    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content, excerpt } = matter(fileContents, { excerpt: true });

    const frontmatter = data as BlogPost;
    const htmlContent = await markdownToHtml(content);

    // Calculate reading time (average 200 words per minute)
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    // Format date
    const date = new Date(frontmatter.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      frontmatter,
      content,
      htmlContent,
      excerpt: excerpt || frontmatter.description || '',
      slug: `/blog/${normalizedSlug}`,
      readingTime,
      formattedDate,
    };
  } catch (error) {
    console.error(`Error reading post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPostWithMetadata[]> {
  const blogDir = getContentDirectory('blog');
  const markdownFiles = findMarkdownFiles(blogDir);

  const posts = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content, excerpt } = matter(fileContents, {
        excerpt: true,
      });

      const frontmatter = data as BlogPost;
      const slug = generateSlugFromPath(filePath, 'blog');
      const htmlContent = await markdownToHtml(content);

      // Calculate reading time
      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);

      // Format date
      const date = new Date(frontmatter.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return {
        frontmatter,
        content,
        htmlContent,
        excerpt: excerpt || frontmatter.description || '',
        slug,
        readingTime,
        formattedDate,
      };
    })
  );

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Get all blog post paths for static generation
 */
export function getPostPaths(): string[] {
  const blogDir = getContentDirectory('blog');
  const markdownFiles = findMarkdownFiles(blogDir);

  return markdownFiles.map((filePath) => {
    const slug = generateSlugFromPath(filePath, 'blog');
    // Remove leading /blog/ for the path segments
    return slug.replace(/^\/blog\//, '');
  });
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(
  limit: number = 3
): Promise<BlogPostWithMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter((post) => post.frontmatter.featuredpost === true)
    .slice(0, limit);
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(
  slug: string
): Promise<PageWithMetadata | null> {
  try {
    const pagesDir = getContentDirectory('pages');
    const normalizedSlug = slug.replace(/^\//, '').replace(/\/$/, '');

    const possiblePaths = [
      path.join(pagesDir, normalizedSlug, 'index.md'),
      path.join(pagesDir, `${normalizedSlug}.md`),
    ];

    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as Page;
    const htmlContent = await markdownToHtml(content);

    return {
      frontmatter,
      content,
      htmlContent,
      slug: `/${normalizedSlug}`,
    };
  } catch (error) {
    console.error(`Error reading page with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all pages
 */
export async function getAllPages(): Promise<PageWithMetadata[]> {
  const pagesDir = getContentDirectory('pages');
  const markdownFiles = findMarkdownFiles(pagesDir);

  const pages = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = data as Page;
      const slug = generateSlugFromPath(filePath, 'pages');
      const htmlContent = await markdownToHtml(content);

      return {
        frontmatter,
        content,
        htmlContent,
        slug,
      };
    })
  );

  return pages;
}

/**
 * Get page paths for static generation
 */
export function getPagePaths(): string[] {
  const pagesDir = getContentDirectory('pages');
  const markdownFiles = findMarkdownFiles(pagesDir);

  return markdownFiles.map((filePath) => {
    const slug = generateSlugFromPath(filePath, 'pages');
    // Remove leading slash for the path segments
    return slug.replace(/^\//, '');
  });
}

/**
 * Get home page content
 */
export async function getHomeContent(): Promise<HomeContentWithMetadata | null> {
  try {
    const homeDir = getContentDirectory('home');
    const filePath = path.join(homeDir, 'index.md');

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as HomeContent;
    const htmlContent = await markdownToHtml(content);

    return {
      frontmatter,
      content,
      htmlContent,
    };
  } catch (error) {
    console.error('Error reading home content:', error);
    return null;
  }
}

/**
 * Get adjacent posts for navigation
 */
export async function getAdjacentPosts(currentSlug: string): Promise<{
  previous: BlogPostWithMetadata | null;
  next: BlogPostWithMetadata | null;
}> {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

/**
 * Search posts by query
 */
export async function searchPosts(
  query: string
): Promise<BlogPostWithMetadata[]> {
  const allPosts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    const searchableContent = [
      post.frontmatter.title,
      post.frontmatter.description || '',
      post.content,
    ]
      .join(' ')
      .toLowerCase();

    return searchableContent.includes(lowercaseQuery);
  });
}
