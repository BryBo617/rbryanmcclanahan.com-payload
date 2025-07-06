import type { Field } from 'payload';

/**
 * Standardized ad provider options for consistent use across the application.
 * This approach avoids PostgreSQL enum issues while providing a clean dropdown interface.
 */

export const AD_PROVIDERS = [
  { label: 'Google Ads', value: 'google-ads' },
  { label: 'Google Analytics 4', value: 'ga4' },
  { label: 'Facebook Ads', value: 'facebook-ads' },
  { label: 'Facebook Pixel', value: 'facebook-pixel' },
  { label: 'LinkedIn Ads', value: 'linkedin-ads' },
  { label: 'Microsoft Ads (Bing)', value: 'microsoft-ads' },
  { label: 'HubSpot', value: 'hubspot' },
  { label: 'Twitter Ads', value: 'twitter-ads' },
  { label: 'TikTok Ads', value: 'tiktok-ads' },
  { label: 'Snapchat Ads', value: 'snapchat-ads' },
  { label: 'Pinterest Ads', value: 'pinterest-ads' },
  { label: 'Amazon DSP', value: 'amazon-dsp' },
  { label: 'Adobe Advertising Cloud', value: 'adobe-advertising' },
  { label: 'Custom/Other', value: 'custom' },
];

/**
 * Type-safe provider values derived from the options array
 */
export type AdProvider = (typeof AD_PROVIDERS)[number]['value'];

/**
 * Reusable field configuration for ad provider selection
 */
export const adProviderField: Field = {
  name: 'provider',
  type: 'select',
  options: AD_PROVIDERS,
  admin: {
    isClearable: true,
    description: 'Select the advertising platform or tracking provider',
  },
};

/**
 * Extended provider field with custom input fallback
 * Useful when you want to allow both predefined options and custom input
 */
export const adProviderFieldWithCustom: Field = {
  name: 'provider',
  type: 'select',
  options: AD_PROVIDERS,
  admin: {
    isClearable: true,
    description: 'Select the advertising platform. Choose "Custom/Other" for unlisted providers.',
  },
};

/**
 * Conditional custom provider field
 * Shows a text input when "custom" is selected
 */
export const customProviderField: Field = {
  name: 'customProvider',
  type: 'text',
  admin: {
    condition: (data: Record<string, unknown>, siblingData?: Record<string, unknown>) =>
      (siblingData?.provider || data?.provider) === 'custom',
    description: 'Enter the custom provider name (only shown when "Custom/Other" is selected)',
  },
} as const;

/**
 * Helper function to get the display name for a provider value
 */
export function getProviderDisplayName(value: string): string {
  const provider = AD_PROVIDERS.find((p) => p.value === value);
  return provider?.label || value;
}

/**
 * Helper function to validate if a provider value is valid
 */
export function isValidProvider(value: string): boolean {
  return AD_PROVIDERS.some((p) => p.value === value);
}

/**
 * Gets the effective provider name, handling custom providers
 */
export function getEffectiveProvider(
  provider?: string | null,
  customProvider?: string | null,
): string | null {
  if (provider === 'custom' && customProvider) {
    return customProvider;
  }
  return provider || null;
}

/**
 * Creates a provider field with custom condition logic
 * Useful for conditional provider fields in different contexts
 */
export function createProviderField(
  customCondition?: (
    data: Record<string, unknown>,
    siblingData?: Record<string, unknown>,
  ) => boolean,
) {
  return {
    name: 'provider',
    type: 'select' as const,
    options: AD_PROVIDERS,
    admin: {
      isClearable: true,
      description: 'Select the advertising platform or tracking provider',
      ...(customCondition && { condition: customCondition }),
    },
  };
}

/**
 * Creates a custom provider field with custom condition logic
 */
export function createCustomProviderField(
  customCondition?: (
    data: Record<string, unknown>,
    siblingData?: Record<string, unknown>,
  ) => boolean,
) {
  return {
    name: 'customProvider',
    type: 'text' as const,
    admin: {
      description: 'Enter custom provider name (only shown when "Custom/Other" is selected)',
      condition:
        customCondition ||
        ((data: Record<string, unknown>, siblingData?: Record<string, unknown>) =>
          (siblingData?.provider || data?.provider) === 'custom'),
    },
  };
}
