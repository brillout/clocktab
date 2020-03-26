import ml from '../../ml';
import setBackground from './setBackground';
import {sleep} from '../../../tab-utils/sleep';
import loadFontList from './loadFontList';
import {dom_beat} from './load_clock';
import {refresh_big_text_size} from '../../BigText';
import THEME_LIST from './THEME_LIST';

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


  var loadClockFont;
  (function() {
  //{{{
    var bodyFontLoader;
    loadClockFont=function(_force){
      let resolve;
      const promise = new Promise(r => resolve = r);
      if(bodyFontLoader) {
        bodyFontLoader(_force, () => {resolve()});
      } else {
        resolve();
      }
      return promise;
    };
    setTimeout(function loadFontApi(){
      ml.loadASAP('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',function(){
        if(!window['WebFont']||!window['WebFont']['load']) {
          setTimeout(loadFontApi,2000);
          return;
        }
        function fontLoader(fontName,callback){
          if( !fontName ){
            return;
          }
          var attempts=0;
          (function do_(){
            window['WebFont']['load']({'google':{'families':[fontName]},
                                       'fontactive':callback,
                                       'fontinactive':function(){setTimeout(do_,Math.max(Math.pow(2,attempts++)*1000,60000))}
                                     });
          })();
        }
        bodyFontLoader=function(_force, callback){
          var fontName = getOpt('clock_font');
          fontLoader(fontName,function(){
            if( _force || fontName===getOpt('clock_font') && clock_el.style.fontFamily!==fontName ){
              clock_el.style.fontFamily=fontName;
              refresh_big_text_size();
            }
            callback();
          })
        };
        loadClockFont().then(() => {
          resolveAwaitClockFont();
        });
      });
    },0);
  //}}}
  })();

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
      loadClockFont();
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
      else if(opt.option_id==='clock_font')   changeListener=loadClockFont;
      else if(opt.option_id==='bg_color')   changeListener=bg_listener;
      else if(opt.option_id==='bg_image')   changeListener=bg_listener;
      else                       changeListener=refreshStuff;
      ml.persistantInput(opt.option_id,changeListener,opt.option_default,0,opt.option_id!=='show_seconds'&&opt.option_id!=='show_pm'&&opt.option_id!=='12_hour');
    }
    theme_change_listener();
  })();
  //}}}

  await Promise.race([awaitClockFont, sleep({seconds: 0.4})]);
}

function get_option_list() {
  return [
    {
      option_id:'theme',
      option_type: 'preset-type'
      option_description:'theme',
      option_default: 'steel',
    },
    {
      option_id: 'clock_font',
      option_type: 'font-list-type'
      option_description: 'font',
      option_default: 'Josefin Slab',
      option_negative_dependency: 'theme',
    },
    {
      option_id: 'color_font',
      option_type: 'color-type'
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

function init_options({option_list, preset_list}) {
  const options_container = document.getElementById('options-container');
  generate_option_elements({options_container, option_list, preset_list});
}

function generate_color_input() {
  const input_el =
  const dom_el =
  generate_input({option_description, input_type: 'input'});
}


function generate_boolean_input() {
}
function generate_input({option_description}) {
  const dom_el = document.createElement('label');

  dom_el.appendChild(document.createElement('span')).innerHTML = opt.option_description;//+'&nbsp;';

  return dom_el;
}

    opt.input_el = document.createElement(opt.option_id==='clock_font'||opt.option_id==='theme'?'select':'input');
      opt.input_el.option_id   = opt.option_id;
      var isCheckbox   = opt.option_default===false || opt.option_default===true;
      var isColorInput = opt.option_default[0]==='#';
      var isTextInput  = !isCheckbox && !isColorInput;
      if(opt.input_el.nodeName==='INPUT')
      {
        if(isColorInput) opt.input_el.style.width = '35px';
        if(isTextInput)
        {
          if(opt.option_placeholder || opt.option_default) opt.input_el.size=(opt.option_placeholder || opt.option_default).length*3/4;
          else opt.input_el.style.width = '35px';
        }
        opt.input_el.setAttribute('type',isCheckbox?'checkbox':(isColorInput?'color':'text'));
      }
      else opt.input_el.style.width=opt.option_id==='clock_font'?'90px':'83px';
      if(isCheckbox) dom_el.insertBefore(opt.input_el,dom_el.firstChild);
      else           dom_el. appendChild(opt.input_el);
      if(opt.option_placeholder) opt.input_el.placeholder=opt.option_placeholder;

    if(isCheckbox || isColorInput) dom_el['classList']['add']('pointer-cursor');
    options_container.appendChild(dom_el);

    Object.assign(dom_el, {
      hide,
      show,
      get_option_value,
      set_option_value,
    });

function generate_option_elements({options_container, option_list, preset_list}) {

  option_list.forEach(opt => {
    const {
      get_option_value,
      set_option_value,
    } = (function() {
      const {option_description} = opt;
      if( opt.option_type === 'color-type' ){
        return generate_color_input({option_description});
      }
    })();

  }




  //populate theme option
  document.getElementById('theme').innerHTML='<option label="<custom>" value="">&lt;custom&gt;</option><option label="<random>" value="random">&lt;random&gt;</option>';
  for(var i in THEME_LIST)
  {
    var fop=document.createElement('option');
    fop.innerHTML=i;
    fop.value    =i;
    document.getElementById('theme').appendChild(fop);
  }
}
