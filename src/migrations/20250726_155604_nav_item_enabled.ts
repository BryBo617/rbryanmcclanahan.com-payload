/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-vercel-postgres';

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const header = await payload.findGlobal({ slug: 'header' });

  if (header && Array.isArray(header.navItems)) {
    let updated = false;
    const navItems = header.navItems.map((item) => {
      if (typeof item.enabled === 'undefined') {
        updated = true;
        return { ...item, enabled: true };
      }
      return item;
    });

    if (updated) {
      await payload.updateGlobal({
        slug: 'header',
        data: { ...header, navItems },
      });
      payload.logger.info('Migration: Set default enabled=true for header.navItems');
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const header = await payload.findGlobal({ slug: 'header' });

  if (header && Array.isArray(header.navItems)) {
    let updated = false;
    const navItems = header.navItems.map((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'enabled')) {
        const { enabled, ...rest } = item;
        updated = true;
        return rest;
      }
      return item;
    });

    if (updated) {
      await payload.updateGlobal({
        slug: 'header',
        data: { ...header, navItems },
      });
      payload.logger.info('Migration: Removed enabled from header.navItems');
    }
  }
}
