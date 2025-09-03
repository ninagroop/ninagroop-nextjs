'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/navigation.types';
import DropdownNavigation from './DropdownNavigation';
import MobileDropdownNavigation from './MobileDropdownNavigation';

interface HeaderProps {
  siteTitle: string;
  siteDescription: string;
  nav: NavItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  nav: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, nav }) => {
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
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-text-bold hover:bg-border-bg absolute top-4 right-4 rounded-lg p-2 transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="h-6 w-6"
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
        <MobileDropdownNavigation nav={nav} onClose={onClose} />
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
    const isStorePage = storePages.some((page) => pathname?.startsWith(page));
    const isStoreNavItem = storePages.some((page) =>
      item.slug.startsWith(page)
    );

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
          'fixed top-0 right-0 left-0 z-30 bg-white transition-all duration-300',
          isScrolled && 'shadow-md',
          !isVisible && '-translate-y-full'
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Site Title */}
            <Link
              href="/"
              className="brand navbar-heading text-brand-orange text-xl tracking-wide transition-opacity hover:opacity-80 sm:text-2xl"
            >
              {siteTitle}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <DropdownNavigation nav={filteredNav} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-text-bold hover:bg-border-bg rounded-lg p-2 transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
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
        <div className="py-12 text-center sm:py-16 lg:py-20">
          <h1 className="brand brand-title mb-4 text-4xl tracking-wide sm:text-5xl lg:text-6xl">
            {siteTitle}
          </h1>
          <h2 className="brand brand-subtitle text-lg font-light tracking-wide sm:text-xl lg:text-2xl">
            {siteDescription}
          </h2>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        nav={filteredNav}
      />
    </>
  );
};

export default Header;
