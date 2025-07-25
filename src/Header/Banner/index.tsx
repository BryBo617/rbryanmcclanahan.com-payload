import React from 'react';

import RichText from '@/components/RichText';
import type { Header } from '@/payload-types';
import { cn } from '@/utilities/ui';

import { HeaderNav } from '../Nav';

export const Banner: React.FC<{ data: Header }> = ({ data }) => {
  const content = data?.richText;
  const media = data?.media;

  return (
    <div className="flex relative justify-stretch items-stretch w-full h-full">
      <div
        className={cn(
          'absolute z-[2] flex flex-col rounded-lg',
          'w-[88%] sm:w-[60%] md:w-[55%] md:max-w-[90%] lg:w-[55%] lg:max-w-[80%]',
          'top-[60px]',
          'left-1/2 -translate-x-1/2',
          'max-sm:landscape:left-auto max-sm:landscape:translate-x-0 max-sm:landscape:ml-2 max-sm:landscape:mr-2',
          'sm:left-auto sm:translate-x-0 sm:ml-6 sm:mr-4',
          'md:ml-6',
          'lg:left-[30px] lg:translate-x-0 lg:ml-0',
          'p-3 landscape:p-2 sm:p-4 md:p-5 lg:p-6',
          'min-w-[280px] min-h-[180px]', // Smallest device min width/height
          'max-w-full max-h-full', // Never grow beyond background image
        )}
        style={{
          backgroundColor: 'hsl(var(--banner-primary) / 0.5)',
          border: '1px solid hsl(var(--banner-secondary) / 0.5)',
          boxShadow: '0 4px 8px hsl(var(--banner-secondary))',
        }}
      >
        {content && (
          <RichText
            className={cn(
              '[&_h1]:text-[1.8em] sm:[&_h1]:text-[2.2em] md:[&_h1]:text-[2.8em] lg:[&_h1]:text-[3.5em]',
              '[&_h1]:p-0 [&_h1]:m-0 [&_h1]:leading-tight',
              '[&_h3]:text-sm sm:[&_h3]:text-base md:[&_h3]:text-[1.1em]',
              '[&_h3]:mt-1 sm:[&_h3]:mt-0 md:[&_h3]:mt-[0.2em]',
              '[&_p]:text-sm sm:[&_p]:text-base [&_p]:py-[0.3em] sm:[&_p]:py-[0.5em]',
              '[&_p]:leading-relaxed',
              'overflow-auto flex-1', // Allow RichText to scroll if needed
            )}
            data={content}
          />
        )}
        <HeaderNav data={data} />
      </div>

      {/* Background Image */}
      {media && typeof media === 'object' && (
        <div
          className={cn('relative w-full h-full z-[1]', 'overflow-hidden rounded-b-lg')}
          style={{
            backgroundColor: 'hsl(var(--banner-primary) / 0.35)',
            border: '0.1em solid hsl(var(--banner-secondary))',
            backgroundImage: `url(${typeof media === 'object' && media?.url ? media.url : ''})`,
            backgroundSize: 'cover',
            backgroundPosition: '80% 25%', // More right-biased
            backgroundRepeat: 'no-repeat',
            maxWidth: '100vw',
          }}
        >
          <div
            className="absolute inset-0 rounded-b-lg"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--banner-primary) / 0.15) 0%, hsl(var(--banner-primary) / 0.05) 50%, transparent 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
