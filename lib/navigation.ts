import { NavItem } from '@/types/navigation.types';

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

export const siteMetadata = {
  title: 'Nina Groop',
  description: 'Life Coach, Author, Speaker',
  author: 'Nina Groop',
};
