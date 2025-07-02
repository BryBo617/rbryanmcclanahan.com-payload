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
          return `/${ni.link.pageSlug === "''" ? '' : ni.link.pageSlug}` !== pathname;
        })
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
