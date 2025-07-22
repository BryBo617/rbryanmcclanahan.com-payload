import * as migration_20250722_130621_blog_posts from './20250722_130621_blog_posts';

export const migrations = [
  {
    up: migration_20250722_130621_blog_posts.up,
    down: migration_20250722_130621_blog_posts.down,
    name: '20250722_130621_blog_posts'
  },
];
