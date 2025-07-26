import * as migration_20250726_155604_nav_item_enabled from './20250726_155604_nav_item_enabled';

export const migrations = [
  {
    up: migration_20250726_155604_nav_item_enabled.up,
    down: migration_20250726_155604_nav_item_enabled.down,
    name: '20250726_155604_nav_item_enabled'
  },
];
