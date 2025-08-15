import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { FooterProps } from './footer.types';
import { getSocialIcon } from './footer.config';
import CalendlyButton from './CalendlyButton';
import NewsletterSignup from './NewsletterSignup';

const Footer: React.FC<FooterProps> = ({
  siteTitle,
  footerBioImage,
  footerBioText,
  footerMeetText,
  footerCredits,
  socialLinks,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - About Nina */}
          <div className="space-y-6">
            <h5 className="text-xl font-semibold text-gray-900">About Nina</h5>

            <p className="text-gray-700 leading-relaxed">
              {footerBioText}
            </p>

            {footerBioImage && (
              <div className="relative w-full max-w-[300px]">
                <Image
                  src={`/images/${footerBioImage}`}
                  alt="Nina Groop"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-md"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="pt-4">
              <NewsletterSignup />
            </div>
          </div>

          {/* Right Column - Connect and Meet Nina */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Connect Section */}
            <div className="space-y-4">
              <h5 className="text-xl font-semibold text-gray-900">Connect</h5>

              <div className="space-y-3">
                {socialLinks.map((link, idx) => {
                  const iconName = getSocialIcon(link.url);

                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-3',
                        'text-gray-700 hover:text-gray-900',
                        'transition-colors duration-200',
                        'group'
                      )}
                    >
                      <Image
                        src={`/images/${iconName}.svg`}
                        alt={link.title}
                        width={32}
                        height={32}
                        className="flex-shrink-0 group-hover:opacity-80 transition-opacity"
                      />
                      <span className="font-medium">{link.title}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Meet Nina Section */}
            <div className="space-y-4">
              <h5 className="text-xl font-semibold text-gray-900">Meet Nina</h5>

              <p className="text-gray-700 leading-relaxed">
                {footerMeetText}
              </p>

              <CalendlyButton className="w-full sm:w-auto">
                Schedule Now
              </CalendlyButton>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-600 text-center md:text-left">
            <span>© {currentYear} {siteTitle}</span>

            <span className="mx-2">|</span>

            <span>
              Built with{' '}
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Next.js
              </Link>
            </span>

            {footerCredits.map((credit, idx) => (
              <React.Fragment key={idx}>
                <span className="mx-2">|</span>
                <span>
                  {credit.text}{' '}
                  <a
                    href={credit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {credit.linktext}
                  </a>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
