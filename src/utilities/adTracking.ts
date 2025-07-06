import { getEffectiveProvider } from '@/fields/adProviders';
import type { Ad } from '@/payload-types';

// Type declarations for global tracking objects
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _hsq?: unknown[];
    dataLayer?: unknown[];
  }
}

export interface TrackingConfig {
  provider?: string;
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  customCode?: string;
}

export interface GlobalTrackingConfig {
  enableGlobalTracking?: boolean;
  trackingProvider?: string;
  rotatorCampaignId?: string;
  globalUtmSource?: string;
  globalUtmMedium?: string;
  globalCustomCode?: string;
}

/**
 * Builds UTM parameters from ad-specific and global tracking settings
 */
export function buildUtmParameters(ad: Ad, globalTracking?: GlobalTrackingConfig): URLSearchParams {
  const params = new URLSearchParams();

  // Use ad-specific UTM parameters first, fallback to global
  const utmSource = ad.campaign?.utmSource || globalTracking?.globalUtmSource;
  const utmMedium = ad.campaign?.utmMedium || globalTracking?.globalUtmMedium;
  const utmCampaign = ad.campaign?.utmCampaign || globalTracking?.rotatorCampaignId;
  const utmTerm = ad.campaign?.utmTerm;
  const utmContent = ad.campaign?.utmContent;

  if (utmSource) params.set('utm_source', utmSource);
  if (utmMedium) params.set('utm_medium', utmMedium);
  if (utmCampaign) params.set('utm_campaign', utmCampaign);
  if (utmTerm) params.set('utm_term', utmTerm);
  if (utmContent) params.set('utm_content', utmContent);

  return params;
}

/**
 * Builds a complete tracking URL with UTM parameters
 */
export function buildTrackingUrl(
  baseUrl: string,
  ad: Ad,
  globalTracking?: GlobalTrackingConfig,
): string {
  const url = new URL(baseUrl);
  const utmParams = buildUtmParameters(ad, globalTracking);

  // Append UTM parameters to the URL
  utmParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

/**
 * Generates tracking pixel HTML for various platforms
 */
export function generateTrackingPixel(provider: string, campaignId?: string): string {
  switch (provider) {
    case 'google-ads':
      return campaignId
        ? `<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-${campaignId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-${campaignId}');
</script>`
        : '';

    case 'facebook-pixel':
      return campaignId
        ? `<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${campaignId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${campaignId}&ev=PageView&noscript=1"
/></noscript>`
        : '';

    case 'ga4':
      return campaignId
        ? `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${campaignId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${campaignId}');
</script>`
        : '';

    case 'hubspot':
      return campaignId
        ? `<!-- HubSpot Tracking -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/${campaignId}.js"></script>`
        : '';

    default:
      return '';
  }
}

/**
 * Enhanced tracking pixel generator that handles custom providers
 */
export function generateTrackingPixelWithCustom(
  provider: string | null,
  customProvider?: string | null,
  campaignId?: string,
): string {
  const effectiveProvider = getEffectiveProvider(provider, customProvider);

  if (!effectiveProvider) return '';

  return generateTrackingPixel(effectiveProvider, campaignId);
}

/**
 * Tracks ad impression events
 */
export function trackAdImpression(ad: Ad, globalTracking?: GlobalTrackingConfig): void {
  // Track with Google Analytics 4 if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_impression', {
      campaign_id: ad.campaign?.campaignId || globalTracking?.rotatorCampaignId,
      ad_id: ad.campaign?.adId,
      ad_title: ad.title,
      provider: ad.campaign?.provider || globalTracking?.trackingProvider,
    });
  }

  // Track with Facebook Pixel if available
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: ad.title,
      content_category: 'advertisement',
      content_ids: [ad.campaign?.adId || ad.id.toString()],
    });
  }

  // Track with HubSpot if available
  if (typeof window !== 'undefined' && window._hsq) {
    window._hsq.push([
      'trackEvent',
      {
        id: 'ad_impression',
        value: {
          ad_title: ad.title,
          campaign_id: ad.campaign?.campaignId,
          ad_id: ad.campaign?.adId,
        },
      },
    ]);
  }
}

/**
 * Tracks ad click events
 */
export function trackAdClick(ad: Ad, globalTracking?: GlobalTrackingConfig): void {
  // Track with Google Analytics 4 if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      campaign_id: ad.campaign?.campaignId || globalTracking?.rotatorCampaignId,
      ad_id: ad.campaign?.adId,
      ad_title: ad.title,
      provider: ad.campaign?.provider || globalTracking?.trackingProvider,
    });
  }

  // Track with Facebook Pixel if available
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: ad.title,
      content_category: 'advertisement',
      content_ids: [ad.campaign?.adId || ad.id.toString()],
    });
  }

  // Track conversion goals
  if (ad.campaign?.goals) {
    ad.campaign.goals.forEach((goal) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: `${ad.campaign?.campaignId}/${goal.goal}`,
          value: goal.value || 1,
        });
      }
    });
  }
}

/**
 * Generates SEO-friendly attributes for ad images
 */
export function generateSeoAttributes(ad: Ad): {
  alt: string;
  title?: string;
  'aria-label'?: string;
} {
  return {
    alt: ad.seo?.altText || ad.title || 'Advertisement',
    title: ad.seo?.title || ad.title,
    'aria-label': `Advertisement: ${ad.title}`,
  };
}
