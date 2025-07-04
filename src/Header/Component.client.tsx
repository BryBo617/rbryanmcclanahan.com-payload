'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { Header } from '@/payload-types';
import { Banner } from './Banner';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();

  useEffect(() => {
    setHeaderTheme('light');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className="container h-[450px] max-sm:landscape:h-[430px] sm:h-[400px] md:h-[500px] lg:h-[580px]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="flex h-[450px] max-sm:landscape:h-[430px] sm:h-[400px] md:h-[500px] lg:h-[580px] lg:w-[1280px]">
        <Banner data={data} />
      </div>
    </header>
  );
};
