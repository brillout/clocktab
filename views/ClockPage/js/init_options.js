export default init_options;

const CONTAINER_ID = 'options-container';

function init_options({option_list, preset_list}) {
  generate_option_elements({option_list, preset_list});
}
function generate_option_elements({option_list, preset_list}) {

  option_list.forEach(opt => {
    const {
      get_option_value,
      set_option_value,
    } = (function() {
      if( opt.option_type === 'font-input' ){
        return generate_font_input(opt);
      }
      if( opt.option_type === 'preset-input' ){
        return generate_preset_input(opt, preset_list);
      }
      if( opt.option_type === 'color-input' ){
        return generate_color_input(opt);
      }
      if( opt.option_type === 'text' ){
        return generate_text_input(opt);
      }
    })();

    Object.assign(opt, {
      hide,
      show,
      get_option_value,
      set_option_value,
    });
  }
}


function generate_color_input({option_id, option_description}) {
  const {input_el, label_el} = generate_input({input_tag: 'input', input_type: 'color', option_id, option_description});
  input_el.style.width = '35px';

  label_el['classList']['add']('pointer-cursor');
}
function generate_font_input({option_id, option_description}) {
  const {input_el} = generate_input({input_tag: 'select', option_id, option_description});

  input_el.style.width = '90px';
}
function generate_preset_input({option_id, option_description}, preset_list) {
  const {input_el} = generate_input({input_tag: 'select', option_id, option_description});

  input_el.style.width = '83px';

  input_el.innerHTML = '<option label="<custom>" value="">&lt;custom&gt;</option><option label="<random>" value="random">&lt;random&gt;</option>';
  for(var preset_name in preset_list) {
    var option_el = document.createElement('option');
    option_el.innerHTML = preset_name;
    option_el.value     = preset_name;
    input_el.appendChild(option_el);
  }
}
function generate_boolean_input({option_id, option_description}) {
  const {input_el} = generate_input({input_tag: 'input', input_type: 'checkbox', option_id, option_description});

  label_el['classList']['add']('pointer-cursor');
}
function generate_text_input({option_placeholder, option_default}) {
  const {input_el, label_el} = generate_input({input_tag: 'input', input_type: 'text', option_id, option_description});

  if(option_placeholder) {
    input_el.placeholder = option_placeholder;
  }

  const prefill = option_placeholder || option_default;
  if( prefill ){
    input_el.size = prefill.length*3/4;
  } else {
    input_el.style.width = '35px';
  }
}

function generate_input({input_tag, input_type, option_id, option_description}) {
  assert(option_id);

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
  document.getElementById(CONTAINER_ID).appendChild(label_el);

  return {label_el, input_el};
}

