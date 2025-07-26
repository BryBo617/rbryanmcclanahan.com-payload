'use client';

import React from 'react';

import type { Header as HeaderType } from '@/payload-types';

import { CMSLink } from '@/components/Link';

import { usePathname } from 'next/navigation';
import './nav.scss';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || [];
  const pathname = usePathname();

  return (
    <nav className="header-nav flex gap-3 justify-end">
      {navItems
        .filter((ni) => {
          // Build the href for comparison
          const { link } = ni;

          let href = '';

          if (
            link.type === 'reference' &&
            typeof link.reference?.value === 'object' &&
            link.reference.value.slug
          ) {
            href = `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`;
          } else if (link.type === 'custom' && link.url) {
            href = link.url;
          }

          return href !== pathname;
        })
        .map(({ link, enabled }, i) => {
          return enabled && <CMSLink key={i} {...link} appearance="default" />;
        })}
      {/* <Link href="/search">
      <span className="sr-only">Search</span>
      <SearchIcon className="w-5 text-primary" />
      </Link> */}
    </nav>
  );
};
