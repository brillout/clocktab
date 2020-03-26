import ml from '../../ml';
import setBackground from './setBackground';
import {sleep} from '../../../tab-utils/sleep';
import loadFontList from './loadFontList';
import {dom_beat} from './load_clock';
import {refresh_big_text_size} from '../../BigText';
import THEME_LIST from './THEME_LIST';
import assert from '@brillout/assert';
import load_font from './load_font';
import init_options from './init_options';

export default init_clock_options;

export {get_opt};
function get_opt(...args){return getOpt(...args);}
var getOpt;

async function init_clock_options() {
  let resolveAwaitClockFont;
  const awaitClockFont = new Promise(r => resolveAwaitClockFont = r);

  const clock_el = document.getElementById('middle_table');

  const {get_option, set_option} = init_options({
    option_list: get_option_list(),
    preset_list: THEME_LIST,
  });

  var randomTheme = (function()
  {
  //var random = Math.floor(Math.random()*ml.len(THEME_LIST));
    var random = Math.floor(Math.random()*Object.keys(THEME_LIST).length);
    var counter=0;
    for(var ret in THEME_LIST) if(counter++===random) return ret;
  })();

  function isCustomTheme() {
    return getOpt('theme')==='';
  }
  getOpt=function(option_id) {
    if( option_id!=='theme' ){
      var theme = getOpt('theme');
      if(theme==='random') theme=randomTheme;
      if( theme && THEME_LIST[theme] && (option_id in THEME_LIST[theme])) {
        return THEME_LIST[theme][option_id];
      }
    }
    var el = document.getElementById(option_id);

  // return el.type==='text'||el.type==='color'||el.nodeName==='SELECT'?el.value:!!el.checked;

    if( el.type==='checkbox' ){
      return !!el.checked;
    }
    return el.value;
  };

  //refresh options onchange
  //{{{
  (function(){
    function setOptVisibility()
    {
      for(var i=0;i<OPTION_LIST.length;i++)
      {
        var opt = OPTION_LIST[i];
        var toHide=opt.option_dependency && !getOpt(opt.option_dependency) || opt.option_negative_dependency && getOpt(opt.option_negative_dependency);
          opt.dom_el.style.width     =toHide?'0px'   :'';
          opt.dom_el.style.height    =toHide?'0px'   :'';
          opt.dom_el.style.visibility=toHide?'hidden':'visible';
          opt.dom_el.style.position  =toHide?'absolute':'';
          opt.dom_el.style.zIndex    =toHide?'-1':'';
      }
    }
    function bg_listener() {
      const bg_image_val = getOpt('bg_image');
      const bg_color_val = getOpt('bg_color');
      setBackground(bg_image_val || bg_color_val);
    }
    function bg_image_listener(){ setBackground(getOpt('bg_image')) }
    function colorChangeListener(){clock_el.style.color        =getOpt('color_font' )}
    function fontShadowListener (){clock_el.style['textShadow']=getOpt('font_shadow')}
    function theme_change_listener(){
      fontShadowListener();
      colorChangeListener();
      load_clock_font();
      bg_listener();
      setOptVisibility();
      if( isCustomTheme() ) {
        const fonts = Object.values(THEME_LIST).map(t => t.clock_font);
        loadFontList(fonts);
      }
    }
    function refreshStuff(){dom_beat(true);setOptVisibility()};

    for(var i=0;i<OPTION_LIST.length;i++)
    {
      var opt = OPTION_LIST[i];
      var changeListener;
      if(opt.option_id==='show_seconds')changeListener=function(val){
        document.body['classList'][val?'remove':'add']('noSeconds');refreshStuff();setTimeout(refreshStuff,100);};
      else if(opt.option_id==='show_pm'||opt.option_id==='12_hour')
        changeListener=function(){
        document.body['classList'][getOpt('show_pm')&&getOpt('12_hour')?'remove':'add']('noPeriod');
        refreshStuff();
        setTimeout(refreshStuff,100);//again with timeout because sometimes it seems that effect if changing classList is delayed
      }
      else if(opt.option_id==='font_shadow') changeListener=fontShadowListener;
      else if(opt.option_id==='color_font')  changeListener=colorChangeListener;
      else if(opt.option_id==='theme')  changeListener=theme_change_listener;
      else if(opt.option_id==='clock_font')   changeListener=load_clock_font;
      else if(opt.option_id==='bg_color')   changeListener=bg_listener;
      else if(opt.option_id==='bg_image')   changeListener=bg_listener;
      else                       changeListener=refreshStuff;
      ml.persistantInput(opt.option_id,changeListener,opt.option_default,0,opt.option_id!=='show_seconds'&&opt.option_id!=='show_pm'&&opt.option_id!=='12_hour');
    }
    theme_change_listener();

    async function load_clock_font() {
      const font_name = getOpt('clock_font');

      await load_font(font_name);

      if( font_name !== getOpt('clock_font') ){
        return;
      }

      if( font_name === clock_el.style.fontFamily ){
        return;
      }

      clock_el.style.fontFamily = font_name;

      refresh_big_text_size();
    }
  })();
  //}}}

  await Promise.race([awaitClockFont, sleep({seconds: 0.4})]);
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
      option_description:  'font shadow',
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

