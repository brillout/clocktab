import {dom_beat} from './load_clock';
import {refresh_big_text_size} from '../../BigText';
import THEME_LIST from './THEME_LIST';
import TabOptions from './TabOptions';

export default init_clock_options;

function init_clock_options() {
  const tab_options = new TabOptions({
    option_spec_list: get_option_list(),
    preset_list: THEME_LIST,
    text_container: document.getElementById('middle_table'),
    options_container: document.getElementById('options-container'),
    on_any_change,
  });

  tab_options.generate_dom();

  const {get_option_value, font_loaded_promise} = tab_options;
  return {get_option_value, font_loaded_promise};
}

function on_any_change() {
  {
    const show_seconds = get_option_value('show_seconds');
    document.body['classList'][show_seconds?'remove':'add']('noSeconds');
  }

  {
    const show_pm = getOpt('show_pm');
    const twelve_hour = getOpt('12_hour');
    document.body['classList'][show_pm&&twelve_hour?'remove':'add']('noPeriod');
  }

  dom_beat();

  refresh_big_text_size();
}

function get_option_list() {
  return [
    {
      option_id:'theme',
      option_type: 'preset-input'
      option_description:'theme',
      option_default: 'steel',
    },
    {
      option_id: 'clock_font',
      option_type: 'font-input'
      option_description: 'font',
      option_default: 'Josefin Slab',
      option_negative_dependency: 'theme',
    },
    {
      option_id: 'color_font',
      option_type: 'color-input'
      option_description: 'font color',
      option_default: '#a70000',
      option_negative_dependency: 'theme',
    },
    {
      option_id: 'font_shadow',
      option_type: 'text-shadow-input'
      option_description: 'font shadow',
      option_default: '',
      option_negative_dependency: 'theme',
      option_placeholder: 'see css text-shadow',
    },
    {
      option_id: 'font_size',
      option_description: 'font size',
      option_default: '580',
    },
    {
      option_id: 'bg_color',
      option_description: 'background color',
      option_default: '#ffffff',
      option_negative_dependency: 'theme',
    },
    {
      option_id: 'bg_image',
      option_description: 'background image',
      option_default: ''    ,
      option_negative_dependency: 'theme',
      option_placeholder: 'image url',
    },
    {
      option_id: 'color_icon',
      option_description: 'icon color',
      /*
      option_default: '#cc0000',
      option_default: '#007000',
      */
      option_default: '#545454',
    },
    {
      option_id: 'show_seconds_title',
      option_description: 'seconds in title',
      option_default: false,
    },
    {
      option_id: 'show_seconds',
      option_description: 'seconds',
      option_default: true,
    },
    {
      option_id: '12_hour',
      option_description: '12-hour',
      option_default: get_default_12_hour(),
    },
    {
      option_id: 'show_pm',
      option_description: 'am/pm',
      option_default: true,
      option_dependency: '12_hour',
    },
    {
      option_id: 'show_date',
      option_description: 'date',
      option_default: true,
    },
    {
      option_id: 'show_week',
      option_description: 'week',
      option_default: false,
      option_dependency: 'show_date',
    }
  ];
}

function get_default_12_hour() {
  return (
    /(AM)|(PM)/.test(new Date().toLocaleTimeString()) ||
    window.navigator.language==='en-US'
  );
}

