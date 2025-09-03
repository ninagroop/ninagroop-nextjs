'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavItem } from '@/types/navigation.types';

interface DropdownNavigationProps {
  nav: NavItem[];
}

const DropdownNavigation: React.FC<DropdownNavigationProps> = ({ nav }) => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center space-x-1">
      {nav.map((item) => {
        const hasSubNav = item.subnav && item.subnav.length > 0;
        const isActive =
          pathname === item.slug ||
          item.subnav?.some((subItem) => pathname === subItem.slug);

        return (
          <li key={item.slug}>
            {hasSubNav ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'no-text flex items-center px-4 py-2 text-sm font-medium tracking-wider uppercase hover:bg-transparent focus:border-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none active:outline-none',
                      isActive && 'font-semibold'
                    )}
                    style={{
                      color: isActive
                        ? 'var(--foreground-bold)'
                        : 'var(--link-color)',
                      textDecoration: 'none',
                      transition:
                        'color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--foreground-bold)';
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive
                        ? 'var(--foreground-bold)'
                        : 'var(--link-color)';
                      e.currentTarget.style.borderBottomColor =
                        'var(--foreground-light)';
                    }}
                  >
                    {item.title}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {item.subnav?.map((subItem) => (
                    <DropdownMenuItem key={subItem.slug} asChild>
                      <Link
                        href={subItem.slug}
                        className={cn(
                          'w-full cursor-pointer space-y-1 p-3 hover:outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none active:outline-none',
                          pathname === subItem.slug && 'text-accent-foreground'
                        )}
                      >
                        <div>
                          <div className="text-sm leading-none font-medium">
                            {subItem.title}
                          </div>
                          {subItem.description && (
                            <p className="text-muted-foreground mt-1 text-xs leading-snug">
                              {subItem.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={item.slug}
                className={cn(
                  'no-text inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium tracking-wider uppercase transition-colors',
                  'hover:bg-transparent hover:text-white',
                  isActive && 'text-text-bold font-semibold'
                )}
              >
                {item.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DropdownNavigation;
