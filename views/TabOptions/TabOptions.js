import load_font from './load_font';
import assert from '@brillout/assert';
import load_font_list from './load_font_list';
import ml from '../ml';
import set_background from './set_background';
import './tab-options.css';
import {TextInput, BooleanInput, SelectInput, ColorInput, DateInput, Button} from './PersistantInput';

export class TabOptions {
  constructor({
    option_spec_list,
    preset_spec_list,

    text_container,
    options_container,
    no_random_preset,

    on_any_change,
    on_font_change,

    enable_import_export,
    app_name,
  }) {
    this.text_container = text_container;
    this.options_container = options_container;
    this.no_random_preset = no_random_preset;

    this.on_any_change = on_any_change;
    this.on_font_change = on_font_change;

    this.enable_import_export = enable_import_export;
    this.app_name = app_name;

    this.preset_list = new PresetList({preset_spec_list, tab_options: this});
    this.option_list = instantiate_options({tab_options: this, option_spec_list});

    this.resolve_font_loaded_promise;
    this.font_loaded_promise = new Promise(r => this.resolve_font_loaded_promise = r);
  }

  generate_dom() {
    this.option_list.forEach(opt => {
      opt.generate_dom();
    });

    if( this.enable_import_export ){
      this.generate_import_export_dom();
    }

    this.global_side_effects({initial_run: true});
  }

  generate_import_export_dom() {
    {
      const btn = (
        new Button({
          input_container: this.options_container,
          text: 'Customize',
          on_click: () => {
            assert(!this.selected_preset.is_creator_preset);
            this.modify_preset();
          },
        })
      );
      btn.generate_dom();
      this.button_mod = btn;
    }

    {
      const btn = (
        new Button({
          input_container: this.options_container,
          text: 'Save as Share-able',
          on_click: () => {
            assert(this.selected_preset.is_creator_preset);
            this.save_created_preset();
          },
        })
      );
      btn.generate_dom();
      this.button_url = btn;
    }

    {
      /* TODO
      this.button_del = opt;
      on_click: () => {
        this.active_preset.remove();
      }
      */
    }

    {
      const name_option = new TextOption({
        option_id: 'name',
        option_description: 'Name of your preset',
        option_default: '',
        tab_options: this,
      });
      name_option.generate_dom();
      this.name_option = name_option;
    }
  }

  save_created_preset() {
    assert(this.selected_preset.is_creator_preset);

    const preset_name = this.name_option.input_value;
    if( !preset_name ){
      alert("You need to provide a preset name in order to save thepreset.");
      return;
    }

    const preset_options = {};
    this
    .option_list
    .filter(option => option.is_creator_option)
    .forEach(option => {
      const preset_val = option.input_value;
      assert([false, ''].includes(preset_val) || preset_val, option.option_id, preset_val===undefined, {preset_val});
      preset_options[option.option_id] = preset_val;
    });

    const new_preset = new SavedPreset({
      preset_name,
      preset_options,
      tab_options: this,
    });

    this.preset_list.save_preset(new_preset);
    this.select_preset(new_preset);
    this.reset_creator();
  }
  load_url_preset() {
    const data = retrieve_data_from_url();
    const {app_name, preset_options} = data;

    let {preset_name} = data;
    preset_name = this.preset_list.make_preset_name_unique(preset_name);

    const wrong_url_format = !preset_options;

    const wrong_app = app_name !== this.app_name;

    // Validation
    if( wrong_url_format || wrong_app ){
      alert("URL is incorrect, maybe you inadvertently modified the URL?");
      if( wrong_app ) {
        alert("Wrong app: the URL hash should be loaded in a different app.");
      }
      return;
    }

    const new_preset = new SavedPreset({
      preset_name,
      preset_options,
      tab_options: this,
    });

    this.preset_list.save_preset(new_preset);
    this.select_preset(new_preset);
  }
  reset_creator() {
    // Erase all custom option values
    this.option_list.forEach(option => {
      option.reset();
    });
  }

