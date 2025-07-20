import type { Block } from 'payload';

import { defaultLexical } from '@/fields/defaultLexical';

export const ContentWithMedia: Block = {
  slug: 'contentWithMedia',
  interfaceName: 'ContentWithMedia',
  labels: {
    singular: 'Content with Media Block',
    plural: 'Content with Media Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
    },
    {
      label: 'Content Image',
      name: 'image',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    {
      name: 'contentBelowImage',
      label: 'Content Below Image',
      type: 'richText',
      editor: defaultLexical,
    },
    {
      label: 'Image Position',
      name: 'contentPosition',
      type: 'radio',
      options: ['Left', 'Right'],
    },
  ],
};
