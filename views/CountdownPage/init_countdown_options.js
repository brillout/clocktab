import {refresh_big_text_size} from '../BigText';
import {TabOptions} from '../TabOptions';

export default init_clock_options;

function init_clock_options() {
  const text_container = document.getElementById('countdown-el');

  const tab_options = new TabOptions({
    option_spec_list: get_option_list(),
    preset_list: get_presets(),
    text_container,
    options_container: document.getElementById('options-container'),
    on_any_change,
  });

  const get_option_value = tab_options.get_option_value.bind(tab_options);
  const {font_loaded_promise} = tab_options;

  tab_options.generate_dom();

  return {get_option_value, font_loaded_promise};

  function on_any_change({initial_run}) {
    update_options();
    if( !initial_run ){
      refresh_big_text_size();
    }
  }

  function update_options() {
    text_container.style.color = get_option_value('countdown_color');
    text_container.style.textShadow = get_option_value('countdown_shadow');
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
      option_id: 'countdown_font',
      option_type: 'text-font-input',
      option_description: 'font',
      option_default: 'Josefin Slab',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_color',
      option_type: 'text-color-input',
      option_description: 'font color',
      option_default: '#a70000',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_shadow',
      option_type: 'text-shadow-input',
      option_description: 'font shadow',
      option_default: '',
      option_negative_dependency: 'countdown_preset',
      option_placeholder: 'see css text-shadow',
    },
    {
      option_id: 'countdown_size',
      option_type: 'text-input',
      option_description: 'font size',
      option_default: '580',
    },
    {
      option_id: 'countdown_bg_color',
      option_type: 'background-color-input',
      option_description: 'background color',
      option_default: '#ffffff',
      option_negative_dependency: 'countdown_preset',
    },
    {
      option_id: 'countdown_bg_image',
      option_type: 'background-image-input',
      option_description: 'background image',
      option_default: ''    ,
      option_negative_dependency: 'countdown_preset',
      option_placeholder: 'image url',
    },
  ];
}

function get_presets() {
  return {
    'new-year':{
      'countdown_bg_color':'',
      'countdown_bg_image':'https://media.timeout.com/images/101624407/750/422/image.jpg',
      'countdown_font':'Syncopate',
      'countdown_shadow':'0 1px 1px #000',
      'countdown_color':'#e9e9e9'},
    'trump-wins-2020':{
      'countdown_bg_color':'',
      'countdown_bg_image': 'https://otb.cachefly.net/wp-content/uploads/2019/04/Trump-2020-Flag.png',
      'countdown_font':'Lora',
      'countdown_shadow':'0 1px 1px #000',
      'countdown_color':'#EBEBF1'},
    'trump-loses-2020':{
      'countdown_bg_color':'',
      'countdown_bg_image': 'https://www.aljazeera.com/mritems/imagecache/mbdxxlarge/mritems/Images/2020/3/19/d36eec17dc194b00a10b548f7dcfa7fa_18.jpg',
      'countdown_font':'Syncopate',
      'countdown_shadow':'none',
      'countdown_color':'#333333'},
  };
}