  modify_preset() {
    const {active_preset} = this;
    assert(!active_preset.is_creator_preset);
    Object.entries(active_preset.preset_options)
    .forEach(([opt_id, opt_val]) => {
      assert(!['preset_name', 'preset_id', 'id', 'name'].includes(opt_val));
      this
      .find_option(option => option.option_id === opt_id)
      .set_input_value(opt_val);
    });
    this.select_preset_creator();
  }


  #global_side_effects__timeout = null;
  global_side_effects({initial_run}={}) {
    if( initial_run ){
      this.run_side_effects(true);
      return;
    }
    if( this.#global_side_effects__timeout ){
      return;
    }
    this.#global_side_effects__timeout = requestAnimationFrame(() => {
      this.run_side_effects();
      this.#global_side_effects__timeout = null;
    });
  }
  run_side_effects(initial_run) {
    this.update_background();
    this.update_font();
    this.load_font_list();
    this.update_option_visibility();
    this.update_button_visibility();
    this.on_any_change({initial_run});
    this.update_share_link();
  }

  update_share_link() {
    const share_link = document.getElementById('share-link');
    if( ! this.select_preset.is_saved_preset ){
      share_link.removeAttribute('data-link');
    } else {
      share_link.setAttribute('data-link', this.select_preset.share_link);
    }
  }

  update_background() {
    const image = this.current_backgroud_image;
    const color = this.current_backgroud_color;
    set_background(image || color);
  }
  async update_font() {
    const {text_container} = this;
    const get_font_name = () => this.current_font_name;
    await load_text_font({text_container, get_font_name});
    this.on_font_change();
    this.resolve_font_loaded_promise();
  }
  update_option_visibility() {
    // Visibility of options
    const get_input_val = dep_option_id => this.find_option(option => option.option_id === dep_option_id).input_value;
    this.option_list.forEach(opt => {
      const to_hide = (
        opt.option_dependency && !get_input_val(opt.option_dependency) ||
        opt.is_creator_option && !this.selected_preset.is_creator_preset
      );
      if( to_hide ){
        opt.hide();
      } else {
        opt.show();
      }
    });
  }
  update_button_visibility() {
    if( ! this.enable_import_export ){
      return;
    }
    if( this.selected_preset.is_creator_preset ){
      this.button_mod.hide();
      this.button_url.show();
      this.name_option.show();
   // this.button_del.hide();
    } else {
      this.button_url.hide();
      this.name_option.hide();
   // this.button_del.hide();
      if( !this.selected_preset.is_randomizer_preset ){
        this.button_mod.show();
      } else {
        this.button_mod.hide();
      }
    }
  }
  #font_list_already_loading = false;
  async load_font_list() {
    if( !this.selected_preset.is_creator_preset ){
      return;
    }
    if( this.#font_list_already_loading ){
      return;
    }
    this.#font_list_already_loading = true;
    this.font_option.add_fonts(
      [
        SelectInput.get_divider(),
        ...await load_font_list()
      ]
    );
  }


  find_option(match) {
    const option = this.option_list.find(match);
    assert(option);
    return option;
  }

  get background_image_option() {
    return this.find_option(option => option.is_background_image_option);
  }
  get current_backgroud_image() {
    return this.background_image_option.active_value;
  }

  get background_color_option() {
    return this.find_option(option => option.is_background_color_option);
  }
  get current_backgroud_color() {
    return this.background_color_option.active_value;
  }

  get font_option() {
    return this.find_option(option => option.is_font_option);
  }
  get current_font_name() {
    return this.font_option.active_value;
  }


  get active_preset() {
    let active_preset;

    const {selected_preset} = this;
    if( selected_preset.is_randomizer_preset ){
      active_preset = selected_preset.random_preset;
    } else {
      active_preset = selected_preset;
    }

    assert(!active_preset.is_randomizer_preset);
    assert(active_preset.preset_name);

    return active_preset;
  }
  set active_preset(preset_thing) {
    let preset_name;
    if( preset_thing.constructor===String ) {
      preset_name = preset_thing;
    }
    if( (preset_thing instanceof Preset) || (preset_thing instanceof FakePreset) ){
      preset_name = preset_thing.preset_name;
    }
    assert(preset_name, {preset_thing, preset_name});
    this.preset_option.set_input_value(preset_name);
  }
  select_preset_creator() {
    this.active_preset = this.preset_list.creator_preset;
  }
  select_preset(preset) {
    this.active_preset = preset;
  }

  get selected_preset() {
    const preset_name = this.preset_option.input_value;
    const preset = this.preset_list.get_preset_by_name(preset_name);
    return preset;
  }
  get preset_option() {
    return this.find_option(option => option.is_preset_selector);
  }

  get_option_value(option_id) {
    return (
      this
      .find_option(option => option.option_id === option_id)
      .active_value
    );
  }
}

