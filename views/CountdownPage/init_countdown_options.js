import {refresh_big_text_size} from '../BigText';
import {TabOptions} from '../TabOptions';
import {dom_beat} from './set_countdown';
import PRESETS from './PRESETS';
import {set_text_position} from '../BigText';

export default init_clock_options;

function init_clock_options() {
  const text_container = document.getElementById('countdown-container');

  const tab_options = new TabOptions({
    option_spec_list: get_option_list(),
    preset_list: PRESETS,
    text_container,
    options_container: document.getElementById('options-container'),
    on_any_change,
    on_font_change,
    no_random_preset: true,
  });

  const get_option_value = tab_options.get_option_value.bind(tab_options);
  const {font_loaded_promise} = tab_options;

  tab_options.generate_dom();

  return {get_option_value, font_loaded_promise};

  function on_font_change() {
    refresh_big_text_size();
  }
  function on_any_change({initial_run}) {
    update_options();
    if( !initial_run ){
      dom_beat();
      refresh_big_text_size();
    }
  }

  function update_options() {
    text_container.style.color = get_option_value('countdown_color');
    text_container.style.textShadow = get_option_value('countdown_shadow');
    set_text_position(get_option_value('countdown_position'));
  }
}

function get_option_list() {
  return [
    {
      option_id: 'countdown_preset',
      option_type: 'preset-input',
      option_description: 'Preset',
      option_default: 'christmas',
    },


    {
      option_id: 'countdown_date',
      option_type: 'date-input',
      option_description: 'Date',
      option_default: 'Josefin Slab',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_title',
      option_type: 'text-input',
      option_description: 'Title',
      option_default: 'Until %date',
      option_negative_dependency: 'countdown_preset',
    },

    {
      option_id: 'countdown_position',
      option_type: 'choice-input',
      option_choices: [
        'top-left',
        'top',
        'top-right',
        'center-left',
        'center',
        'center-right',
        'bottom-left',
        'bottom',
        'bottom-right',
      ],
      option_description: 'Countdown position',
      option_default: 'bottom',
      option_negative_dependency: 'countdown_preset',
    },

    {
      option_id: 'countdown_font',
      option_type: 'text-font-input',
      option_description: 'Font',
      option_default: 'Roboto',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_color',
      option_type: 'text-color-input',
      option_description: 'Font color',
      option_default: '#a70000',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_shadow',
      option_type: 'text-shadow-input',
      option_description: 'Font shadow',
      option_default: '',
      option_negative_dependency: 'countdown_preset',
      option_placeholder: 'see css text-shadow',
    },
    {
      option_id: 'countdown_size',
      option_type: 'text-input',
      option_description: 'Countdown size',
      option_default: '580',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_bg_color',
      option_type: 'background-color-input',
      option_description: 'Background color',
      option_default: '#ffffff',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_bg_image',
      option_type: 'background-image-input',
      option_description: 'Background image',
      option_default: ''    ,
      option_negative_dependency: 'countdown_preset',
      option_placeholder: 'image url',
    },
  ];
}
