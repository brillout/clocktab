import {migrate_user_presets} from './migrations/002-preset-values.js';

export {run_migrations};

function run_migrations() {
  migrate_user_presets();
}
