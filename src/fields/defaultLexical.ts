import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UploadFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical';
import type { TextFieldSingleValidation } from 'payload';

export const defaultLexical = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    // Basic text formatting
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),

    // Headings
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    }),

    // Links with custom configuration
    LinkFeature({
      enabledCollections: ['pages', 'posts', 'forms'],
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
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true; // no validation needed, as no url should exist for internal links
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

    // Media uploads
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

    // Relationships
    RelationshipFeature(),

    // Layout elements
    ParagraphFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),

    // Toolbar features
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});
