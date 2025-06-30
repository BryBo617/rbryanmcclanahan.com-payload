import type { GlobalConfig } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical';

import { link } from '@/fields/link';
import { revalidateHeader } from './hooks/revalidateHeader';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature({
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'rel',
                label: 'Rel Attributes',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
            ],
          }),
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Banner Content',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
