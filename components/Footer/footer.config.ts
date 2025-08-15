import { getHomeContent } from '@/lib/markdown';
import type { FooterProps } from './footer.types';
import { siteMetadata } from '@/lib/navigation';

/**
 * Get footer data from home content
 */
export async function getFooterData(): Promise<FooterProps | null> {
  const homeContent = await getHomeContent();

  if (!homeContent) {
    // Return default footer data if home content is not available
    return {
      siteTitle: siteMetadata.title,
      footerBioText: 'Nina is a life coach, author, editor, and speaker.',
      footerMeetText: 'Schedule a free introductory session to learn how we can work together.',
      footerCredits: [],
      socialLinks: [],
    };
  }

  const { frontmatter } = homeContent;

  return {
    siteTitle: siteMetadata.title,
    footerBioImage: frontmatter.footerbioimage,
    footerBioText: frontmatter.footerbiotext,
    footerMeetText: frontmatter.footermeettext,
    footerCredits: frontmatter.footercredits || [],
    socialLinks: frontmatter.sociallinks || [],
  };
}

/**
 * Get social media icon based on URL
 */
export function getSocialIcon(url: string): string {
  if (url.includes('twitter') || url.includes('x.com')) {
    return 'twitter';
  } else if (url.includes('instagram')) {
    return 'instagram';
  } else if (url.includes('facebook')) {
    return 'facebook';
  } else if (url.includes('youtube')) {
    return 'youtube';
  } else {
    return 'earth';
  }
}
