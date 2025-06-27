import RichText from '@/components/RichText';
import type { Footer } from '@/payload-types';
import { getCachedGlobal } from '@/utilities/getGlobals';

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();

  const content = footerData.richText;
  return (
    <footer className="mt-auto light:bg-card">
      <div className="rounded-t-2xl container py-8 gap-8 flex bg-[#bbb9a8] flex-col md:flex-row md:justify-center">
        <div>
          {content && (
            <RichText
              className="text-black text-sm"
              data={content || '©2025 R. Bryan McClanahan. All rights reserved.'}
            />
          )}
        </div>
      </div>
    </footer>
  );
}
