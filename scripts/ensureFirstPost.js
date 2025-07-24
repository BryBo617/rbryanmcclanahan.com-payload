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
      SELECT * FROM posts WHERE id = 1
      `);

    if (result.rows.length === 0 || !result.rows[0].id === 1) {
      // create post one and force its id to 1, with all required fields populated.
      console.log(`Inserting Post:`); // eslint-disable-line
      await client.query(`
        INSERT INTO posts (
          id,
          title,
          meta_title,
          meta_image_id,
          meta_description,
          published_at,
          slug,
          slug_lock,
          updated_at,
          created_at,
          _status,
          hero_image_id
        ) VALUES (
          1,
          'First Post',
          'First Post',
          NULL,
          'This is the first post.',
          NOW(),
          'first-post',
          TRUE,
          NOW(),
          NOW(),
          'draft',
          NULL
        )
        ON CONFLICT (id) DO NOTHING
      `);

      // Refetch the result query
      const insertedPost = await client.query(`
        SELECT id, title, slug, meta_title, meta_description, published_at, _status FROM posts WHERE id = 1
      `);
      console.log('Post 1', insertedPost.rows[0]?.title); // eslint-disable-line
      process.exit(0);
    } else {
      // else we don't have to insert it again.
      console.log('Post 1 Found', result.rows[0]?.title); // eslint-disable-line
      process.exit(0);
    }
  } catch (ex) {
    console.log(ex); // eslint-disable-line
    process.exit(1);
  }
}

ensureFirstPost();
