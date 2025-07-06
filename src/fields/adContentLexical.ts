import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import type { TextFieldSingleValidation } from 'payload';

export const adContentLexical = lexicalEditor({
  features: () => [
    // Basic text formatting
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),

    // Headings (limited)
    HeadingFeature({
      enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'],
    }),

    // Links with simple configuration
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false;
          return true;
        });

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as Record<string, unknown>)?.linkType === 'internal') {
                return true;
              }
              return value ? true : 'URL is required';
            }) as TextFieldSingleValidation,
          },
        ];
      },
    }),

    // Lists
    OrderedListFeature(),
    UnorderedListFeature(),
    ChecklistFeature(),

    // Text alignment and indentation
    AlignFeature(),
    IndentFeature(),

    // Code and special text
    InlineCodeFeature(),
    SuperscriptFeature(),
    SubscriptFeature(),

    // Media uploads (limited)
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
      },
    }),

    // Layout elements
    ParagraphFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
  ],
});
