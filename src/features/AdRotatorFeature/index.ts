import { AdRotatorBlock } from '@/blocks/AdRotatorBlock/config';
import { BlocksFeature } from '@payloadcms/richtext-lexical';

export const AdRotatorFeature = () => {
  return BlocksFeature({
    blocks: [AdRotatorBlock],
  });
};
