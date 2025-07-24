import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function ensureFirstPost() {
  const client = await pool.connect();

  try {
    console.log('🔍 Checking for Post 1'); // eslint-disable-line
    const result = await client.query(`
      SELECT id, title, slug FROM posts WHERE id = 1
      `);

    if (result.rows.length === 0 || !result.rows[0].id === 1) {
      // create post one and force it's id to 1.
      console.log(`Inserting Post:`); // eslint-disable-line
      await client.query(`
        INSERT INTO posts (id, title, slug)
        VALUES (1, 'First Post', 'first-post')
        ON CONFLICT (id) DO NOTHING
      `);

      // Refetch the result query
      const insertedPost = await client.query(`
        SELECT id, title, slug FROM posts WHERE id = 1
      `);
      console.log('Post 1', insertedPost.rows[0]?.title); // eslint-disable-line
      process.exit(0);
    } else {
      // else we don't have to insert it again.
      console.log('Post 1', result.rows[0].title); // eslint-disable-line
      process.exit(0);
    }
  } catch (ex) {
    console.log(ex); // eslint-disable-line
    process.exit(1);
  }
}

ensureFirstPost();
