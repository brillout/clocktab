import load_font from './load_font';
import assert from '@brillout/assert';
import load_font_list from './load_font_list';
import ml from '../ml';
import set_background from './set_background';
import './tab-options.css';

export class TabOptions {
  constructor({
    option_spec_list,
    preset_list,
    text_container,
    options_container,
    no_random_preset,
    on_any_change,
    on_font_change,
  }) {
    this.text_container = text_container;
    this.options_container = options_container;
    this.no_random_preset = no_random_preset;

    this.on_any_change = on_any_change;
    this.on_font_change = on_font_change;

    this.preset_list = preset_list;
    this.option_list = instantiate_options({tab_options: this, option_spec_list});

    this.resolve_font_loaded_promise;
    this.font_loaded_promise = new Promise(r => this.resolve_font_loaded_promise = r);
  }

  generate_dom() {
    this.option_list.forEach(opt => {
      opt.generate_dom();
    });
    this.global_side_effects({initial_run: true});
  }

  global_side_effects({initial_run}={}) {
    this.update_background();
    this.update_font();
    this.update_option_visibility();
    this.load_font_list();
    this.on_any_change({initial_run});
  }

  update_background() {
    const image = this.get_backgroud_image();
    const color = this.get_backgroud_color();
    set_background(image || color);
  }
  async update_font() {
    const {text_container} = this;
    const get_font_name = () => this.get_font_name();
    await load_text_font({text_container, get_font_name});
    this.on_font_change();
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
    if( !this.is_custom_preset ){
      return;
    }
    const fonts = this.preset_font_names;
    const {font_option_id} = this;
    load_font_list({fonts, font_option_id});
  }


  get preset_font_names() {
    const {font_option_id} = this;
    const preset_font_names = (
      Object.entries(this.preset_list)
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
    return this.get_option_value(this.find_option_id('is_background_image'));
  }
  get_backgroud_color() {
    return this.get_option_value(this.find_option_id('is_background_color'));
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
    return this.get_option_value(this.font_option_id);
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
    let preset_name = this.get_option_input(this.preset_option_id);
    if( !preset_name ){
      return null;
    }
    if( preset_name==='random' ){
      preset_name = this.random_preset_name;
    }
    const preset = this.preset_list[preset_name];
    assert(preset, {preset_name});
    return preset;
  }

  get random_preset_name() {
    if( !this._random_theme_name ){
      const {preset_list} = this;
      const preset_names = Object.keys(preset_list);
      var idx = Math.floor(Math.random()*preset_names.length);
      const preset_name = preset_names[idx];
      assert(preset_list[preset_name], {preset_name});
      this._random_theme_name = preset_name;
    }
    return this._random_theme_name;
  }

  get is_custom_preset() {
    const {current_preset} = this;
    assert(current_preset || current_preset===null);
    return this.current_preset===null;
  }
}


class Option {
  constructor(props) {
    Object.assign(this, props);
  }

  generate_option() {
    const {option_id, option_description} = this;
    const {input_tag, input_type} = this;
    assert(input_tag);
    assert(input_type || input_tag!=='input');
    const {label_el, input_el} = generate_option({input_tag, input_type, option_id, option_description});
    this.label_el = label_el;
    this.input_el = input_el;
  }

  generate_dom() {
    const on_input_change = () => {
      this.tab_options.global_side_effects();
    };

    const {options_container} = this.tab_options;
    const {label_el, input_tag, input_type, option_id, option_description, option_default} = this;

    activate_option({options_container, label_el, option_id, on_input_change, option_default});
  }

  get input_value() {
    return this.input_el.value;
  }

  get option_value() {
    return this.tab_options.get_option_value(this.option_id);
  }

  hide() {
    hide_show_el(this.label_el, true);
  }
  show() {
    hide_show_el(this.label_el);
  }
}

class DateOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'datetime';
  }
  generate_dom() {
    this.generate_option();
    super.generate_dom();
  }
}

class BooleanOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'checkbox';
  }
  generate_dom() {
    this.generate_option();
    this.label_el['classList']['add']('pointer-cursor');
    super.generate_dom();
  }
  get input_value() {
    return !!this.input_el.checked;
  }
}

class SelectOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'select';
  }
}

class ChoiceOption extends SelectOption {
  generate_dom() {
    this.generate_option();

    this.input_el.style.width = '100px';

    this.option_choices.forEach(choice => {
      const option_el = document.createElement('option');
      option_el.innerHTML = choice;
      option_el.value     = choice;
      this.input_el.appendChild(option_el);
    });

    super.generate_dom();
  }
}

class TextOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'text';
  }
  generate_dom() {
    this.generate_option();

    if( this.option_placeholder ) {
      this.input_el.placeholder = this.option_placeholder;
    }

    const prefill = this.option_placeholder || this.option_default;
    if( prefill ){
      this.input_el.size = prefill.length*3/4;
    } else {
      this.input_el.style.width = '35px';
    }

    super.generate_dom();
  }
}

class ColorOption extends Option {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'color';
  }
  generate_dom() {
    this.generate_option();
    this.input_el.style.width = '35px';
    this.label_el['classList']['add']('pointer-cursor');
    super.generate_dom();
  }
}
class TextColorOption extends ColorOption {
  /*
  local_side_effects() {
    this.tab_options.text_container.style.color = this.option_value;
  }
  */
}
class TextShadowOption extends TextOption {
  /*
  local_side_effects() {
    this.tab_options.text_container.style.textShadow = this.option_value;
  }
  */
}

class PresetOption extends SelectOption {
  constructor(args) {
    super(args);
    this.is_preset_selector = true;
  }

  generate_dom() {
    this.generate_option();

    this.input_el.style.width = '93px';

    this.input_el.innerHTML  = '<option label="<custom>" value="">&lt;Custom&gt;</option>';
    if( !this.tab_options.no_random_preset ){
      this.input_el.innerHTML += '<option label="<random>" value="random">&lt;Random&gt;</option>';
    }
    const preset_names = Object.keys(this.tab_options.preset_list);
    preset_names.forEach(preset_name => {
      const option_el = document.createElement('option');
      option_el.innerHTML = prettify_preset_id(preset_name);
      option_el.value     = preset_name;
      this.input_el.appendChild(option_el);
    });

    super.generate_dom();
  }
}


class BackgroundImageOption extends TextOption {
  constructor(args) {
    super(args);
    this.is_background_image = true;
  }
}
class BackgroundColorOption extends ColorOption {
  constructor(args) {
    super(args);
    this.is_background_color = true;
  }
}

class TextFontOption extends SelectOption {
  constructor(args) {
    super(args);
    this.is_font_selector = true;
  }
  generate_dom() {
    this.generate_option();
    this.input_el.style.width = '110px';
    super.generate_dom();
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

function generate_option({input_tag, input_type, option_id, option_description}) {
  assert(input_tag);
  assert(input_type || input_tag!=='input');
  assert(option_id);
  assert(option_description);

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

  return {label_el, input_el};
}

function activate_option({options_container, label_el, option_id, on_input_change, option_default}) {
  assert(options_container);
  assert(label_el);
  assert(option_id);
  assert(on_input_change);
  assert(option_default!==undefined);

  options_container.appendChild(label_el);

//ml.persistantInput=function(id,listener,default_,keyUpDelay,noFirstListenerCall)
  ml.persistantInput(
    option_id,
    on_input_change,
    option_default,
    0,
    true
  );
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
    option_spec_list.map(({option_type, ...option_spec}) => {
      assert(option_spec.option_id, option_spec);
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

function prettify_preset_id(preset_name) {
  return (
    preset_name
    .replace(/[_-]/g,' ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  );
}
