'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { SignupFormProps, NewsletterModalProps } from './footer.types';

// Skeleton loader component
const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-72 w-80 bg-gray-200 rounded-md"></div>
    </div>
  );
};

// Newsletter signup form with iframe
export const SignupForm: React.FC<SignupFormProps> = ({ className }) => {
  const [iframeLoading, setIframeLoading] = useState<'LOADING' | 'LOADED'>('LOADING');

  const handleIframeLoad = () => {
    setIframeLoading('LOADED');
  };

  return (
    <div className={cn('relative', className)}>
      {iframeLoading === 'LOADING' && <SkeletonLoader />}

      <iframe
        className={cn(
          'border border-gray-200 bg-white rounded-md',
          iframeLoading === 'LOADING' ? 'invisible absolute' : 'visible'
        )}
        src="https://ninagroop.substack.com/embed"
        width="320"
        height="290"
        frameBorder="0"
        scrolling="no"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

// Newsletter modal component
const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[360px] bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>

          <div className="space-y-4">
            <p className="text-center text-gray-700">
              If you&apos;d like to hear from me in your inbox or you&apos;d like to receive
              insight into your character strengths, sign up below. I&apos;d love to
              send you my newsletter and some free resources that will empower
              you.
            </p>

            <a
              href="https://ninagroop.substack.com/subscribe?utm_source=ninagroop.com&simple=true&next=https%3A%2F%2Fninagroop.substack.com%2Farchive"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </a>

            <SignupForm />

            <button
              onClick={onClose}
              className="block w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main newsletter signup component with modal
const NewsletterSignup: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const cookieKey = 'ninaGroopMarketingModalViewed';

    // Check if cookie exists
    if (!document.cookie.includes(`${cookieKey}=true`)) {
      // Set cookie for 120 days
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + 10368000);
      document.cookie = `${cookieKey}=true;expires=${expires.toUTCString()};path=/`;

      // Show modal after a short delay
      setTimeout(() => {
        setModalIsOpen(true);
      }, 1000);
    }
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="inline-block">
        <SignupForm />
      </div>

      <NewsletterModal isOpen={modalIsOpen} onClose={closeModal} />
    </>
  );
};

export default NewsletterSignup;
