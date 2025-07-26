import { type MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE header_nav_items
    SET enabled = TRUE
    WHERE enabled IS NULL;
  `);
}
