import { AD_PROVIDERS } from '@/fields/adProviders';
import type { Block } from 'payload';

export const AdRotatorBlock: Block = {
  slug: 'adRotator',
  interfaceName: 'AdRotatorBlock',
  labels: {
    singular: 'Ad Rotator',
    plural: 'Ad Rotators',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Title for this ad rotator instance',
      },
    },
    {
      name: 'layoutZone',
      type: 'select',
      options: [
        { label: 'Header Banner', value: 'header' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Content Block', value: 'content' },
        { label: 'Footer', value: 'footer' },
      ],
      defaultValue: 'content',
      admin: {
        description: 'Choose the layout zone where this ad rotator will be displayed',
      },
    },
    {
      name: 'placement',
      type: 'select',
      options: [
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Right', value: 'bottom-right' },
      ],
      defaultValue: 'top-left',
      admin: {
        description: 'Choose the positioning within the layout zone',
      },
    },
    {
      name: 'rotationInterval',
      type: 'number',
      defaultValue: 5000,
      min: 1000,
      admin: {
        description: 'Time in milliseconds between ad rotations (1000 = 1 second)',
      },
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show dots navigation for manual ad selection',
      },
    },
    {
      name: 'ads',
      type: 'relationship',
      relationTo: 'ads',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select ads to display in this rotator',
      },
    },
    {
      name: 'tracking',
      type: 'group',
      label: 'Campaign Tracking',
      admin: {
        description: 'Apply tracking parameters to all ads in this rotator',
      },
      fields: [
        {
          name: 'enabled',
          type: 'text',
          defaultValue: 'false',
          admin: {
            description: 'Enable tracking for all ads in this rotator (true/false)',
          },
        },
        {
          name: 'provider',
          type: 'select',
          options: AD_PROVIDERS,
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === 'true',
            description: 'Select the tracking provider for this ad rotator',
            isClearable: true,
          },
        },
        {
          name: 'customProvider',
          type: 'text',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.enabled === 'true' && siblingData?.provider === 'custom',
            description: 'Enter custom provider name (only shown when "Custom/Other" is selected)',
          },
        },
        {
          name: 'campaignId',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === 'true',
            description: 'Campaign ID for this ad rotator',
          },
        },
        {
          name: 'utmSource',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === 'true',
            description: 'Default UTM source for all ads (can be overridden per ad)',
          },
        },
        {
          name: 'utmMedium',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === 'true',
            description: 'Default UTM medium for all ads (can be overridden per ad)',
          },
        },
        {
          name: 'customCode',
          type: 'textarea',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled === 'true',
            description: 'Global tracking code applied to all ads in this rotator',
          },
        },
      ],
    },
  ],
};