class Option {
  constructor({option_id, option_description, option_default, input_width, tab_options, ...props}) {
    assert(option_id);
    assert(option_description);
    assert(tab_options);
    Object.assign(this, {
      option_id,
      tab_options,
      ...props,
    });

    this.input_args = {
      input_id: option_id,
      input_description: option_description,
      on_input_change: () => { this.tab_options.global_side_effects() },
      input_default: option_default,
      input_container: this.tab_options.options_container,
      input_width,
    };
  }

  generate_dom() {
    if( this.before_dom ){
      this.before_dom();
    }
    assert(this.user_input);
    this.user_input.init();
  }

  get input_value() {
    return this.user_input.input_get();
  }
  get preset_value() {
    const preset_val = this.tab_options.active_preset.get_preset_value(this);
    return preset_val;
  }
  get active_value() {
    const {preset_value} = this;
    return preset_value!==null ? preset_value : this.input_value;
  }

  set_input_value(val) {
    this.user_input.input_set(val);
  }

  hide() {
    this.user_input.hide();
  }
  show() {
    this.user_input.show();
  }

  reset() {
    // TODO
  }
}

class DateOption extends Option {
  constructor(args) {
    super(args);
    this.user_input = new DateInput(this.input_args);
  }
}

class BooleanOption extends Option {
  constructor(args) {
    super(args);
    this.user_input = new BooleanInput(this.input_args);
  }
}

class SelectOption extends Option {
  constructor(args, input_options) {
    super(args);
    this.user_input = new SelectInput({input_options, ...this.input_args});
  }

  add_options(args) {
    this.user_input.add_options(args);
  }
}

class ChoiceOption extends SelectOption {
  constructor({option_choices, ...args}) {
    super({input_width: '100px', ...args}, option_choices);
  }
}

class TextOption extends Option {
  constructor({option_placeholder, ...args}) {
    super(args);
    this.input_args.input_placeholder = option_placeholder;
    this.user_input = new TextInput(this.input_args);
  }
}

class ColorOption extends Option {
  constructor(args) {
    super({input_width: '35px', ...args});
    this.user_input = new ColorInput(this.input_args);
  }
}
class TextColorOption extends ColorOption {
  /*
  local_side_effects() {
    this.tab_options.text_container.style.color = this.active_value;
  }
  */
}
class TextShadowOption extends TextOption {
  /*
  local_side_effects() {
    this.tab_options.text_container.style.textShadow = this.active_value;
  }
  */
}

class PresetOption extends SelectOption {
  constructor(args) {
    super({input_width: '93px', ...args});
    this.is_preset_selector = true;
  }

  before_dom() {
    this.user_input.input_options = this.get_input_options();
  }

  refresh() {
    this.before_dom();
    this.user_input.refresh();
  }

