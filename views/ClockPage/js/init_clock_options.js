import ml from '../../ml';
import setBackground from './setBackground';
import {sleep} from '../../../tab-utils/sleep';
import loadFontList from './loadFontList';
import {dom_beat} from './load_clock';
import {refresh_big_text_size} from '../../BigText';

export default init_clock_options;

export {get_opt};
function get_opt(...args){return getOpt(...args);}
var getOpt;

async function init_clock_options() {
  let resolveAwaitClockFont;
  const awaitClockFont = new Promise(r => resolveAwaitClockFont = r);

  const clock_el = document.getElementById('middle_table');

  const DEFAULT_12HOUR = /(AM)|(PM)/.test(new Date().toLocaleTimeString())||window.navigator.language==='en-US';
  const DEFAULT_BG_COLOR = '#ffffff';
  const DEFAULT_BG_IMAGE = '';
  const DEFAULT_FONT = 'Josefin Slab';
  const DEFAULT_FCOL = '#a70000';
//const DEFAULT_ICOL = '#cc0000';
//const DEFAULT_ICOL = '#007000';
  const DEFAULT_ICOL = '#545454';
  const DEFAULT_SHADOW = '';
  const DEFAULT_THEME = 'steel';
  const FS_NAME = "fs";
  const MIN_WIDTH = 580;

  /* OPTIONS */
  const opts = [
    {id:'theme'             ,description:'theme'           ,default_:DEFAULT_THEME                             },
    {id:'clock_font'        ,description:'font'            ,default_:DEFAULT_FONT        ,negDependency:'theme'},
    {id:'color_font'        ,description:'font color'      ,default_:DEFAULT_FCOL        ,negDependency:'theme'},
    {id:'font_shadow'       ,description:'font shadow'     ,default_:DEFAULT_SHADOW      ,negDependency:'theme',placeholder:'see css text-shadow'},
    {id:'font_size'         ,description:'font size'       ,default_:MIN_WIDTH.toString()                },
    {id:'bg_color'          ,description:'background color',default_:DEFAULT_BG_COLOR    ,negDependency:'theme'},
    {id:'bg_image'          ,description:'background image',default_:DEFAULT_BG_IMAGE    ,negDependency:'theme',placeholder:'image url'},
    {id:'color_icon'        ,description:'icon color'      ,default_:DEFAULT_ICOL                        },
    {id:'show_seconds_title',description:'seconds in title',default_:false                               },
    {id:'show_seconds'      ,description:'seconds'         ,default_:true                                },
    {id:'12_hour'           ,description:'12-hour'         ,default_:DEFAULT_12HOUR                      },
    {id:'show_pm'           ,description:'am/pm'           ,default_:true                ,dependency:'12_hour'          },
    {id:'show_date'         ,description:'date'            ,default_:true                                               },
    {id:'show_week'         ,description:'week'            ,default_:false               ,dependency:'show_date'        }
  ];

  var themes = {
    'simple':{
      'bg_color':'#ffffff',
      'bg_image': '',
      'clock_font':'Syncopate',
      'font_shadow':'none',
      'color_font':'#333333'},
    'steel':{
      'bg_color':'',
      //original URL: http://good-wallpapers.com/pictures/6357/Gray%20Comb%20Texture.jpg
      'bg_image':'https://i.imgur.com/9YKVj.jpg',
      'clock_font':'Syncopate',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#e9e9e9'},
    'grey':{
      'bg_color':'#3D3F42',
      'bg_image': '',
      'clock_font':'Lora',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#EBEBF1'},
    'lobster':{
      'bg_color':'#330000',
      'bg_image': '',
      'clock_font':'Lobster',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#333333'},
    'digital':{
      'bg_color':'black',
      'bg_image': '',
      'clock_font':'Orbitron',
      'font_shadow':'none',
      'color_font':'#00ff00'},
    'paper':{
      //original URL: http://wallpaper.goodfon.ru/image/209099-1920x1200.jpg
      'bg_color':'',
      'bg_image':'https://i.imgur.com/x97za.jpg',
      'clock_font':'Redressed',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#111111'},
    'ocean':{
      //orginal URL: http://www.hotelclubposeidon.it/grafica/background.jpg
      'bg_color':'',
      'bg_image':'https://i.imgur.com/mOHYs.jpg',
      'clock_font':'Michroma',
    //'font_shadow':'1px 1px 2px #fff',
    //'font_shadow':'0px 1px 1px #333',
      'font_shadow':'none',
      'color_font':'#333'},
    'classy':{
    // orginal URL: http://www.fantasy-and-art.com/wp-content/gallery/abstract-wallpapers/between_darkness_and_wonder_black_purity_hd_wallpaper.jpg
      'bg_color':'',
      'bg_image':'https://i.imgur.com/0KS5T.jpg',
      'clock_font':'Nothing You Could Do',
      'font_shadow':'none',
      'color_font':'#0000aa'},
    'ocean2':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/i6yiy.jpg',
      'clock_font':'Droid Sans Mono',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#fff'},
    'river_valley':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/8G6JM.jpg',
      'clock_font':'Lato',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#fff'},
    'red':{
      'bg_color':'#a00',
      'bg_image': '',
      'clock_font':'Muli',
      'font_shadow':'0 1px 1px #000',
      'color_font':'#1a1a1a'},
    'sin_city':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/R60yCtG.jpg',
      'clock_font':'Knewave',
      'color_font':'#e71010'},
    'van_gogh':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/WfHm7XM.jpg',
      'clock_font':'Akronim',
      'color_font':'#b63232'},
    'mars_terraformed':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/9Ocmfvt.png',
      'font_shadow':'0 1px 1px #000',
      'clock_font':'Allerta Stencil',
      'color_font':'#6d0000'},
    'neo':{
      'bg_color':'black',
      'bg_image':'',
      'font_shadow':'',
      'clock_font':'Allerta Stencil',
      'color_font':'#6d0000'},
    'purple':{
      'bg_color':'#0e0e0e',
      'bg_image':'',
      'font_shadow':'',
      'clock_font':'Text Me One',
      'color_font':'#6d30be'},
    'naruto':{
      'bg_color':'',
      'bg_image':'https://i.imgur.com/iyyms5e.jpg',
      'font_shadow':'',
      'clock_font':'Knewave',
      'color_font':'#ffdf00'},
  };

  var randomTheme = (function()
  {
  //var random = Math.floor(Math.random()*ml.len(themes));
    var random = Math.floor(Math.random()*Object.keys(themes).length);
    var counter=0;
    for(var ret in themes) if(counter++===random) return ret;
  })();

  function isCustomTheme() {
    return getOpt('theme')==='';
  }
  getOpt=function(id) {
    if( id!=='theme' ){
      var theme = getOpt('theme');
      if(theme==='random') theme=randomTheme;
      if( theme && themes[theme] && (id in themes[theme])) {
        return themes[theme][id];
      }
    }
    var el = document.getElementById(id);

  // return el.type==='text'||el.type==='color'||el.nodeName==='SELECT'?el.value:!!el.checked;

    if( el.type==='checkbox' ){
      return !!el.checked;
    }
    return el.value;
  };

  //generate html options
  //{{{
  (function()
  {
    const optionsEl = document.getElementById('options-container');
    for(var i=0;i<opts.length;i++) {
      var opt = opts[i];
      opt.dom = document.createElement('label');
      opt.dom.setAttribute('class','opti');
      opt.dom.appendChild(document.createElement('span')).innerHTML=opt.description;//+'&nbsp;';
      //opt.dom.innerHTML=opt.description;
      opt.input = document.createElement(opt.id==='clock_font'||opt.id==='theme'?'select':'input');
        opt.input.id   = opt.id;
        var isCheckbox   = opt.default_===false || opt.default_===true;
        var isColorInput = opt.default_[0]==='#';
        var isTextInput  = !isCheckbox && !isColorInput;
        if(opt.input.nodeName==='INPUT')
        {
          if(isColorInput) opt.input.style.width = '35px';
          if(isTextInput)
          {
            if(opt.placeholder || opt.default_) opt.input.size=(opt.placeholder || opt.default_).length*3/4;
            else opt.input.style.width = '35px';
          }
          opt.input.setAttribute('type',isCheckbox?'checkbox':(isColorInput?'color':'text'));
        }
        else opt.input.style.width=opt.id==='clock_font'?'90px':'83px';
        if(isCheckbox) opt.dom.insertBefore(opt.input,opt.dom.firstChild);
        else           opt.dom. appendChild(opt.input);
        if(opt.placeholder) opt.input.placeholder=opt.placeholder;
      if(isCheckbox || isColorInput) opt.dom['classList']['add']('pointerCursor');
      optionsEl.appendChild(opt.dom);
    }

    //populate theme option
    document.getElementById('theme').innerHTML='<option label="<custom>" value="">&lt;custom&gt;</option><option label="<random>" value="random">&lt;random&gt;</option>';
    for(var i in themes)
    {
      var fop=document.createElement('option');
      fop.innerHTML=i;
      fop.value    =i;
      document.getElementById('theme').appendChild(fop);
    }
  })();
    //}}}

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
      for(var i=0;i<opts.length;i++)
      {
        var opt = opts[i];
        var toHide=opt.dependency && !getOpt(opt.dependency) || opt.negDependency && getOpt(opt.negDependency);
          opt.dom.style.width     =toHide?'0px'   :'';
          opt.dom.style.height    =toHide?'0px'   :'';
          opt.dom.style.visibility=toHide?'hidden':'visible';
          opt.dom.style.position  =toHide?'absolute':'';
          opt.dom.style.zIndex    =toHide?'-1':'';
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
        const fonts = Object.values(themes).map(t => t.clock_font);
        loadFontList(fonts);
      }
    }
    function refreshStuff(){dom_beat(true);setOptVisibility()};

    for(var i=0;i<opts.length;i++)
    {
      var opt = opts[i];
      var changeListener;
      if(opt.id==='show_seconds')changeListener=function(val){
        document.body['classList'][val?'remove':'add']('noSeconds');refreshStuff();setTimeout(refreshStuff,100);};
      else if(opt.id==='show_pm'||opt.id==='12_hour')
        changeListener=function(){
        document.body['classList'][getOpt('show_pm')&&getOpt('12_hour')?'remove':'add']('noPeriod');
        refreshStuff();
        setTimeout(refreshStuff,100);//again with timeout because sometimes it seems that effect if changing classList is delayed
      }
      else if(opt.id==='font_shadow') changeListener=fontShadowListener;
      else if(opt.id==='color_font')  changeListener=colorChangeListener;
      else if(opt.id==='theme')  changeListener=theme_change_listener;
      else if(opt.id==='clock_font')   changeListener=loadClockFont;
      else if(opt.id==='bg_color')   changeListener=bg_listener;
      else if(opt.id==='bg_image')   changeListener=bg_listener;
      else                       changeListener=refreshStuff;
      ml.persistantInput(opt.id,changeListener,opt.default_,0,opt.id!=='show_seconds'&&opt.id!=='show_pm'&&opt.id!=='12_hour');
    }
    theme_change_listener();
  })();
  //}}}

  await Promise.race([awaitClockFont, sleep({seconds: 0.4})]);
}
