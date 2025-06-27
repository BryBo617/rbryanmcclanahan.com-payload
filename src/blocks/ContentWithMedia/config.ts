import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

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
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'contentPosition',
      type: 'radio',
      options: ['Left', 'Right'],
    },
  ],
};
