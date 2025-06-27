import { getCachedGlobal } from '@/utilities/getGlobals';
import { HeaderClient } from './Component.client';

import type { Header } from '@/payload-types';

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as Header;

  return <HeaderClient data={headerData} />;
}
