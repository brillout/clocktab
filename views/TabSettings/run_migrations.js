import {migrate_user_presets} from './migrations/002-user-presets.js';
import {migrate_ancient_schema} from './migrations/001-ancient-schema.js';

export {run_migrations};

function run_migrations() {
  if( typeof window === "undefined" ){
    return;
  }
  migrate_user_presets();
  migrate_ancient_schema();
}
