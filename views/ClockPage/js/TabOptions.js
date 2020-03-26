import load_font from './load_font';
import assert from '@brillout/assert';
import {sleep} from '../../../tab-utils/sleep';
import loadFontList from './loadFontList';
import ml from '../../ml';
import setBackground from './setBackground';

export class TabOptions {
  constructor({
    option_spec_list,
    preset_list,
    text_container,
    options_container,
    on_any_change,
  }) {
    this.text_container = text_container;
    this.options_container = options_container;

    this.on_any_change = on_any_change;

    this.preset_list = preset_list;
    this.option_list = instantiate_options({tab_options: this, option_spec_list});

    this.resolve_font_loaded_promise;
    this.font_loaded_promise = new Promsie(r => this.resolve_font_loaded_promise = r);
  }

  generate_dom() {
    this.option_list.forEach(opt => {
      opt.generate_dom();
      opt.local_side_effects();
    });
    this.global_side_effects();
  }

  global_side_effects() {
    this.update_background();
    this.update_font();
    this.update_option_visibility();
    this.load_font_list();
    this.on_any_change();
  }

  update_background() {
    const image = this.get_backgroud_image();
    const color = this.get_backgroud_color();
    setBackground(image || color);
  }
  update_font() {
    const {text_container} = this;
    const get_font_name = () => this.get_font_name();
    await load_text_font({text_container, get_font_name});
    this.resolve_font_loaded_promise();
  }
  update_option_visibility() {
    this.option_list.forEach(opt => {
      const to_hide = (
        opt.option_dependency && !this.get_option_input(opt.option_dependency) ||
        opt.option_negative_dependency && this.get_option_input(opt.option_negative_dependency)
      );
      if( to_hide ){
        opt.hide();
      } else {
        opt.show();
      }
    });
  }
  load_font_list() {
    if( !this.is_custom_preset() ){
      return;
    }
    loadFontList(this.preset_font_names);
  }



  is_custom_preset() {
    const {current_preset} = this;
    assert(current_preset || current_preset===null);
    this.current_preset===null;
  }

  get preset_font_names() {
    const {font_option_id} = this;
    const presets = Object.values(this.preset_list)
    const preset_font_names = (
      Object.entries(presets)
      .map(([preset_name, preset]) => {
        const font_name = preset[font_option_id];
        assert(font_name, {preset_name, font_option_id, font_name});
        return font_name;
      })
    );

    return preset_font_names;
  }



  find_option_id(prop) {
    [
      'is_preset_selector',
      'is_font_selector',
      'is_background_color',
      'is_background_image',
    ].includes(prop);
    const option = this.option_list.find(opt => opt[prop]);
    assert(option, prop);
    return option.option_id;
  }
  get_backgroud_image() {
    this.get_option_value(this.find_option_id('is_background_image'));
  }
  get_backgroud_color() {
    this.get_option_value(this.find_option_id('is_background_color'));
  }
  get font_option_id() {
    const option_id = this.find_option_id('is_font_selector');
    return option_id;
  }
  get preset_option_id() {
    const option_id = this.find_option_id('is_preset_selector');
    return option_id;
  }
  get_font_name() {
    this.get_option_value(this.font_option_id);
  }

  get_option_value(option_id) {
    const {current_preset} = this;

    const is_defined_by_preset = (option_id in (current_preset||{}));

    if( is_defined_by_preset ) {
      return current_preset[option_id];
    } else {
      return this.get_option_input(option_id);
    }
  }
  get_option(option_id) {
    const option = this.option_list.find(opt => opt.option_id === option_id);
    assert(option, {option_id});
    return option;
  }
  get_option_input(option_id) {
    const option = this.get_option(option_id);
    return option.input_value;
  }

  get current_preset() {
    if( this.is_custom_preset() ){
      return null;
    }
    let preset_name = this.get_option_input(this.preset_option_id);
    if( preset_name==='random' ){
      preset_name = this.random_preset_name;
    }
    const preset = this.preset_list[preset_name];
    assert(preset, {preset_name});
    return prest;
  }

  get random_preset_name() {
    if( !this._random_theme_name ){
      const {preset_list} = this;
      const preset_names = Object.keys(preset_list);
      var idx = Math.floor(Math.random()*preset_names.length);
      const preset_name = preset_names[idx];
      assert(preset_list[preset_name]);
      this._random_theme_name = preset_name;
    }
    return this._random_theme_name;
  }
}


class Option {
  constructor({option_id, option_description, option_placeholder, option_default, tab_options}) {
    this.option_id = option_id;
    this.option_description = option_description;
    this.option_placeholder = option_placeholder;
    this.option_default = option_default;
    this.tab_options = tab_options;
  }

