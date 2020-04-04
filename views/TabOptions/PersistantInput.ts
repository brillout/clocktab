import assert from '@brillout/assert';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";


export {TextInput, BooleanInput, SelectInput, ColorInput, DateInput, Button};

class Storage {
  #storage_key;
  constructor(storage_key) {
    assert(storage_key);
    this.#storage_key = storage_key;
  }
  has_val() {
    return window.localStorage.getItem(this.#storage_key) !== null;
  }
  get_val() {
    return window.localStorage.getItem(this.#storage_key);
  }
  set_val(val) {
    window.localStorage.setItem(this.#storage_key, val);
  }
}

class PersistantInput {
  #props: any;
  #input_id: String;
  #on_input_change: any;
  #input_default: any;
  #storage: Storage;

  constructor(props) {
    this.#props = props;

    const {input_id, on_input_change, input_default} = props;
    assert(input_id && on_input_change);
    this.#input_id = input_id;
    this.#on_input_change = on_input_change;
    this.#input_default = input_default;

    this.#storage = new Storage(input_id);
  }

  // Public functions
  input_get() {
    return this._input_retriever();
  }
  input_set(val) {
    this.#storage.set_val(val);
    this._input_modifier(val);
    this.#on_input_change();
  }
  init() {
    const {input_tag, input_type} = this;
    assert(input_tag);
    assert(input_type || input_tag!=='input');

    const {dom_el, input_el} = generate_input({input_tag, input_type, ...this.#props});
    this._dom_el = dom_el;
    this._input_el = input_el;

    if( this._init_dom ){
      this._init_dom();
    }

    const init_val = (
      this.#storage.has_val() ? (
        this.#storage.get_val()
      ) : (
        this.#input_default
      )
    );
    if( init_val!== undefined ){
      this._input_modifier(init_val);
    }

    this._input_el.addEventListener(this._change_event, () => {
      this.#storage.set_val(this._input_retriever());
      this.#on_input_change();
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
    const {input_placeholder} = this.#props;
    if( input_placeholder ){
      this._input_el.placeholder = input_placeholder;
    }
  }
}

class SelectInput extends PersistantInput {
  static get_divider(text) {
    let divider_text;
    if( text ) {
      divider_text = '─── ' + text + ' ───';
    } else {
      divider_text = '───────────────';
    }
    const divider_html = '<option disabled>'+divider_text+'</option>';
    return {divider_html};
  }

  refresh() {
    this._init_dom();
  }

  constructor({input_options, ...args}) {
    super(args);
    this.input_tag = 'select';
    this.input_options = input_options;
  }

  _init_dom() {
    assert(this.input_options.length>0, this.#input_id);

    let innerHTML = '';
    this.input_options.forEach(option_arg => {
      innerHTML += this._generate_option_html(option_arg);
    });
    this.#input_el.innerHTML = innerHTML;
  }

  add_options(new_options) {
    const current_value = this._input_retriever();

    const current_option_values = Array.from(this.#input_el.querySelector('option')).map(el => el.value);

    let {innerHTML} = this._input_el;
    new_options.forEach(option_arg => {
      const {val} = this._parse_option_arg(option_arg);
      if( val && current_option_values.includes(val) ){
        return;
      }
      innerHTML += this._generate_option_html(option_arg);
    })

    this._input_el.innerHTML = innerHTML;

    this._input_modifier(current_value);
  }

  _input_modifier(val) {
    assert(val, {val});
    if( !this._input_el.querySelector('option[value="'+val+'"]') ){
      this._input_el.innerHTML = (
        this._generate_option_html(val) +
        SelectInput.get_divider().divider_html +
        this._input_el.innerHTML
      );
    }
    super._input_modifier(val);
  }

  _generate_option_html(option_arg) {
    const {val, val_pretty, divider_html} = this._parse_option_arg(option_arg);

    if( divider_html ){
      return divider_html;
    }

    return (
      '<option label="'+val_pretty+'" value="'+val+'">'+escapeHtml(val_pretty)+'</option>'
    );
  }
  _parse_option_arg(option_arg) {
    assert(option_arg, this.#input_id, {option_arg});

    const {divider_html} = option_arg;
    if( divider_html ){
      return {divider_html};
    }

    const val = option_arg.val || option_arg;
    assert(val && val.constructor===String, option_arg);
    const val_pretty = option_arg.val_pretty || val;
    assert(val_pretty.constructor===String, val_pretty);
    return {val, val_pretty};
  }
}

class DateInput extends PersistantInput {
  constructor(args) {
    super(args);
    this.input_tag = 'input';
    this.input_type = 'datetime';
  }
  _init_dom() {
    flatpickr(this._input_el, {
      enableTime: true,
      /*
      dateFormat: "Y-m-d H:i",
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      */
    });
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
  constructor({on_click, text, input_container, className, id}) {
    this.on_click = on_click;
    this.text = text;
    this.input_container = input_container;
    this.className = className;
    this.id = id;
  }
  generate_dom() {
    const dom_el =document.createElement('button'); 
    if( this.className ){
      dom_el.setAttribute('class', this.className);
    }
    dom_el.setAttribute('type', 'button');
    dom_el.setAttribute('id', this.id);
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
  assert(input_container, {input_id});

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

function escapeHtml(str) {
  return (
    str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
  );
}

function hide_show_el(el, to_hide) {
  if( to_hide ){
    el.setAttribute('disabled', "true");
  } else {
    el.removeAttribute('disabled');
  }
  el.style.width      = to_hide ? '0px'     :''       ;
  el.style.height     = to_hide ? '0px'     :''       ;
  el.style.visibility = to_hide ? 'hidden'  :'visible';
  el.style.position   = to_hide ? 'absolute':''       ;
  el.style.zIndex     = to_hide ? '-1'      :''       ;
}
