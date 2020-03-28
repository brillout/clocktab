export {PersistantInput};

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

  // Public functions
  input_get() {
    return this._input_retriever();
  }
  input_set(val) {
    this._storage.set_val(val);
    input_modifier(val);
    this._on_input_change();
  }
  input_init() {
    this._input_el = document.getElementById(this._input_id);

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
}

class BooleanInput extends PersistantInput {
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
}

class TextInput extends PersistantInput {
  get _change_event() {
    // `input` event seem to only be reliably fired for text inputs
    //  - https://caniuse.com/#feat=input-event
    return 'input';
  }
}

class SelectInput extends PersistantInput {
  constructor(args) {
    super(args);
    const {input_options} = args;
    assert(input_options);
    this._input_options = input_options;
  }

  input_init() {
    this._input_options.forEach(val => {
      this.input_el.innerHTML += _generate_option_html(val);
    });
    super.input_init();
  }

  _input_modifier(val) {
    assert(val, {val});
    if( !this._input_el.querySelector('option[value="'+val+'"]') ){
      this.input_el.innerHTML += _generate_option_html(val);
    }
    super._input_modifier(val);
  }

  _generate_option_html(val) {
    assert(val, {val});
    const val_prettified = prettify_id(val);
    return (
      '<option label="'+val_prettified+'" value="'+val+'">'+val_prettified+'</option>'
    );
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
