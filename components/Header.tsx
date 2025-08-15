'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/navigation.types';

interface HeaderProps {
  siteTitle: string;
  siteDescription: string;
  nav: NavItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  nav: NavItem[];
  pathname: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, nav, pathname }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation items */}
        <nav className="mt-16 px-4">
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.slug}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 text-sm uppercase tracking-wider font-medium rounded-lg transition-colors',
                    'hover:bg-gray-100',
                    pathname === item.slug && 'bg-gray-100 font-semibold'
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

const Header: React.FC<HeaderProps> = ({ siteTitle, siteDescription, nav }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we've scrolled down
      setIsScrolled(currentScrollY > 20);

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter navigation items based on current page
  const filteredNav = nav.filter((item) => {
    // Hide store/checkout navigation items when not on those pages
    const storePages = ['/store', '/checkout', '/product'];
    const isStorePage = storePages.some(page => pathname?.startsWith(page));
    const isStoreNavItem = storePages.some(page => item.slug.startsWith(page));

    if (isStoreNavItem && !isStorePage) {
      return false;
    }

    return true;
  });

  return (
    <>
      {/* Fixed header with hide on scroll */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 bg-white transition-all duration-300',
          isScrolled && 'shadow-md',
          !isVisible && '-translate-y-full'
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Site Title */}
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl tracking-wide hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'Liu Jian Mao Cao, cursive' }}
            >
              {siteTitle}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-1">
                {filteredNav.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.slug}
                      className={cn(
                        'px-4 py-2 text-sm uppercase tracking-wider font-medium transition-colors',
                        'hover:text-gray-600',
                        pathname === item.slug && 'text-black font-semibold'
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16" />

      {/* Hero Section - Only show on home page */}
      {pathname === '/' && (
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl tracking-wide mb-4"
            style={{ fontFamily: 'Liu Jian Mao Cao, cursive' }}
          >
            {siteTitle}
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light tracking-wide">
            {siteDescription}
          </h2>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        nav={filteredNav}
        pathname={pathname}
      />
    </>
  );
};

export default Header;
