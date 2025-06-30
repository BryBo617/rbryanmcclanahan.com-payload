'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import type { Header as HeaderType } from '@/payload-types';

import { CMSLink } from '@/components/Link';

import './nav.scss';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || [];
  const pathname = usePathname();

  // Hide nav items if the route is contact-me
  if (pathname === '/contact-me') {
    return null;
  }

  return (
    <nav className="header-nav flex gap-3 justify-end">
      {/* I only want the contact nave item */}
      {/* hide the nav items if the route is contact-me */}
      {navItems
        .filter((ni) => ni.link.label === 'Contact Me')
        .map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="default" />;
        })}
      {/* <Link href="/search">
      <span className="sr-only">Search</span>
      <SearchIcon className="w-5 text-primary" />
      </Link> */}
    </nav>
  );
};
