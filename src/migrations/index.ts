import * as migration_20250724_230708_add_blog from './20250724_230708_add_blog';

export const migrations = [
  {
    up: migration_20250724_230708_add_blog.up,
    down: migration_20250724_230708_add_blog.down,
    name: '20250724_230708_add_blog'
  },
];