  get_input_options() {
    let {special_ones, saved_ones, native_ones} = this.tab_options.preset_list.presets_ordered;

    {
      const map = ({preset_name, preset_name_pretty}) => {
        assert(preset_name);
        assert(preset_name_pretty);
        return {val: preset_name, val_pretty: preset_name_pretty};
      };
      special_ones = special_ones.map(map);
      saved_ones = saved_ones.map(map);
      native_ones = native_ones.map(map);
    }

    return (
      saved_ones.length > 0 ? [
        ...special_ones,
        SelectInput.get_divider('Saved'),
        ...saved_ones,
       SelectInput.get_divider('Native'),
        ...native_ones,
      ] : [
        ...special_ones,
        SelectInput.get_divider(),
        ...native_ones,
      ]
    );
  }

  get input_value() {
    const val = super.input_value;

    // Older Clock Tab version saved creator selection as `''`;
    if( val==='' ){
      // Incentivize user to re-select the <Creator> preset
      return RandomizerPreset.randomizer_preset_name;
    }

    // New value is `_random`
    if( val==='random' ){
      return RandomizerPreset.randomizer_preset_name;
    }

    return val;
  }
}


class BackgroundImageOption extends TextOption {
  constructor(args) {
    super(args);
    this.is_background_image_option = true;
  }
}
class BackgroundColorOption extends ColorOption {
  constructor(args) {
    super(args);
    this.is_background_color_option = true;
  }
}

class FontOption extends SelectOption {
  constructor(args) {
    super({input_width: '110px', ...args});
    this.is_font_option = true;
  }

  before_dom() {
    this.user_input.input_options = this.tab_options.preset_list.get_all_preset_fonts();
  }

  get input_value() {
    const val = super.input_value;
    assert(val, {val});
    return val;
  }
  add_fonts(args) {
    this.add_options(args);
  }
}


async function load_text_font({text_container, get_font_name}) {
  const font_name = get_font_name();

  await load_font(font_name);

  if( font_name !== get_font_name() ){
    return;
  }

  if( font_name === text_container.style.fontFamily ){
    return;
  }

  text_container.style.fontFamily = font_name;
}

function instantiate_options({tab_options, option_spec_list}) {
  return (
    option_spec_list.map(({option_type, ...option_spec}) => {
      assert(option_spec.option_id, option_spec);
      const args = {
        ...option_spec,
        tab_options,
      };
      if( option_type === 'text-font-input' ){
        return new FontOption(args);
      }
      if( option_type === 'preset-input' ){
        return new PresetOption(args);
      }
      if( option_type === 'text-color-input' ){
        return new TextColorOption(args);
      }
      if( option_type === 'color-input' ){
        return new ColorOption(args);
      }
      if( option_type === 'text-shadow-input' ){
        return new TextShadowOption(args);
      }
      if( option_type === 'text-input' ){
        return new TextOption(args);
      }
      if( option_type === 'background-image-input' ){
        return new BackgroundImageOption(args);
      }
      if( option_type === 'background-color-input' ){
        return new BackgroundColorOption(args);
      }
      if( option_type === 'boolean-input' ){
        return new BooleanOption(args);
      }
      if( option_type === 'date-input' ){
        return new DateOption(args);
      }
      if( option_type === 'choice-input' ){
        return new ChoiceOption(args);
      }
      assert(false, {option_type});
    })
  );
}

class PresetList {
  #preset_savior = null;
  #native_presets = null;

