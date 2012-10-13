var IS_BACKGROUND_TASK=typeof window === "undefined";
function load(){

//var winObj = window['Windows'];
var winObj = typeof Windows !== "undefined" && Windows;
if(winObj){
  (function(){ 
    var tile={};
    (function(){ 
      var Noti = winObj['UI']['Notifications'];
      tile.create=function(type,line1,line2,line3){ 
      //ml.assert(type==='big' || type==='bigCenter');
        var wideTile;
        if(type==='big'){
          wideTile = Noti['TileUpdateManager']['getTemplateContent'](Noti['TileTemplateType']['tileWideText03']); 
        } else if(type==='bigCenter'){
          wideTile = Noti['TileUpdateManager']['getTemplateContent'](Noti['TileTemplateType']['tileWideSmallImageAndText01']); 
        }
        var text = wideTile.getElementsByTagName("text");
        text[0].appendChild(wideTile['createTextNode'](line1+"\n"+line2+"\n"+line3));

        var squareTile = Noti['TileUpdateManager']['getTemplateContent'](Noti['TileTemplateType']['tileSquareText02']);
        var text = squareTile.getElementsByTagName("text");
        text[0].appendChild(squareTile['createTextNode'](line1));
        text[1].appendChild(squareTile['createTextNode'](line2+"\n"+line3));
        /*
        var squareTile = Noti['TileUpdateManager']['getTemplateContent'](Noti['TileTemplateType']['tileSquareImage']);
        var tileAttributes = squareTile.getElementsByTagName("image");
        tileAttributes[0].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMElEQVRYR+3QQREAAAgCQekfWm3BZ7kCzGb2Ky4OECBAgAABAgQIECBAgAABAm2BA4XeP+FCGziJAAAAAElFTkSuQmCC";
        */

        var node = wideTile.importNode(squareTile.getElementsByTagName("binding").item(0), true);
        wideTile.getElementsByTagName("visual").item(0).appendChild(node);

        return wideTile;
      }; 
      tile.update=function(newTile,expire_,scheduled){ 
      //ml.assert(newTile&&expire_&&expire_.constructor===Date&&(!scheduled||scheduled.constructor===Date));
        var tileNotification = scheduled&&(new Noti['ScheduledTileNotification'](newTile,scheduled)) || (new Noti['TileNotification'](newTile));
        tileNotification['expirationTime'] = expire_;
        Noti['TileUpdateManager']['createTileUpdaterForApplication']()[scheduled?'addToSchedule':'update'](tileNotification);
      }; 
    })(); 
    (function(){
      var storage = winObj['Storage']['ApplicationData']['current']['localSettings']['values'];
      var lastScheduledTile = parseInt(storage['lastTile'],10) || -1;
      var time;
      var base = new Date().setSeconds(0);
      for(var i=0;i<60;i++) {
        time = +(base)+i*60000;

        if(time>lastScheduledTile){
          var d = new Date(time);
        //var line1 = ml.date.readable.getHours(d,true) + ":" +ml.date.readable.getMinutes(d)+' '+(d.getHours()<12?'AM':'PM');
          var line1 = ml.date.readable.getTime('time12_pretty',d,0,2);
          var line2 = ml.date.readable.getDay(d);
          var line3 = ml.date.readable.getMonth(d) + " "+ ml.date.readable.getDate(d);
          tile.update(tile.create('bigCenter',line1,line2,line3),new Date(time+60000),i>0&&d);
        }
      }
      storage['lastTile'] = time;
    })();
  })(); 

  if(IS_BACKGROUND_TASK){//=> this js is called as background task
    close();
    return;
  }else{
    var builder = new winObj['ApplicationModel']['Background']['BackgroundTaskBuilder']();
    builder['name'] = "Maintenance background task";
    builder['taskEntryPoint'] = "sf\\_.js";
    //Run every 2 minutes if the device is on AC power
    var trigger = new winObj['ApplicationModel']['Background']['MaintenanceTrigger'](15, false);
    builder['setTrigger'](trigger);
    var task = builder['register']();
  }

  if(ml.replaceWebApp('ms-appx-web:///index.html')) return;
}

var IS_METRO_APP   = /^ms/.test(location.href);
(function(){
  var DEFAULT_12HOUR = /(AM)|(PM)/.test(new Date().toLocaleTimeString())||window.navigator.language==='en-US';
  var DEFAULT_BG     = '';
  var DEFAULT_FONT   = 'Josefin Slab';
  var DEFAULT_FCOL   = '#333333';
  //var DEFAULT_ICOL   = '#cc0000';
  //var DEFAULT_ICOL   = '#007000';
  var DEFAULT_ICOL   = '#545454';
  var DEFAULT_SHADOW = '';
  var DEFAULT_THEME  = 'steel';
  var FS_NAME        = "fs";
  var MIN_WIDTH      = IS_METRO_APP?500:550;
  var timeEl         = document.getElementById('time');
  var timeTableEl    = document.getElementById('timeTable');
  var timeRowEl      = document.getElementById('timeRow');
  var dateEl         = document.getElementById('date');
  var contentEl      = document.getElementById('content');

  /* SIZE of time */
  var timeout;
  function setSize(){
  //{{{
    window.clearTimeout(timeout);setTimeout(function(){
      var time_new_size = ml.getTextSize(timeRowEl,Math.min(window.innerWidth,parseInt(getOpt('font_size'),10)||Infinity),window.innerHeight);
      ml.assert(time_new_size.width && time_new_size.height);
      if(dateEl.innerHTML!="")
      {
        var date_new_size = ml.getTextSize(dateEl,time_new_size.width*0.95,window.innerHeight);
        var diff = time_new_size.height+date_new_size.height-window.innerHeight;
        if(diff>0)
        {
          time_new_size = ml.getTextSize(timeRowEl,window.innerWidth  ,window.innerHeight-date_new_size.height);
          date_new_size = ml.getTextSize(dateEl,time_new_size.width,window.innerHeight-time_new_size.height);
          time_new_size = ml.getTextSize(timeRowEl,window.innerWidth  ,window.innerHeight-date_new_size.height);
        }
        dateEl.style.fontSize = date_new_size.fontSize+'px';
      }
      timeTableEl.style.fontSize = time_new_size.fontSize  +'px';
    },2000);
  //}}}
  }
  window.addEventListener('resize',setSize,false);

  /* OPTIONS */
  var getOpt;
  (function(){
  //{{{
   var opts = [
     {id:'theme'             ,description:'theme'           ,default_:DEFAULT_THEME                             },
     {id:'font'              ,description:'font'            ,default_:DEFAULT_FONT        ,negDependency:'theme'},
     {id:'color_font'        ,description:'font color'      ,default_:DEFAULT_FCOL        ,negDependency:'theme'},
     {id:'font_shadow'       ,description:'font shadow'     ,default_:DEFAULT_SHADOW      ,negDependency:'theme',placeholder:'see css text-shadow'},
     {id:'font_size'         ,description:'font size'       ,default_:MIN_WIDTH.toString()                },
     {id:'bg'                ,description:'background'      ,default_:DEFAULT_BG          ,negDependency:'theme',placeholder:'url or color'},
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
        'bg':'#ffffff',
        'font':'Syncopate',
        'color_font':'#333333'},
     'steel':{
        //original URL: http://good-wallpapers.com/pictures/6357/Gray%20Comb%20Texture.jpg
        'bg':'http://i.imgur.com/9YKVj.jpg',
        'font':'Syncopate',
        'color_font':'#e9e9e9'},
     'grey':{
        'bg':'#3D3F42',
        'font':'Lora',
        'font_shadow':'0 1px 1px #000',
        'color_font':'#EBEBF1'},
     'lobster':{
        'bg':'#330000',
        'font':'Lobster',
        'color_font':'#333333'},
     'digital':{
        'bg':'black',
        'font':'Orbitron',
        'color_font':'#00ff00'},
     'paper':{
        //original URL: http://wallpaper.goodfon.ru/image/209099-1920x1200.jpg
        'bg':'http://i.imgur.com/x97za.jpg',
        'font':'Redressed',
        'color_font':'#111111'},
     'ocean':{
        //orginal URL: http://www.hotelclubposeidon.it/grafica/background.jpg
        'bg':'http://i.imgur.com/mOHYs.jpg',
        'font':'Michroma',
        'font_shadow':'1px 1px 2px #888',
        'color_font':'#aaaaaa'},
     'classy':{
      // orginal URL: http://www.fantasy-and-art.com/wp-content/gallery/abstract-wallpapers/between_darkness_and_wonder_black_purity_hd_wallpaper.jpg
        'bg':'http://i.imgur.com/0KS5T.jpg',
        'font':'Nothing You Could Do',
        'color_font':'#0000aa'}
   }; 

    var randomTheme = (function()
    {
    //var random = Math.floor(Math.random()*ml.len(themes));
      var random = Math.floor(Math.random()*Object.keys(themes).length);
      var counter=0;
      for(var ret in themes) if(counter++===random) return ret;
    })();

    //generate options
    getOpt=function(id)
    //{{{
    {
      if(id!=='theme')
      {
        var theme = getOpt('theme');
        if(theme==='random') theme=randomTheme;
        var ret   = theme && themes[theme] && themes[theme][id];
        if(ret) return ret;
      }
      var el = document.getElementById(id);
      return el.type==='text'||el.type==='color'||el.nodeName==='SELECT'?el.value:!!el.checked;
    };
    //}}}

    //generate html options
    //{{{
    (function()
    {
      var optionsEl = document.getElementById('options');
      for(var i=0;i<opts.length;i++)
      {
        var opt = opts[i];
        opt.dom = document.createElement('label');
        opt.dom.setAttribute('class','opti');
        opt.dom.appendChild(document.createElement('span')).innerHTML=opt.description;//+'&nbsp;';
        //opt.dom.innerHTML=opt.description;
        opt.input = document.createElement(opt.id==='font'||opt.id==='theme'?'select':'input');
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
          else opt.input.style.width=opt.id==='font'?'90px':'83px';
          if(isCheckbox) opt.dom.insertBefore(opt.input,opt.dom.firstChild);
          else           opt.dom. appendChild(opt.input);
          if(opt.placeholder) opt.input.placeholder=opt.placeholder;
        if(isCheckbox || isColorInput) opt.dom['classList']['add']('pointerCursor');
        optionsEl.appendChild(opt.dom);
      }

      var optionsEl = document.getElementById('options');
      if(ml.browser().usesWebkit)
      {
        var initMoveFired=false;
        window.onmousemove=function(ev) {
           if(!initMoveFired++) return;
           optionsEl.setAttribute('class','hoverEnabled');
           delete window.onmousemove;
        };
      }
      else optionsEl.setAttribute('class','hoverEnabled');
      setTimeout(function(){
        document.getElementById('options').style.opacity='';
      },2000);
      /*
      //add option toggle
      setTimeout(function(){//gecko requires a timeout
        document.getElementById('optionsToggle').style.opacity='0';
      },200);
      document.getElementById('optionsToggle').onclick=function(){document.documentElement['classList']['add']('options');document.getElementById('optionsToggle').style.opacity='1'};
      document.body.onclick=function(ev) { var target=ml.getEventSource(ev); if(!ml.isChildOf(target,document.getElementById('optionsToggle'))&&!ml.isChildOf(target,document.getElementById('options'))){document.documentElement['classList']['remove']('options');document.getElementById('optionsToggle').style.opacity=0}};
      */

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

    var refreshFont;
    (function() {
    //{{{
      var bodyFontLoader;
      refreshFont=function(){if(bodyFontLoader) bodyFontLoader()};
      setTimeout(function loadFontApi(){
        ml.loadASAP('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',function(){
          //onsole.log(0);
          if(!window['WebFont']||!window['WebFont']['load']) {
            //onsole.log('false successfull');
            setTimeout(loadFontApi,2000);
            return;
          }
          function loader(fontName,callback){
            var attempts=0;
            (function do_(){
            //onsole.log(2);
              window['WebFont']['load']({'google':{'families':[fontName]},
                                         'active':callback,
                                         'fontinactive':function(){setTimeout(do_,Math.max(Math.pow(2,attempts++)*1000,60000))}
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
      },0);
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
            opt.dom.style.width     =toHide?'0px'   :'';
            opt.dom.style.height    =toHide?'0px'   :'';
            opt.dom.style.visibility=toHide?'hidden':'visible';
            opt.dom.style.position  =toHide?'absolute':'';
            opt.dom.style.zIndex    =toHide?'-1':'';
        }
      }
      function colorChangeListener(){document.documentElement.style.color        =getOpt('color_font' )}
      function fontShadowListener (){document.documentElement.style['textShadow']=getOpt('font_shadow')}
      function themeChangeListener(){fontShadowListener();colorChangeListener();refreshFont();bgChanger(getOpt('bg'));setOptVisibility()}
      function refreshStuff(){if(domBeat)domBeat(true);setOptVisibility()};

      var bgChanger;
      for(var i=0;i<opts.length;i++)
      {
        var opt = opts[i];
        if(opt.id==='bg'){
          bgChanger=ml.htmlBackground(opt.input.id,opt.default_);
        }
        else
        {
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
          else if(opt.id==='theme')  changeListener=themeChangeListener;
          else if(opt.id==='font')   changeListener=refreshFont;
          else                       changeListener=refreshStuff;
          ml.persistantInput(opt.id,changeListener,opt.default_,0,opt.id!=='show_seconds'&&opt.id!=='show_pm'&&opt.id!=='12_hour');
        }
      }
      themeChangeListener();
    })();
    //}}}

    ml.fullscreenElement(timeTableEl,'f');
  //}}}
  })();

  /* TIME */
  var domBeat;
  var spark;
  (function(){
  //{{{
    var content = document.getElementById('content');
    var digit1  = document.getElementById('digit1');
    var digit2  = document.getElementById('digit2');

    var lastMinutes,
        lastTitle,
        lastDay,
        lastTime;
    domBeat=function(force)
    //{{{
    {
      var d= new Date();

      var title = ml.date.readable.getHours(d,getOpt('12_hour')) + ":" + ml.date.readable.getMinutes(d) + (getOpt('show_seconds_title')?":"+ml.date.readable.getSeconds(d):"");
      if(lastTitle===undefined || lastTitle!==title || force)
      {
        lastTitle      = title;
        document.title = title;
      }

      var minutes = ml.date.readable.getMinutes(new Date);
      if(!lastMinutes || lastMinutes!==minutes || force)
      {
        lastMinutes=minutes;
        ml.changeIcon(ml.timeIcon(undefined,getOpt('color_icon'),getOpt('12_hour')));
      }

      ml.reqFrame(function()
      {
        var refreshSize;

        document.body['classList'][d.getHours()<12?'remove':'add']('isPm');

        var seconds = ml.date.readable.getSeconds(d);
        digit1.innerHTML=seconds[0];
        digit2.innerHTML=seconds[1];

        var newTime = ml.date.readable.getHours(d,getOpt('12_hour')) + ":" + ml.date.readable.getMinutes(d);
      //var newTime = "&nbsp; 01:37 PM &nbsp;";
        if(lastTime===undefined || lastTime!==newTime || force)
        {
          lastTime         = newTime;
          timeEl.innerHTML = newTime;
          refreshSize = true;
        }

        var day = d.getDay();
        if(!lastDay || lastDay!==day || force){
          lastDay=day;
          dateEl.innerHTML = getOpt('show_date')?(ml.date.readable.getDay(d)   + " - " + ml.date.readable.getMonth(d) + " "+ ml.date.readable.getDate(d) + (getOpt('show_week')?" - Week " + d.getWeek():"")):"";
          //dateEl.innerHTML = "Thursday - January 01";
          refreshSize = true;
        }
        if(refreshSize) setSize();
      });

      //metroTile&&metroTile(lastTime,lastDay);
    };
    //}}}

    var sparked;
    spark=function() {
      ml.assert(!sparked);
      sparked=true;
      (function(){
        domBeat();
        window.setTimeout(arguments.callee,1000);
      })();
    };
  //}}}
  })();

  spark();
})();

//load font list
setTimeout(function(){
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
      fop.value    =fonts[i]['family'];
      document.getElementById('font').appendChild(fop);
    }
    document.getElementById('font').value=val;
  };
  ml.loadASAP('https://www.googleapis.com/webfonts/v1/webfonts?callback=onfontsload&sort=popularity&key=AIzaSyAOMrdvfJJPa1btlQNCkXT9gcA-lCADPeE');
//}}}
},0);

setTimeout(function(){ml.loadAnalytics('UA-5263303-5')},0);

if(IS_METRO_APP || ml.browser().usesGecko) {
  //no way to detected if run in firefox or as stand alone web app => disable for both
  document.getElementById('color_icon')        .parentElement.style.display='none';
  document.getElementById('show_seconds_title').parentElement.style.display='none';
}

};
if(IS_BACKGROUND_TASK) load();
else window.onload=load;
