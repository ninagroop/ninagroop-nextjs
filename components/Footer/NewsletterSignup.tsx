'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SignupFormProps, NewsletterModalProps } from './footer.types';

// Skeleton loader component
const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-border-bg h-72 w-80 rounded-md"></div>
    </div>
  );
};

// Newsletter signup form with iframe
export const SignupForm: React.FC<SignupFormProps> = ({ className }) => {
  const [iframeLoading, setIframeLoading] = useState<'LOADING' | 'LOADED'>(
    'LOADING'
  );

  const handleIframeLoad = () => {
    setIframeLoading('LOADED');
  };

  return (
    <div className={cn('relative', className)}>
      {iframeLoading === 'LOADING' && <SkeletonLoader />}

      <iframe
        className={cn(
          'border-border rounded-md border bg-white',
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
const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[360px] max-w-[360px] bg-white shadow-xl"
        showCloseButton={false}
      >
        <DialogHeader className="flex items-center">
          <DialogTitle className="mb-4 text-2xl font-bold">
            Welcome!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          <p className="text-body-text text-center">
            If you&apos;d like to hear from me in your inbox or you&apos;d like
            to receive insight into your character strengths, sign up below.
            I&apos;d love to send you my newsletter and some free resources that
            will empower you.
          </p>

          <a
            href="https://ninagroop.substack.com/subscribe?utm_source=ninagroop.com&simple=true&next=https%3A%2F%2Fninagroop.substack.com%2Farchive"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-primary block w-full rounded-md px-4 py-2 text-center font-semibold !text-white transition-colors hover:bg-orange-600"
          >
            Sign Up
          </a>

          <SignupForm />

          <button
            onClick={() => onClose()}
            className="text-text-light hover:text-text-bold block w-full text-center transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
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
