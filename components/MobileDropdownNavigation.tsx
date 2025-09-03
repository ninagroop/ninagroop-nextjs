'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavItem } from '@/types/navigation.types';

interface MobileDropdownNavigationProps {
  nav: NavItem[];
  onClose: () => void;
}

const MobileDropdownNavigation: React.FC<MobileDropdownNavigationProps> = ({
  nav,
  onClose,
}) => {
  const pathname = usePathname();

  return (
    <nav className="mt-16 px-4">
      <ul className="space-y-2">
        {nav.map((item) => {
          const hasSubNav = item.subnav && item.subnav.length > 0;
          const isActive =
            pathname === item.slug ||
            item.subnav?.some((subItem) => pathname === subItem.slug);

          return (
            <li key={item.slug}>
              {hasSubNav ? (
                <Collapsible>
                  <CollapsibleTrigger
                    className={cn(
                      'no-text flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium tracking-wider uppercase transition-colors',
                      'text-text-bold hover:bg-border-bg',
                      isActive && 'text-text-bold bg-border-bg font-semibold'
                    )}
                  >
                    {item.title}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-2 ml-4 space-y-1">
                    {item.subnav?.map((subItem) => (
                      <Link
                        key={subItem.slug}
                        href={subItem.slug}
                        onClick={onClose}
                        className={cn(
                          'block rounded-lg px-4 py-2 text-sm transition-colors',
                          pathname === subItem.slug
                            ? 'font-medium text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <div className="font-medium">{subItem.title}</div>
                        {subItem.description && (
                          <div className="mt-1 text-xs text-gray-500">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.slug}
                  onClick={onClose}
                  className={cn(
                    'no-text block rounded-lg px-4 py-3 text-sm font-medium tracking-wider uppercase transition-colors',
                    'text-text-bold hover:bg-border-bg',
                    isActive && 'text-text-bold bg-border-bg font-semibold'
                  )}
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileDropdownNavigation;
