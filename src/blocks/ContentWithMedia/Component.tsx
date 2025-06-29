/* Added ContentWithMediaBlock to match my previous vite site. */
import React from 'react';

import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { ContentWithMedia } from '@/payload-types';

import './contentWithMedia.scss';

export const ContentWithMediaBlock: React.FC<ContentWithMedia> = ({
  contentPosition,
  content,
  image,
  contentBelowImage,
}) => {
  return (
    <div className="container">
      <div
        className={`flex flex-col md:flex-row ${contentPosition === 'Right' ? 'md:flex-row-reverse' : ''} items-start gap-8`}
      >
        <div className="w-full md:w-3/4">
          {content && <RichText data={content} enableGutter={false} />}
        </div>
        {image && (
          <div className="w-full md:w-1/4">
            <Media resource={image} className="diploma w-full h-auto object-contain" />
            {contentBelowImage && (
              <RichText
                className="disclaimer text-center"
                data={contentBelowImage}
                enableGutter={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
