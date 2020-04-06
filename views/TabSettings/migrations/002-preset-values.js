import assert from '@brillout/assert';

export {migrate_user_presets};

function migrate_user_presets() {
  ['countdown_presets', 'clock_presets']
  .forEach(presets__storage_key => {
    const presets__string = localStorage[presets__storage_key];
    if( !presets__string ) {
      return;
    }
    const presets = JSON.parse(presets__string);
    let has_changes = false;
    presets = (
      presets.map(preset => {
        if( preset.preset_name ) {
          preset.preset_id = preset.preset_name;
          delete preset.preset_name;
          has_changes = true;
        }
        if( preset.preset_options ) {
          preset.preset_values = preset.preset_options;
          delete preset.preset_options;
          has_changes = true;
        }
      })
    );
    if( has_changes ){
      localStorage[presets__storage_key] = JSON.stringify(presets);
    }
  });
}