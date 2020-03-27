import {refresh_big_text_size} from '../BigText';
import {TabOptions} from '../TabOptions';
import {dom_beat} from './set_countdown';
import {set_text_position} from '../BigText';

export default init_clock_options;

function init_clock_options() {
  const text_container = document.getElementById('countdown-container');

  const tab_options = new TabOptions({
    option_spec_list: get_option_list(),
    preset_list: get_presets(),
    text_container,
    options_container: document.getElementById('options-container'),
    on_any_change,
    no_random_preset: true,
  });

  const get_option_value = tab_options.get_option_value.bind(tab_options);
  const {font_loaded_promise} = tab_options;

  tab_options.generate_dom();

  return {get_option_value, font_loaded_promise};

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
      option_default: 'steel',
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
      option_choices: ['top', 'center', 'bottom'],
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

function get_presets() {
  const new_year = new Date((new Date(new Date()-8*60*60*1000).getFullYear()+1).toString());
  console.log(new_year);

  return {
    'new-year':{
      'countdown_title': "2021",
      'countdown_date': new_year,
      'countdown_position': 'center',
      'countdown_bg_color':'',
      'countdown_bg_image':'https://i.imgur.com/H4ZC3pZ.jpg',
      'countdown_font':'Roboto',
      'countdown_shadow':'0 1px 1px #000',
      'countdown_color':'#e9e9e9'},
    'trump-wins-2020':{
      'countdown_title': "Trump wins",
      'countdown_date': new Date('20 January 2021'),
      'countdown_position': 'bottom',
      'countdown_bg_color':'',
      'countdown_bg_image': 'https://i.imgur.com/BpA8fWK.png',
      'countdown_font':'Roboto',
      'countdown_shadow':'1px 1px black',
      /// red: #e00014
      'countdown_color':'#0300ff'},
    'trump-loses-2020':{
      'countdown_title': "Trump's end %date",
      'countdown_date': new Date('20 January 2021'),
      'countdown_position': 'bottom',
      'countdown_bg_color':'',
      // Non-resized: https://i.imgur.com/srnUbAP.jpg
      'countdown_bg_image': 'https://i.imgur.com/srnUbAPh.jpg',
      'countdown_font':'Roboto',
      'countdown_shadow':'1px 1px black',
      'countdown_color':'white'},
  };
}