  generate_dom() {
    const {input_tag, input_type, option_id, option_description, option_default} = this;

    const on_input_change = () => {
      if( this.local_side_effects ) {
        this.local_side_effects();
      }
      this.tab_options.global_side_effects();
    };

    const {label_el, input_el} = generate_dom({input_tag, input_type, option_id, option_description, option_default, on_input_change});

    this.label_el = label_el;
    this.input_el = input_el;
  }

  get input_value() {
    return this.input_el.value;
  }

  hide() {
    hide_show_el(this.label_el, true);
  }
  show() {
    hide_show_el(this.label_el);
  }
}

class BooleanOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'checkbox';

  }
  generate_dom() {
    super.generate_dom();
    this.label_el['classList']['add']('pointer-cursor');
  }
  get input_value() {
    return !!this.input_el.checked;
  }
}

class ColorOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'color';
  }
  generate_dom() {
    super.generate_dom();
    this.input_el.style.width = '35px';
    this.label_el['classList']['add']('pointer-cursor');
  }
}
class TextColorOption extends ColorOption {
  local_side_effects() {
    this.tab_options.text_container.style.color = this.value;
  }
}

class TextShadowOption extends TextOption {
  local_side_effects() {
    this.tab_options.text_container.style.textShadow = this.value;
  }
}

class PresetOption extends SelectOption {
  constructor(args) {
    super(args);
    this.is_preset_selector = true;
  }

  generate_dom() {
    super.generate_dom();

    this.input_el.style.width = '83px';

    this.input_el.innerHTML = '<option label="<custom>" value="">&lt;custom&gt;</option><option label="<random>" value="random">&lt;random&gt;</option>';
    for(const preset_name in this.tab_options.preset_list) {
      var option_el = document.createElement('option');
      option_el.innerHTML = preset_name;
      option_el.value     = preset_name;
      input_el.appendChild(option_el);
    }
  }
}


class BackgroundImageOption extends TextOption {
  constructor(args) {
    super(args);
    this.is_background_image = true;
  }
}
class BackgroundColorOption extends TextOption {
  constructor(args) {
    super(args);
    this.is_background_color = true;
  }
}

class SelectOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'select';
  }
}

class TextFontOption extends SelectOption {
  constructor(args) {
    super(args);
    this.is_font_selector = true;
  }
  generate_dom() {
    super.generate_dom();
    this.input_el.style.width = '90px';
  }
}

class TextOption extens Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'text';
  }
  generate_dom() {
    super.generate_dom();

    if( this.option_placeholder ) {
      this.input_el.placeholder = this.option_placeholder;
    }

    const prefill = this.option_placeholder || this.option_default;
    if( prefill ){
      this.input_el.size = prefill.length*3/4;
    } else {
      this.input_el.style.width = '35px';
    }
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

function generate_dom({input_tag, input_type, option_id, option_description, option_default, on_input_change}) {
  assert(input_tag);
  assert(input_type);
  assert(option_id);
  assert(option_description);
  assert(option_default!==undefined);
  assert(on_input_change);

  const label_el = document.createElement('label');

  assert(['select', 'input'].includes(input_tag));
  const input_el = document.createElement(input_tag);
  input_el.id   = option_id;
  if( input_type ) input_el.setAttribute('type', input_type);

  const description_el = document.createElement('span');
  description_el.innerHTML = option_description;//+'&nbsp;';

  if( input_type==='checkbox' ){
    label_el.appendChild(input_el);
    label_el.appendChild(description_el);
  } else {
    label_el.appendChild(description_el);
    label_el.appendChild(input_el);
  }
  this.options_container.appendChild(label_el);

//ml.persistantInput=function(id,listener,default_,keyUpDelay,noFirstListenerCall)
  ml.persistantInput(
    option_id,
    on_input_change,
    option_default,
    0,
    true
  );

  return {label_el, input_el};
}

function hide_show_el(el, to_hide) {
  el.style.width      = to_hide ? '0px'     :''       ;
  el.style.height     = to_hide ? '0px'     :''       ;
  el.style.visibility = to_hide ? 'hidden'  :'visible';
  el.style.position   = to_hide ? 'absolute':''       ;
  el.style.zIndex     = to_hide ? '-1'      :''       ;
}

function instantiate_options({tab_options, option_spec_list}) {
  return (
    option_spec_list.map(option_spec => {
      const args = {
        ...option_spec,
        tab_options,
      };
      if( option_type === 'text-font-input' ){
        return new TextFontOption(args);
      }
      if( option_type === 'preset-input' ){
        return new PresetOption(args);
      }
      if( option_type === 'text-color-input' ){
        return new TextColorOption(args);
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
      assert(false, {option_type});
    })
  );
}

