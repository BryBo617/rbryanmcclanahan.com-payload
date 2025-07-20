import type { BannerBlock, Media, MediaBlock, User } from '@/payload-types';
import { RequiredDataFromCollectionSlug } from 'payload';

export type PostArgs = {
  heroImage: Media;
  blockImage: Media;
  author: User;
};

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  // Compose the layout array from the previous content blocks
  const layout: (BannerBlock | MediaBlock)[] = [
    // Banner block: Disclaimer
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
                      text: 'navigate to the admin dashboard',
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
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '.',
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
    // MediaBlock
    {
      blockType: 'mediaBlock',
      blockName: '',
      media: blockImage.id,
    },
    // Banner block: Dynamic Components
    {
      blockType: 'banner',
      blockName: 'Dynamic Components',
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
    slug: 'digital-horizons',
    _status: 'published',
    authors: [author],
    layout,
    heroImage: heroImage.id,
    meta: {
      description:
        'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
      image: heroImage.id,
      title: 'Digital Horizons: A Glimpse into Tomorrow',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Digital Horizons: A Glimpse into Tomorrow',
  };
};