  constructor({preset_spec_list, tab_options}) {
    this.tab_options = tab_options;

    this.#preset_savior = new PresetSavior({app_name: tab_options.app_name});

    if( !this.tab_options.no_random_preset ){
      this.randomizer_preset = new RandomizerPreset({preset_list: this});
    }
    this.creator_preset = new CreatorPreset();

    this.#native_presets = (
      Object.entries(preset_spec_list).map(([preset_name, preset_options]) =>
        new NativePreset({preset_name, preset_options, tab_options})
      )
    );
  }

  save_preset(preset) {
    this.#preset_savior.save_preset(preset);
    this.refresh_user_input();
  }
  remove_preset(preset) {
    // TN - use this
    this.#preset_savior.remove_preset(preset);
    this.refresh_user_input();
  }

  refresh_user_input() {
    this.tab_options.preset_option.refresh();
  }

  get random_candidates() {
    const {saved_ones, native_ones} = this.presets_ordered;
    if( saved_ones.length > 1 ) {
      return saved_ones;
    }
    return native_ones;
  }
  _get_saved_presets() {
    const {tab_options} = this;
    return (
      this
      .#preset_savior
      .get_saved_presets()
      .map(({preset_name, preset_options}) =>
        new SavedPreset({preset_name, preset_options, tab_options})
      )
    );
  }
  get presets_ordered() {
    const special_ones = [
      this.creator_preset,
    ];
    if( this.randomizer_preset ){
      special_ones.push(this.randomizer_preset);
    }

    const saved_ones = this._get_saved_presets();

    const native_ones = this.#native_presets;

    assert(special_ones && saved_ones && native_ones);
    return {special_ones, saved_ones, native_ones};
  }
  get_preset_by_name(preset_name) {
    assert(preset_name);
    const {special_ones, saved_ones, native_ones} = this.presets_ordered;
    const presets = [...special_ones, ...saved_ones, ...native_ones];
    for(let preset of presets){
      if( preset.preset_name === preset_name ){
        return preset;
      }
    }
    assert(false, {preset_name});
  }
  get_all_preset_fonts() {
    const {saved_ones, native_ones} = this.presets_ordered;
    const presets = [...saved_ones, ...native_ones];

    presets.forEach(preset => assert(preset.is_real_preset, preset.preset_id))

    let preset_font_names = (
      presets
      .map(preset => {
        const font_name = preset.preset_font_name;
        assert(font_name, preset.preset_name);
        return font_name;
      })
    );
    preset_font_names = make_unique(preset_font_names);
    return preset_font_names;
  }

  // TN - remove this and throw alert instead
  // - or use this to prefill preset name
  // - already show valiation error
  make_preset_name_unique(preset_name) {
    if( !this.get_preset_by_name(preset_name) ){
      return preset_name;
    }
    // TODO
  }
}

class Preset {
  constructor({preset_name, preset_options, tab_options}) {
    assert(preset_name);
    assert([Object, PresetValues].includes(preset_options.constructor));
    assert(tab_options);
    this.preset_name = preset_name;
    this.preset_options = preset_options;
    this.tab_options = tab_options;

    // Abstract class
    if (new.target === Preset) {
      throw new TypeError("Cannot construct Preset instances directly.");
    }
  }
  get_preset_value(option) {
    const {option_id} = option;
    assert(option_id);
    const {preset_options} = this;
    if( option_id in preset_options ){
      const val = preset_options[option_id];
      assert(val!==null);
      return val;
    }
    return null;
  }
  get is_real_preset() {
    return (
      !this.is_randomizer_preset &&
      !this.is_creator_preset
    );
  }
  get preset_font_name() {
    const preset_font_name = (
      this.get_preset_value(this.tab_options.font_option)
    );
    assert(preset_font_name);
    return preset_font_name;
  }
  get preset_name_pretty() {
    const prettified = prettify_preset_name(this.preset_name);
    assert(prettified);
    return prettified;
  }
}

class SavedPreset extends Preset {
  get is_saved_preset() {
    return true;
  }
  get share_link() {
    generate_url()
  }
}

class NativePreset extends Preset {
}


// TODO - use TypeScript
class PresetData {
  constructor({preset_name, preset_options, ...rest}) {
    assert(Object.keys(rest).length===0);
    assert(preset_name && preset_options);

    this.preset_name = preset_name;
    this.preset_options = new PresetValues(preset_options);
  }
}
class PresetValues {
  constructor(args) {
    assert(args.constructor===Object, args, args.constructor);

    // MIGRATE_TODO
    assert(args.countdown_font || args.clock_font, Object.keys(args));

    Object.assign(this, args);
  }
}

