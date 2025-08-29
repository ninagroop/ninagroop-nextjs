import { NavItem } from '@/types/navigation.types';

/**
 * Fallback navigation items - actual navigation now comes from CMS (content/home/index.md)
 * These are used as defaults if CMS data is unavailable
 */
export const navigationItems: NavItem[] = [
  {
    title: 'Home',
    slug: '/',
  },
  {
    title: 'Blog',
    slug: '/blog',
  },
  {
    title: 'About',
    slug: '/about',
  },
  {
    title: 'Coaching',
    slug: '/coaching',
  },
  {
    title: 'Contact',
    slug: '/contact',
  },
  {
    title: 'Store',
    slug: '/store',
  },
  {
    title: 'Checkout',
    slug: '/checkout',
    showCartIndicator: true,
  },
];

/**
 * Site metadata - title remains static, description used as fallback
 * Actual site description (tagline) now comes from CMS (content/home/index.md)
 */
export const siteMetadata = {
  title: 'Nina Groop',
  description: 'Life Coach, Author, Speaker',
  author: 'Nina Groop',
};
