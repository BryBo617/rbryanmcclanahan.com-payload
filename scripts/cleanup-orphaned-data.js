import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function cleanupOrphanedData() {
  const client = await pool.connect();

  try {
    console.log('🔍 Checking for orphaned data in payload_locked_documents_rels...');

    // Check current orphaned records
    const orphanedCheck = await client.query(`
      SELECT
        r.id,
        r.ads_id,
        r.parent_id,
        r.path
      FROM payload_locked_documents_rels r
      LEFT JOIN ads a ON r.ads_id = a.id
      WHERE r.ads_id IS NOT NULL
        AND a.id IS NULL
    `);

    console.log(
      `Found ${orphanedCheck.rows.length} orphaned records in payload_locked_documents_rels`,
    );

    if (orphanedCheck.rows.length > 0) {
      console.log('Orphaned records:', orphanedCheck.rows);

      // Delete orphaned records
      const deleteResult = await client.query(`
        DELETE FROM payload_locked_documents_rels
        WHERE ads_id IN (
          SELECT r.ads_id
          FROM payload_locked_documents_rels r
          LEFT JOIN ads a ON r.ads_id = a.id
          WHERE r.ads_id IS NOT NULL
            AND a.id IS NULL
        )
      `);

      console.log(
        `✅ Deleted ${deleteResult.rowCount} orphaned records from payload_locked_documents_rels`,
      );
    } else {
      console.log('✅ No orphaned records found');
    }

    // Also check for other relation tables that might have orphaned ads references
    const tables = [
      'payload_locked_documents_rels',
      'pages_blocks_ad_rotator_ads',
      'posts_blocks_ad_rotator_ads',
    ];

    for (const table of tables) {
      try {
        const checkQuery = `
          SELECT COUNT(*) as count
          FROM information_schema.tables
          WHERE table_name = $1
        `;
        const tableExists = await client.query(checkQuery, [table]);

        if (tableExists.rows[0].count > 0) {
          console.log(`🔍 Checking ${table} for orphaned ads references...`);

          const orphanedInTable = await client.query(`
            SELECT
              r.id,
              r.ads_id
            FROM ${table} r
            LEFT JOIN ads a ON r.ads_id = a.id
            WHERE r.ads_id IS NOT NULL
              AND a.id IS NULL
          `);

          if (orphanedInTable.rows.length > 0) {
            console.log(`Found ${orphanedInTable.rows.length} orphaned ads references in ${table}`);

            const deleteFromTable = await client.query(`
              DELETE FROM ${table}
              WHERE ads_id IN (
                SELECT r.ads_id
                FROM ${table} r
                LEFT JOIN ads a ON r.ads_id = a.id
                WHERE r.ads_id IS NOT NULL
                  AND a.id IS NULL
              )
            `);

            console.log(`✅ Deleted ${deleteFromTable.rowCount} orphaned records from ${table}`);
          } else {
            console.log(`✅ No orphaned ads references found in ${table}`);
          }
        } else {
          console.log(`ℹ️ Table ${table} does not exist`);
        }
      } catch (error) {
        console.log(`⚠️ Could not check table ${table}: ${error.message}`);
      }
    }

    console.log('🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the cleanup
cleanupOrphanedData()
  .then(() => {
    console.log('✅ Database cleanup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  });
