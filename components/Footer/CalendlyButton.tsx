'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { CalendlyButtonProps } from './footer.types';
import type { PopupButton as PopupButtonType } from 'react-calendly';

const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  children,
  className,
  align = 'center',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [PopupButtonComponent, setPopupButtonComponent] = useState<
    typeof PopupButtonType | null
  >(null);

  useEffect(() => {
    // Dynamically import the PopupButton to avoid SSR issues
    import('react-calendly')
      .then((module) => {
        setPopupButtonComponent(() => module.PopupButton);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Calendly button:', error);
        setIsLoaded(true);
      });
  }, []);

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const buttonClasses = cn(
    'rounded-md bg-black px-6 py-3 font-semibold text-white',
    'transition-colors duration-200 hover:bg-gray-800',
    'focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none',
    className
  );

  const wrapperClasses = cn(
    'my-10 inline-block',
    alignmentClasses[align],
    align === 'center' && 'w-full text-center'
  );

  // Show a regular button as fallback while PopupButton loads or if it fails
  if (!isLoaded || !PopupButtonComponent) {
    return (
      <div className={wrapperClasses}>
        <button
          className={buttonClasses}
          onClick={() => {
            // Fallback: open Calendly in a new tab
            window.open('https://calendly.com/ninagroop', '_blank');
          }}
        >
          {children}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <PopupButtonComponent
        url="https://calendly.com/ninagroop"
        text={typeof children === 'string' ? children : 'Schedule Now'}
        className={buttonClasses}
        rootElement={
          (document.getElementById('__next') as HTMLElement) || document.body
        }
      />
    </div>
  );
};

export default CalendlyButton;