class PresetSavior {
  #app_name = null;

  constructor({app_name}) {
    assert(app_name);
    this.#app_name = app_name;
  }

  get_saved_presets() {
    return this._get_presets();
  }

  save_preset(preset) {
    const {preset_name, preset_options} = preset;
    assert(preset_name);
    assert(preset_options);

    const presets = this._get_presets();

    if( presets.find(preset => preset.preset_name === preset_name) ){
      assert.warning('Trying to save '+preset_name+' but it is already saved.');
      return;
    }

    const preset_data = new PresetData({preset_name, preset_options});
    presets.push(preset_data);

    this._save_presets(presets);
  }

  remove_preset(preset) {
    const {preset_name} = preset;
    assert(preset_name);

    let presets = this._get_presets();

    const old_length = presets.length;
    presets = presets.filter(preset => preset.preset_name !== preset_name);
    const new_length = presets.length;

    if( new_length === old_length ){
      assert.warning(false, 'Preset '+preset_name+' not found.');
    }
    if( new_length !== old_length - 1 ){
      assert.warning(false, 'Preset '+preset_name+' found multiple times.');
    }

    this._save_presets(presets);
  }

  _get_presets() {
    let presets = JSON.parse(localStorage[this._storage_key]|| JSON.stringify([]));

    // Validation
    assert(presets.constructor===Array);
    presets = presets.map(preset_data => new PresetData(preset_data));

    return presets;
  }
  _save_presets(presets) {
    // Validation
    assert(presets.constructor===Array);
    presets.forEach(preset_data => assert(preset_data instanceof PresetData));

    localStorage[this._storage_key] = JSON.stringify(presets);
  }
  get _storage_key() {
    return this.#app_name + '_presets';
  }
}

class FakePreset {
  get_preset_value() {
    return null;
  }
}

class RandomizerPreset extends FakePreset {
  #picked = null;
  constructor({preset_list}) {
    super();
    this.preset_name = RandomizerPreset.randomizer_preset_name;
    this.is_randomizer_preset = true;
    this.preset_list = preset_list;
  }
  get preset_name_pretty() {
    return '<Random>';
  }
  get random_preset() {
    if( ! this.#picked ){
      this.#picked = this.pick_random_preset();
    }
    assert(this.#picked.is_real_preset, this.#picked.preset_name, this.#picked);
    return this.#picked;
  }
  pick_random_preset(){
    const {random_candidates} = this.preset_list;
    const idx = Math.floor(Math.random()*random_candidates.length);
    return random_candidates[idx];
  }
}
RandomizerPreset.randomizer_preset_name='_random';
/*
RandomizerPreset.test = preset_name => (
  preset_name==='_random'
);
*/

class CreatorPreset extends FakePreset {
  constructor() {
    super();
    this.preset_name = CreatorPreset.creator_preset_name;
    this.is_creator_preset = true;
  }
  get preset_name_pretty() {
    return '<Creator>';
  }
}
CreatorPreset.creator_preset_name='_creator';
/*
CreatorPreset.test = preset_name => (
  preset_name==='_creator'
);
*/


function prettify_preset_name(val) {
  assert(val);
  return (
    val
    .replace(/[_-]/g,' ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  );
}

function make_unique(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}

// TN
// - rename preset_options to preset_values
// - rename preset_name to preset_id
// - migration & refactor localStorage usage
//   - Watch out for MIGRATE_TODO


// TODO-later
// What Preset values should be required before saving? What happens when the user sets some to ''?




function generate_url() {
      const data__json = JSON.stringify(data);
      const data__base64 = window.atob(data__json);
  // TODO
}

// TODO
function retrieve_data_from_url() {
  if( !data_url ){
    return null;
  }

  const _preset_options = {};

  // TODO
  validate_preset_options();

  return {app_name, preset_name, preset_options}
}

