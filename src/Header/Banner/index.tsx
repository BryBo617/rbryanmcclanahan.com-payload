import React from 'react';

import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import type { Header } from '@/payload-types';

import './banner.scss';

export const Banner: React.FC<{ data: Header }> = ({ data }) => {
  // const navItems = data?.navItems || [];
  const content = data?.richText;
  const media = data?.media;

  return (
    <div className="banner">
      <div className="banner-box">
        {content && <RichText className="content-wrapper" data={content} />}
      </div>
      {media && typeof media === 'object' && (
        <Media className="image" fill priority resource={media} />
      )}
    </div>
  );
};
