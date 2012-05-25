(function(){

var DEFAULT_12HOUR = /(AM)|(PM)/.test(new Date().toLocaleTimeString())||window.navigator.language==='en-US';
var DEFAULT_BG     = '#fff';
var DEFAULT_FONT   = 'Josefin Slab';
var DEFAULT_FCOL   = '#333';
var FS_NAME        = "fs";
var timeEl         = document.getElementById('time');
var dateEl         = document.getElementById('date');
var contentEl      = document.getElementById('content');
var MIN_WIDTH      = 450

/* SIZE of time */
function setSize(){
//{{{
  if(document.documentElement['classList'].contains('big'))
  {
    //timeEl.setTextSize(document.body.clientWidth,document.body.clientHeight);
    timeEl.setTextSize(window.innerWidth,window.innerHeight);
    return;
  }

  //var WIDTH_PERCENT = 40
  //var time_new_size = timeEl.setTextSize(window.innerWidth<MIN_WIDTH?window.innerWidth:Math.max(Math.floor(window.innerWidth/WIDTH_PERCENT),MIN_WIDTH),window.innerHeight,true);
  var minW = getOpt('font_size');
  if(minW) minW=parseInt(minW,10);
  if(!minW) minW=MIN_WIDTH;
  var time_new_size = timeEl.setTextSize(window.innerWidth<minW?window.innerWidth:minW,window.innerHeight,true);
  ml.assert(time_new_size.width && time_new_size.height);
  if(dateEl.innerHTML!="")
  {
    var date_new_size = dateEl.setTextSize(time_new_size.width*0.95,window.innerHeight,true);
    var diff = time_new_size.height+date_new_size.height-window.innerHeight;
    if(diff>0)
    {
      time_new_size = timeEl.setTextSize(window.innerWidth  ,window.innerHeight-date_new_size.height,true);
      date_new_size = dateEl.setTextSize(time_new_size.width,window.innerHeight-time_new_size.height,true);
      time_new_size = timeEl.setTextSize(window.innerWidth  ,window.innerHeight-date_new_size.height,true);
    }
    dateEl.style.fontSize = date_new_size.fontSize+'px';
  }
  timeEl.style.fontSize = time_new_size.fontSize+'px';
//}}}
}
window.addEventListener('resize',setSize,false);

/* OPTIONS */
var getOpt;
(function(){
//{{{
 //generate options
  getOpt=function(id)
  //{{{
  {
    if(id!=='theme')
    {
      var theme = getOpt('theme');
      var ret   = theme && themes[theme] && themes[theme][id];
      if(ret) return ret;
    }
    var el = document.getElementById(id);
    return el.type==='text'||el.nodeName==='SELECT'?el.value:!!el.checked;
  };
  //}}}

 var opts = [
   {id:'theme'             ,description:'theme'           ,default_:'lobster'                         },
   {id:'font'              ,description:'font'            ,default_:DEFAULT_FONT,negDependency:'theme'},
   {id:'color_font'        ,description:'font color'      ,default_:DEFAULT_FCOL,negDependency:'theme'},
   {id:'bg'                ,description:'background image',default_:DEFAULT_BG  ,negDependency:'theme'},
   {id:'color_icon'        ,description:'icon color'      ,default_:'#c00'                            },
   {id:'show_seconds_title',description:'seconds in title',default_:false                             },
   {id:'show_seconds'      ,description:'seconds'         ,default_:false                             },
   {id:'12_hour'           ,description:'12-hour'         ,default_:DEFAULT_12HOUR                    },
   {id:'show_pm'           ,description:'am/pm'           ,default_:true ,dependency:'12_hour'        },
   {id:'show_date'         ,description:'date'            ,default_:true                              },
   {id:'show_week'         ,description:'week'            ,default_:false,dependency:'show_date'      },
   {id:'font_size'         ,description:'font size'       ,default_:MIN_WIDTH.toString()              }];

 var themes = {
   'simple':{
      'bg':'#fff',
      'font':'Syncopate',
      'color_font':'#333'},
   'steel':{
      'bg':'http://good-wallpapers.com/pictures/6357/Gray%20Comb%20Texture.jpg',
      'font':'Syncopate',
      'color_font':'#a00'},
   'lobster':{
      'bg':'#300',
      'font':'Lobster',
      'color_font':'#333'},
   'digital':{
      'bg':'black',
      'font':'Orbitron',
      'color_font':'#0f0'},
   'paper':{
      //original URL: http://wallpaper.goodfon.ru/image/209099-1920x1200.jpg
      'bg':'http://i.imgur.com/x97za.jpg',
      'font':'Redressed',
      'color_font':'#111'},
   'ocean':{
      'bg':'http://www.hotelclubposeidon.it/grafica/background.jpg',
      'font':'Michroma',
      'color_font':'#aaa'},
   'classy':{
      'bg':'http://www.fantasy-and-art.com/wp-content/gallery/abstract-wallpapers/between_darkness_and_wonder_black_purity_hd_wallpaper.jpg',
      'font':'Nothing You Could Do',
      'color_font':'#00a'}};

  //generate html options
  //{{{
  (function()
  {
    var optionsEl = document.getElementById('options');
    for(var i=0;i<opts.length;i++)
    {
      var opt = opts[i];
      opt.dom = document.createElement('span');
      opt.dom.innerHTML=opt.description;
      opt.input = document.createElement(opt.id==='font'||opt.id==='theme'?'select':'input');
        opt.input.id   = opt.id;
        var isCheckbox = opt.default_===false || opt.default_===true;
        if(opt.input.nodeName==='INPUT')
        {
          opt.input.type = isCheckbox?'checkbox':'text';
          if(!isCheckbox) opt.input.style.width='35px';
        }
        else opt.input.style.width=opt.id==='font'?'90px':'68px';
        if(isCheckbox) opt.dom.prependChild(opt.input);
        else           opt.dom. appendChild(opt.input);
      optionsEl.appendChild(opt.dom);
    }

    setTimeout(function(){//gecko requires a timeout
      document.getElementById('description')  .style.opacity='0';
      document.getElementById('optionsToggle').style.opacity='0';
    },200);
    document.getElementById('optionsToggle').onclick=function(){document.documentElement['classList']['add']('options');document.getElementById('optionsToggle').style.opacity='1'};
    document.body.onclick=function(ev) { var target=ml.getEventSource(ev); if(!ml.isChildOf(target,document.getElementById('optionsToggle'))&&!ml.isChildOf(target,document.getElementById('options'))){document.documentElement['classList']['remove']('options');document.getElementById('optionsToggle').style.opacity=0}};

    document.getElementById('theme').innerHTML='<option label="custom" value="">custom</option>';
    for(var i in themes)
    {
      var fop=document.createElement('option');
      fop.innerHTML=i;
      document.getElementById('theme').appendChild(fop);
    }
  })();
  //}}}

  var refreshFont;
  (function() {
  //{{{
    var bodyFontLoader;
    refreshFont=function(){if(bodyFontLoader) bodyFontLoader()};
    ml.loadScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',function()
    {
      function loader(fontName,callback)
      {
        var attempts=0;
        (function do_()
        {
          window['WebFont']['load']({'google':{'families':[fontName]},
                                     'active':callback,
                                     'fontinactive':function(){setTimeout(do_,Math.pow(2,attempts++)*5*1000)}
                                   });
        })();
      }
      bodyFontLoader=function()
      {
        var fontName = getOpt('font');
        loader(fontName,function()
        {
          if(fontName===getOpt('font') && document.body.style.fontFamily!==fontName)
          {
            document.body.style.fontFamily=fontName;
            setSize();
          }
        })
      };
      loader('Arvo',function(){document.getElementById('options').style.fontFamily='Arvo'});
      refreshFont();
    });
  /*
    var fontChanger;
    ml.loadScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',function()
    //{{{
    {
      fontChanger=function(el,fontName,callback)
      {
        window['WebFont']['load']({'google':{'families':[fontName]},'active':function()
        {
          setTimeout(function()
          {
            el.style.fontFamily=fontName;
            if(callback)callback();
          },100);
        }});
      };
      setFont(document.getElementById('options'),'Arvo');
      refreshFont();
    });
    //}}}
    function setFont(){if(fontChanger) fontChanger.apply(null,arguments)};
    refreshFont=function(){setFont(document.body,getOpt('font'),setSize)};
  */
  //}}}
  })();

  //refresh options onchange
  //{{{
  (function()
  {
    function setOptVisibility()
    {
      for(var i=0;i<opts.length;i++)
      {
        var opt = opts[i];
        var toHide=opt.dependency && !getOpt(opt.dependency) || opt.negDependency && getOpt(opt.negDependency);
          opt.dom.style.width     =toHide?'0px'   :'auto';
          opt.dom.style.height    =toHide?'0px'   :'auto';
          opt.dom.style.visibility=toHide?'hidden':'visible';
          opt.dom.style.position  =toHide?'absolute':'';
          opt.dom.style.zIndex    =toHide?'-1':'';
      }
    }
    function colorChangeListener(){document.documentElement.style.color=getOpt('color_font')}
    function themeChangeListener(){colorChangeListener();refreshFont();bgChanger(getOpt('bg'));setOptVisibility()}

    var bgChanger;
    for(var i=0;i<opts.length;i++)
    {
      var opt = opts[i];
      if(opt.id==='bg'){
        bgChanger=ml.htmlBackground(opt.input.id,opt.dom,opt.default_);
      }
      else
      {
        var changeListener;
        if(opt.id==='color_font') changeListener=colorChangeListener;
        else if(opt.id==='theme') changeListener=themeChangeListener;
        else if(opt.id==='font')  changeListener=refreshFont;
        else                      changeListener=function(){domBeat(true);setOptVisibility()};
        ml.persistantInput(opt.id,changeListener,opt.default_,0,true);
      }
    }
    themeChangeListener();
  })();
  //}}}

  //fullscreen
  //{{{
  (function()
  {
    function bigger()
    //{{{
    {
      //document.body.webkitRequestFullScreen();
      //timeEl.style.marginTop='0px';
      //timeEl.style.marginTop=window.innerHeight/2-timeEl.getPosition().y
      //                    -parseInt(timeEl.getStyle('height'))/2
      //                    +'px';
      document.documentElement['classList'].add('big');
      setSize();
    }
    //}}}
    function unbigger()
    //{{{
    {
      //timeEl.style.marginTop='0px';
      document.documentElement['classList'].remove('big');
      setSize();
    }
    //}}}
    ml.fullscreenElement(bigger,unbigger,[document.getElementById('time')],'f');
  })();
  //}}}
//}}}
})();

/* TIME */
var domBeat;
var spark;
(function(){
//{{{
  var content   =document.getElementById('content');

  var lastMinutes,
      lastTitle,
      lastColor,
      lastTwelveClock,
      lastDay,
      lastWeekOpt,
      lastTime,
      lastTimeWithoutSeconds;
  domBeat=function(force)
  //{{{
  {
    var d= new Date();

    var title = d.getHoursReadable(getOpt('12_hour')) + ":" + d.getMinutesReadable() + (getOpt('show_seconds_title')?":"+d.getSecondsReadable():"");
    if(lastTitle===undefined || lastTitle!==title || force)
    {
      lastTitle      = title;
      document.title = title;
    }

    var minutes = (new Date).getMinutesReadable();
    if(!lastMinutes || lastMinutes!==minutes || force)
    {
      lastMinutes=minutes;
      ml.changeIcon(ml.timeIcon(undefined,getOpt('color_icon'),getOpt('12_hour')));
    }

    ml.reqFrame(function()
    {
      var refreshSize;

      //tmp code till seconds prob get a solution
      var newTimeWithoutSeconds = d.getHoursReadable(getOpt('12_hour')) + ":" + d.getMinutesReadable() + (getOpt('12_hour')&&getOpt('show_pm')?" "+(d.getHours()<12?"AM":"PM"):"");
      if(lastTimeWithoutSeconds===undefined || lastTimeWithoutSeconds!==newTimeWithoutSeconds || force)
      {
        refreshSize=true;
        lastTimeWithoutSeconds=newTimeWithoutSeconds;
      }

      var newTime = d.getHoursReadable(getOpt('12_hour')) + ":" + d.getMinutesReadable() + (getOpt('show_seconds')?":"  + d.getSecondsReadable():"") + (getOpt('12_hour')&&getOpt('show_pm')?" "+(d.getHours()<12?"AM":"PM"):"");
      //var newTime = "&nbsp; 01:37 PM &nbsp;";
      if(lastTime===undefined || lastTime!==newTime || force)
      {
        lastTime         = newTime;
        timeEl.innerHTML = newTime;
        //refreshSize = true;
      }

      var day = d.getDay();
      if(!lastDay || lastDay!==day || force)
      {
        lastDay=day;
        dateEl.innerHTML = getOpt('show_date')?(d.getDayReadable()   + " - " + d.getMonthReadable() + " "+ d.getDateReadable() + (getOpt('show_week')?" - Week " + d.getWeek():"")):"";
        //dateEl.innerHTML = "Thursday - January 01";
        refreshSize = true;
      }
      if(refreshSize) setSize();
    });
  };
  //}}}

  var sparked;
  spark = function()
  {
    ml.assert(!sparked);
    sparked=true;
    (function()
    {
      domBeat();
      window.setTimeout(arguments.callee,300);
    })();
  };
//}}}
})();

spark();
})();

//load font list
(function(){
//{{{
  window['onfontsload']=function(resp)
  {
    var fonts=resp['items'];
    var val = document.getElementById('font').value;
    document.getElementById('font').innerHTML='';
    var max=300;//firefox crashes when selecting a from too many options
    for(var i in fonts)
    {
      if(ml.browser().usesGecko && !max--)break;
      var fop=document.createElement('option');
      fop.innerHTML=fonts[i]['family'];
      document.getElementById('font').appendChild(fop);
    }
    document.getElementById('font').value=val;
  };
  ml.loadScript('https://www.googleapis.com/webfonts/v1/webfonts?callback=onfontsload&sort=popularity&key=AIzaSyAOMrdvfJJPa1btlQNCkXT9gcA-lCADPeE');
//}}}
})();
