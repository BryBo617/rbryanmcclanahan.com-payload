import React from 'react';

import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { ContentWithMedia } from '@/payload-types';

export const ContentWithMediaBlock: React.FC<ContentWithMedia> = ({
  contentPosition,
  content,
  image,
}) => {
  return (
    <div className="container">
      <div
        className={`flex flex-col md:flex-row ${contentPosition === 'Right' ? 'md:flex-row-reverse' : ''} items-center gap-8`}
      >
        <div className="flex-1">{content && <RichText data={content} />}</div>
        {image && (
          <div className="flex-1 flex justify-center">
            <Media resource={image} className="diploma" />
          </div>
        )}
      </div>
    </div>
  );
};
