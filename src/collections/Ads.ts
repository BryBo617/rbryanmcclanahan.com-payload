import { adProviderField, customProviderField } from '@/fields/adProviders';
import { link } from '@/fields/link';
import type { CollectionConfig } from 'payload';

export const Ads: CollectionConfig = {
  slug: 'ads',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'startDate', 'endDate', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal title for the advertisement',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this ad is currently active',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image for the advertisement',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Text content for the advertisement',
      },
    },
    link({
      appearances: false,
    }),
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      admin: {
        description: 'Configure the call-to-action button/link for this ad',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable call-to-action for this ad',
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === true,
            description: 'Text to display on the CTA button/link',
          },
        },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Primary Button', value: 'primary-button' },
            { label: 'Secondary Button', value: 'secondary-button' },
            { label: 'Outline Button', value: 'outline-button' },
            { label: 'Text Link', value: 'text-link' },
            { label: 'Underlined Link', value: 'underlined-link' },
          ],
          defaultValue: 'primary-button',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === true,
            description: 'Visual style for the CTA',
          },
        },
        {
          name: 'size',
          type: 'select',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
          defaultValue: 'md',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === true,
            description: 'Size of the CTA button/link',
          },
        },
        {
          name: 'position',
          type: 'select',
          options: [
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Center Left', value: 'center-left' },
            { label: 'Center', value: 'center' },
            { label: 'Center Right', value: 'center-right' },
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Center', value: 'top-center' },
            { label: 'Top Right', value: 'top-right' },
          ],
          defaultValue: 'bottom-center',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === true,
            description: 'Position of the CTA within the ad',
          },
        },
        {
          name: 'customColors',
          type: 'group',
          label: 'Custom Colors',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === true,
            description: 'Override default colors (optional)',
          },
          fields: [
            {
              name: 'background',
              type: 'text',
              admin: {
                description: 'Background color (hex, rgb, or CSS color name)',
              },
            },
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Text color (hex, rgb, or CSS color name)',
              },
            },
            {
              name: 'border',
              type: 'text',
              admin: {
                description: 'Border color (hex, rgb, or CSS color name)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'weight',
      type: 'number',
      defaultValue: 1,
      min: 1,
      max: 10,
      admin: {
        description: 'Higher numbers = more likely to show (1-10)',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'When this ad should start showing (optional)',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'When this ad should stop showing (optional)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for organizing and filtering ads',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'Alt text for the ad image (SEO)',
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Title attribute for the ad (SEO)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for SEO purposes',
          },
        },
      ],
    },
    {
      name: 'campaign',
      type: 'group',
      label: 'Campaign & Analytics',
      fields: [
        adProviderField,
        customProviderField,
        {
          name: 'campaignId',
          type: 'text',
          admin: {
            description: 'Campaign ID from the advertising platform',
          },
        },
        {
          name: 'adGroupId',
          type: 'text',
          admin: {
            description: 'Ad Group ID (Google Ads, Microsoft Ads)',
          },
        },
        {
          name: 'adId',
          type: 'text',
          admin: {
            description: 'Specific Ad ID from the platform',
          },
        },
        {
          name: 'utmSource',
          type: 'text',
          admin: {
            description: 'UTM Source (e.g., google, facebook, newsletter)',
          },
        },
        {
          name: 'utmMedium',
          type: 'text',
          admin: {
            description: 'UTM Medium (e.g., cpc, banner, email)',
          },
        },
        {
          name: 'utmCampaign',
          type: 'text',
          admin: {
            description: 'UTM Campaign name',
          },
        },
        {
          name: 'utmTerm',
          type: 'text',
          admin: {
            description: 'UTM Term (keywords for paid search)',
          },
        },
        {
          name: 'utmContent',
          type: 'text',
          admin: {
            description: 'UTM Content (for A/B testing ad variations)',
          },
        },
        {
          name: 'customCode',
          type: 'textarea',
          admin: {
            description: 'Custom tracking code or pixel (HTML/JavaScript)',
          },
        },
        {
          name: 'goals',
          type: 'array',
          fields: [
            {
              name: 'goal',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'number',
              admin: {
                description: 'Goal value (optional)',
              },
            },
          ],
          admin: {
            description: 'Define conversion goals for this ad',
          },
        },
      ],
    },
  ],
};
