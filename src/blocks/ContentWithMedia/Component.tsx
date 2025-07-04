/* Added ContentWithMediaBlock to match my previous vite site. */
import React from 'react';

import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { ContentWithMedia } from '@/payload-types';

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
            <div className="flex flex-col items-center w-full h-auto">
              <Media
                resource={image}
                className="block w-full h-auto object-contain max-w-[400px] max-h-[400px]"
              />
              {contentBelowImage && (
                <RichText
                  className="text-center mt-2 text-sm"
                  data={contentBelowImage}
                  enableGutter={false}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
