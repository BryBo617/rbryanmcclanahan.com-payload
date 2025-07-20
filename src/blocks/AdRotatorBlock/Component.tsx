'use client';

import type { Ad, AdRotatorBlock as AdRotatorBlockProps, Media } from '@/payload-types';
import { buildTrackingUrl, trackAdClick, trackAdImpression } from '@/utilities/adTracking';
import { cn } from '@/utilities/ui';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  className?: string;
} & AdRotatorBlockProps;

export const AdRotatorBlock: React.FC<Props> = ({
  className,
  title,
  rotationInterval = 5000,
  pauseOnHover = true,
  showNavigation = true,
  ads,
  tracking,
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter active ads and convert to proper Ad type
  const activeAds = (ads || [])
    .filter((ad): ad is Ad => {
      return typeof ad === 'object' && ad !== null && 'active' in ad && ad.active !== false;
    })
    .filter((ad) => {
      // Check date ranges
      const now = new Date();
      const startDate = ad.startDate ? new Date(ad.startDate) : null;
      const endDate = ad.endDate ? new Date(ad.endDate) : null;

      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;

      return true;
    });

  // Auto-rotation effect
  useEffect(() => {
    if (activeAds.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, rotationInterval || 5000);

    return () => clearInterval(interval);
  }, [activeAds.length, isPaused, rotationInterval]);

  // Track impression when ad changes
  useEffect(() => {
    if (activeAds[currentAdIndex]) {
      const globalTracking = tracking?.enabled
        ? {
            enableGlobalTracking: true,
            trackingProvider: tracking.provider || undefined,
            rotatorCampaignId: tracking.campaignId || undefined,
            globalUtmSource: tracking.utmSource || undefined,
            globalUtmMedium: tracking.utmMedium || undefined,
            globalCustomCode: tracking.customCode || undefined,
          }
        : undefined;

      trackAdImpression(activeAds[currentAdIndex], globalTracking);
    }
  }, [currentAdIndex, activeAds, tracking]);

  const handleAdClick = useCallback(
    (ad: Ad) => {
      const globalTracking = tracking?.enabled
        ? {
            enableGlobalTracking: true,
            trackingProvider: tracking.provider || undefined,
            rotatorCampaignId: tracking.campaignId || undefined,
            globalUtmSource: tracking.utmSource || undefined,
            globalUtmMedium: tracking.utmMedium || undefined,
            globalCustomCode: tracking.customCode || undefined,
          }
        : undefined;

      trackAdClick(ad, globalTracking);
    },
    [tracking],
  );

  const buildAdUrl = useCallback(
    (ad: Ad): string => {
      let baseUrl = '';

      if (ad.link.type === 'custom' && ad.link.url) {
        baseUrl = ad.link.url;
      } else if (ad.link.type === 'reference' && ad.link.reference) {
        // Handle reference URL - this would need proper URL building based on your routing
        if (ad.link.reference.relationTo === 'pages') {
          const page = ad.link.reference.value as { slug?: string };
          baseUrl = `/page/${page.slug || ''}`;
        } else if (ad.link.reference.relationTo === 'posts') {
          const post = ad.link.reference.value as { slug?: string };
          baseUrl = `/blog/${post.slug || ''}`;
        }
      }

      if (!baseUrl) return '#';

      const globalTracking = tracking?.enabled
        ? {
            enableGlobalTracking: true,
            trackingProvider: tracking.provider || undefined,
            rotatorCampaignId: tracking.campaignId || undefined,
            globalUtmSource: tracking.utmSource || undefined,
            globalUtmMedium: tracking.utmMedium || undefined,
            globalCustomCode: tracking.customCode || undefined,
          }
        : undefined;

      return buildTrackingUrl(baseUrl, ad, globalTracking);
    },
    [tracking],
  );

  if (!activeAds.length) {
    return (
      <div className={cn('w-full p-4 bg-muted rounded-lg', className)}>
        <p className="text-sm text-muted-foreground">No active ads to display</p>
      </div>
    );
  }

  const currentAd = activeAds[currentAdIndex];
  if (!currentAd) {
    return (
      <div className={cn('w-full p-4 bg-muted rounded-lg', className)}>
        <p className="text-sm text-muted-foreground">No ad available</p>
      </div>
    );
  }

  const adUrl = buildAdUrl(currentAd);

  // Helper function to get CTA button classes
  const getCtaClasses = (cta: NonNullable<Ad['cta']>) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

    const sizeClasses: Record<string, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    };

    const styleClasses: Record<string, string> = {
      'primary-button': 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
      'secondary-button': 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md',
      'outline-button':
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md',
      'text-link': 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      'underlined-link':
        'text-primary underline underline-offset-4 hover:text-primary/80 p-0 h-auto',
    };

    const size = (cta.size as string) || 'md';
    const style = (cta.style as string) || 'primary-button';

    return cn(
      baseClasses,
      sizeClasses[size] || sizeClasses.md,
      styleClasses[style] || styleClasses['primary-button'],
    );
  };

  // Helper function to get position classes
  const getPositionClasses = (position: string) => {
    const positionMap: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'center-left': 'top-1/2 left-4 transform -translate-y-1/2',
      center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'center-right': 'top-1/2 right-4 transform -translate-y-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positionMap[position] || positionMap['bottom-center'];
  };

  return (
    <div
      className={cn('w-full relative', className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {title && <h3 className="text-lg font-semibold mb-2 sr-only">{title}</h3>}

      <div className="relative">
        {/* Main ad container with background image */}
        <div
          className={cn(
            'relative min-h-[200px] rounded-lg overflow-hidden',
            typeof currentAd.image === 'object' && currentAd.image
              ? 'bg-cover bg-center bg-no-repeat'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
          )}
          style={{
            backgroundImage:
              typeof currentAd.image === 'object' && currentAd.image
                ? `url('${(currentAd.image as Media).url}')`
                : undefined,
          }}
        >
          {/* Overlay for better text readability if needed */}
          {currentAd.cta?.enabled && typeof currentAd.image === 'object' && currentAd.image && (
            <div className="absolute inset-0 bg-black/20 rounded-lg" />
          )}

          {/* Content overlay */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
            {currentAd.content && (
              <div
                className={cn(
                  'flex-1 flex items-center',
                  typeof currentAd.image === 'object' && currentAd.image
                    ? 'text-white'
                    : 'text-gray-900 dark:text-gray-100',
                )}
              >
                <p className="text-sm md:text-base font-medium drop-shadow-lg">
                  {currentAd.content}
                </p>
              </div>
            )}

            {/* CTA Button/Link */}
            {currentAd.cta?.enabled && currentAd.cta?.text && (
              <div
                className={cn(
                  'absolute z-20',
                  getPositionClasses(currentAd.cta.position || 'bottom-center'),
                )}
              >
                <Link
                  href={adUrl}
                  target={currentAd.link.newTab ? '_blank' : '_self'}
                  onClick={() => handleAdClick(currentAd)}
                  className={getCtaClasses(currentAd.cta)}
                  style={{
                    ...(currentAd.cta.customColors?.background && {
                      backgroundColor: currentAd.cta.customColors.background,
                    }),
                    ...(currentAd.cta.customColors?.text && {
                      color: currentAd.cta.customColors.text,
                    }),
                    ...(currentAd.cta.customColors?.border && {
                      borderColor: currentAd.cta.customColors.border,
                    }),
                  }}
                >
                  {currentAd.cta.text}
                </Link>
              </div>
            )}
          </div>

          {/* Fallback link for entire ad if no CTA */}
          {!currentAd.cta?.enabled && (
            <Link
              href={adUrl}
              target={currentAd.link.newTab ? '_blank' : '_self'}
              onClick={() => handleAdClick(currentAd)}
              className="absolute inset-0 z-10"
              aria-label={currentAd.title}
            >
              <span className="sr-only">{currentAd.link.label || currentAd.title}</span>
            </Link>
          )}
        </div>

        {/* Navigation dots */}
        {showNavigation && activeAds.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {activeAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentAdIndex ? 'bg-white' : 'bg-white/60',
                )}
                aria-label={`Show ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Campaign Tracking Info (dev mode) */}
      {process.env.NODE_ENV === 'development' && tracking?.enabled && (
        <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400 text-xs">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Campaign Tracking (Dev)</h4>
          <div className="text-blue-600 space-y-1">
            {tracking.provider && (
              <p>
                Provider:{' '}
                {tracking.provider === 'custom' && tracking.customProvider
                  ? tracking.customProvider
                  : tracking.provider}
              </p>
            )}
            {tracking.campaignId && <p>Campaign ID: {tracking.campaignId}</p>}
            {tracking.utmSource && <p>UTM Source: {tracking.utmSource}</p>}
            {tracking.utmMedium && <p>UTM Medium: {tracking.utmMedium}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
