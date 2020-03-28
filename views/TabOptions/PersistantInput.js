export {TextInput, BooleanInput, SelectInput, ColorInput, DateInput};

class Storage {
  constructor(storage_key) {
    assert(storage_key);
    this._storage_key = storage_key;
  }
  has_val() {
    return window.localStorage.getItem(this._storage_key) !== null;
  }
  get_val() {
    return window.localStorage.getItem(this._storage_key);
  }
  set_val(val) {
    window.localStorage.setItem(this._storage_key, val);
  }
}

class PersistantInput {
  constructor({input_id, on_input_change, input_default}) {
    assert(input_id && on_input_change);

    this._input_id = input_id;
    this._on_input_change = on_input_change;
    this._input_default = input_default;

    this._storage = new Storage(input_id);
  }

  // Public functions
  input_get() {
    return this._input_retriever();
  }
  input_set(val) {
    this._storage.set_val(val);
    input_modifier(val);
    this._on_input_change();
  }
  init() {
    assert(this.input_tag && this.input_type);
    this._input_el = // TN

    const init_val = (
      this._storage.has_val() ? (
        this._storage.get_val()
      ) : (
        this._input_default
      )
    );
    if( init_val!== undefined ){
      this._input_modifier(init_val);
    }
    this._input_el.addEventListener(this._change_event, () => {this._on_input_change()}, false);
  }
  hide() {
    hide_show_el(this.dom_el, true);
  }
  show() {
    hide_show_el(this.dom_el);
  }

  // To be overriden
  _input_retriever() {
    return this.input_el.value;
  }
  _input_modifier() {
    this.input_el.value = val;
  }
  get _change_event() {
    return 'change';
  }

}

class BooleanInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'checkbox'; // TN
  }
  _input_retriever() {
    return !!this._input_el.checked;
  }
  _input_modifier(val) {
    if( !!val ){
      this._input_el.setAttribute('checked', "true");
    } else {
      this._input_el.removeAttribute('checked');
    }
  }
  init() {
    super.init();
    this.dom_el['classList']['add']('pointer-cursor');
  }
}

class TextInput extends PersistantInput {
  constructor({input_placeholder, input_width, ...args}) {
    // TN input_placeholder
    // TN input_width
    super(args);
    this.input_tag = 'input';
    this.input_type = 'text';
  }
  get _change_event() {
    // `input` event seem to only be reliably fired for text inputs
    //  - https://caniuse.com/#feat=input-event
    return 'input';
  }

  // TN
  generate_dom() {
    const prefill = this.option_placeholder || this.option_default;
    if( prefill ){
      this.input_el.size = prefill.length*3/4;
    } else {
      this.input_el.style.width = '35px';
    }

    super.generate_dom();
  }
}

class SelectInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'select';
    this.input_args.input_options = args.option_choices;

    this._input_options = args.input_options;
    assert(this._input_options);
  }

  init() {
    this._input_options.forEach(option_args => {
      this.input_el.innerHTML += this._generate_option_html(option_args);
    });
    super.init();
  }

  // TN
  add_options() {




    // TN - don't add duplicated
    make_unique
    // TN - preserve all selction
    const selectedFont = clockFontOptEl.value;
    clockFontOptEl.value = selectedFont || fontList[0];
  }

  _input_modifier(val) {
    assert(val, {val});
    if( !this._input_el.querySelector('option[value="'+val+'"]') ){
      this.input_el.innerHTML += this._generate_option_html({val});
    }
    super._input_modifier(val);
  }

  // TODO - make to a static prop
  _generate_option_html({val, val_pretty}) {
    assert(val, {val, val_pretty});
    const val_pretty = val_pretty || prettify_option(val);
    return (
      '<option label="'+val_pretty+'" value="'+val+'">'+escapeHtml(val_pretty)+'</option>'
    );
  }
}

class DateInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'datetime';
  }
}
class ColorInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'color';
  }
  init() {
    super.init();
    // TN this.dom_el
    this.dom_el['classList']['add']('pointer-cursor');
  }
}

// TN
class Button {
  constructor({on_click, text, tab_options}) {
    this.on_click = on_click;
    this.text = text;
    this.tab_options = tab_options;
  }
  generate_dom() {
    const dom_el =document.createElement('button'); 
    dom_el.setAttribute('type', 'button');
    dom_el.onclick = ev => {
      ev.preventDefault();
      this.on_click();
    };
    dom_el.textContent = this.text;
    const {options_container} = this.tab_options;
    options_container.appendChild(dom_el);

    this.dom_el = dom_el;
  }

  // to-do: as mixin
  hide() {
    hide_show_el(this.dom_el, true);
  }
  show() {
    hide_show_el(this.dom_el);
  }
}

/*
const global_debouncer.debounce = new GlobalDebouncer();

class GlobalDebouncer {
  constructor() {
    this._lastTimeout;
    requestAnimationFrame
    cancelAnimationFrame
  }

  debounce(fn) {
    return () => {

      fn();
    };
  }
}
*/

// TN
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

function prettify_option(val) {
  return (
    val
    .replace(/[_-]/g,' ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  );
}

function escapeHtml(unsafe) {
  return (
    unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
  );
}

function hide_show_el(el, to_hide) {
  el.style.width      = to_hide ? '0px'     :''       ;
  el.style.height     = to_hide ? '0px'     :''       ;
  el.style.visibility = to_hide ? 'hidden'  :'visible';
  el.style.position   = to_hide ? 'absolute':''       ;
  el.style.zIndex     = to_hide ? '-1'      :''       ;
}

function make_unique(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}
