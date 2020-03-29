import assert from '@brillout/assert';

export {migrate_ancient_schema};

const key_replacements = {
  theme: 'clock_theme',
  bg_image: 'clock_background_image',
  bg_color: 'clock_background_color',
  font_shadow: 'clock_shadow',
  color_font: 'clock_color',
  font_size: 'clock_size',
  ['12_hour']: 'clock_twelve_hour_format',
  show_pm: 'clock_display_period',
  show_seconds: 'clock_display_seconds',
  show_date: 'clock_display_date',
  show_week: 'clock_display_week',
  show_seconds_title: 'clock_tab_display_seconds',
  color_icon: 'clock_tab_icon_color',
};

function migrate_ancient_schema() {
  if( !is_old_database() ){
    // Already or nothing to migrate
    return;
  }

  const db = {};

  Object
  .entries(localStorage)
  .forEach(([key, val]) => {
    const key__correct = key_replacements[key] || key;
    db[key__correct] = val;
  });

  if(db.clock_theme === '') {
    db.clock_theme = '_creator';
  }
  if(db.clock_theme === 'random') {
    db.clock_theme = '_random';
  }

  localStorage.clear();

  Object
  .keys(db)
  .forEach(key => {
    localStorage[key] = db[key];
  });
}

function is_old_database() {
  if( window.localStorage.getItem('theme')===null ){
    return false;
  }
  assert(window.localStorage['theme'].constructor===String);
  return true;
}
