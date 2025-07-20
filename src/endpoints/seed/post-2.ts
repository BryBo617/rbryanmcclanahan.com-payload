import type { BannerBlock, MediaBlock } from '@/payload-types';
import { RequiredDataFromCollectionSlug } from 'payload';
import type { PostArgs } from './post-1';

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  const layout: (BannerBlock | MediaBlock)[] = [
    {
      blockType: 'banner',
      blockName: 'Disclaimer',
      style: 'info',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 1,
                  mode: 'normal',
                  style: '',
                  text: 'Disclaimer:',
                  version: 1,
                },
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: ' This content is fabricated and for demonstration purposes only. To edit this post, ',
                  version: 1,
                },
                {
                  type: 'link',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'navigate to the admin dashboard.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  fields: {
                    linkType: 'custom',
                    newTab: true,
                    url: '/admin',
                  },
                  format: '',
                  indent: 0,
                  version: 3,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 1,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      blockType: 'mediaBlock',
      blockName: '',
      media: blockImage.id,
    },
    {
      blockType: 'banner',
      blockName: 'Dynamic components',
      style: 'info',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ];

  return {
    slug: 'global-gaze',
    _status: 'published',
    authors: [author],
    layout,
    heroImage: heroImage.id,
    meta: {
      description:
        'Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.',
      image: heroImage.id,
      title: 'Global Gaze: Beyond the Headlines',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Global Gaze: Beyond the Headlines',
  };
};
