import assert from '@brillout/assert';

export {TextInput, BooleanInput, SelectInput, ColorInput, DateInput, Button};

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
  constructor(props) {
    this._props = props;

    const {input_id, on_input_change, input_default} = props;
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
    const {input_tag, input_type} = this;
    assert(input_tag);
    assert(input_type || input_tag!=='input');

    const {dom_el, input_el} = generate_input({input_tag, input_type, ...this._props});
    this._dom_el = dom_el;
    this._input_el = input_el;

    if( this.init_dom ){
      this.init_dom();
    }

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

    this._input_el.addEventListener(this._change_event, () => {
      this._storage.set_val(this._input_retriever());
      this._on_input_change();
    }, false);
  }
  hide() {
    hide_show_el(this._dom_el, true);
  }
  show() {
    hide_show_el(this._dom_el);
  }

  // To be overriden
  _input_retriever() {
    return this._input_el.value;
  }
  _input_modifier(val) {
    this._input_el.value = val;
  }
  get _change_event() {
    return 'change';
  }

}

class BooleanInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'checkbox';
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
    this._dom_el['classList']['add']('pointer-cursor');
  }
}

class TextInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'text';
  }
  get _change_event() {
    // `input` event seem to only be reliably fired for text inputs
    //  - https://caniuse.com/#feat=input-event
    return 'input';
  }

  init() {
    super.init();
    const {input_placeholder} = this._props;
    if( input_placeholder ){
      this._input_el.placeholder = input_placeholder;
    }
  }
}

class SelectInput extends PersistantInput {
  constructor({input_options, ...args}) {
    super(args);
    this.input_tag = 'select';
    this.input_options = input_options;
  }

  init_dom() {
    assert(this.input_options.length>0, this._input_id);

    let {innerHTML} = this._input_el;
    this.input_options.forEach(option_args => {
      innerHTML += this._generate_option_html(option_args);
    });
    this._input_el.innerHTML = innerHTML;
  }

  add_options(new_options) {
    let {innerHTML} = this._input_el;

    new_options.forEach(option_args => {
      innerHTML += this._generate_option_html(option_args);
    })

    this._input_el.innerHTML = innerHTML;

    /*
    const selected_option = this.input_get();
    if( selected_option ){
      this.input_set(selected_option);
    }
    */
  }

  _input_modifier(val) {
    assert(val, {val});
    if( !this._input_el.querySelector('option[value="'+val+'"]') ){
      this._input_el.innerHTML += this._generate_option_html(val);
    }
    super._input_modifier(val);
  }

  // TODO - make to a static prop
  _generate_option_html(args) {
    assert(args, this._input_id, {args});

    if( args === SelectInput.divider ){
      return '<option disabled>──────────</option>';
    }

    const val = args.val || args;
    assert(val, args);
    const val_pretty = args.val_pretty || val;
    return (
      '<option label="'+val_pretty+'" value="'+val+'">'+escapeHtml(val_pretty)+'</option>'
    );
  }
}
SelectInput.divider = Symbol();

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
    this._dom_el['classList']['add']('pointer-cursor');
  }
}

class Button {
  constructor({on_click, text, input_container}) {
    this.on_click = on_click;
    this.text = text;
    this.input_container = input_container;
  }
  generate_dom() {
    const dom_el =document.createElement('button'); 
    dom_el.setAttribute('type', 'button');
    dom_el.onclick = ev => {
      ev.preventDefault();
      this.on_click();
    };
    dom_el.textContent = this.text;
    this.input_container.appendChild(dom_el);
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

function generate_input({input_tag, input_type, input_id, input_description, input_width, input_container}) {
  assert(input_tag);
  assert(input_type || input_tag!=='input');
  assert(input_id);
  assert(input_description);
  assert(input_container);

  const dom_el = document.createElement('label');

  assert(['select', 'input'].includes(input_tag));
  const input_el = document.createElement(input_tag);
  input_el.id   = input_id;
  if( input_type ) input_el.setAttribute('type', input_type);

  const description_el = document.createElement('span');
  description_el.textContent = input_description;//+'&nbsp;';

  if( input_type==='checkbox' ){
    dom_el.appendChild(input_el);
    dom_el.appendChild(description_el);
  } else {
    dom_el.appendChild(description_el);
    dom_el.appendChild(input_el);
  }

  if( input_width ){
    input_el.style.width = input_width;
  }

  input_container.appendChild(dom_el);

  return {dom_el, input_el};
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

/*
new_options = make_unique(new_options);
function make_unique(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}
*/
