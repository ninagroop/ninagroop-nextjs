import type { SocialLink, FooterCredit } from '@/content/content.types';

export interface FooterProps {
  siteTitle: string;
  footerBioImage?: string;
  footerBioText: string;
  footerMeetText: string;
  footerCredits: FooterCredit[];
  socialLinks: SocialLink[];
}

export interface SignupFormProps {
  className?: string;
}

export interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type SocialIconType = 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'earth';

export interface CalendlyButtonProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}
