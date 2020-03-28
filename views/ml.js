import assert from '@brillout/assert';

const ml = {};

export default ml;

//closure compiler behavior
//-var p=Date.prototype;p.neverCalled=function..;// --> neverCalled isn't removed
//-window.neverCalled=function..;// --> neverCalled isn't removed

//shim
(function(){ 
  if(typeof document === "undefined") return;//=> called as metro background task

  //classList
  //{{{
  //required for IE9
  //use ['classList'] instead of .classList because of google closure compiler
  //Please note that this shim does not work in Internet Explorer versions less than 8.
  (function () {

  var classListProp = "classList";

  if (!Element.prototype.hasOwnProperty(classListProp)) {
    var trim = /^\s+|\s+$/g,
    setClasses = function (elem, classes) {
      elem.className = classes.join(" ");
    },
    checkAndGetIndex = function (classes, token) {
      if (token === "") {
        throw "SYNTAX_ERR";
      }
      if (/\s/.test(token)) {
        ml.assert(false);
        throw "INVALID_CHARACTER_ERR";
      }
      
      return classes.indexOf(token);
    },
    classListGetter = function () {
      var elem = this,
      classes  = elem.className.replace(trim, "").split(/\s+/);
      return {
        'length': classes.length,
        'item': function (i) {
          return classes[i] || null;
        },
        'contains': function (token) {
          return checkAndGetIndex(classes, token) !== -1;
        },
        'add': function (token) {
          if (checkAndGetIndex(classes, token) === -1) {
            classes.push(token);
            this['length'] = classes.length;
            setClasses(elem, classes);
          }
        },
        'remove': function (token) {
          var index = checkAndGetIndex(classes, token);
          if (index !== -1) {
            classes.splice(index, 1);
            this['length'] = classes.length;
            setClasses(elem, classes);
          }
        },
        'toggle': function (token) {
          if (checkAndGetIndex(classes, token) === -1) {
            this['add'](token);
          } else {
            this['remove'](token);
          }
        },
        'toString': function () {
          return elem.className;
        }
      };
    };
    
    if (Object['defineProperty']) {
      Object['defineProperty'](Element.prototype, classListProp, { 'get': classListGetter });
    } else if (Object.prototype['__defineGetter__']) {
      Element.prototype['__defineGetter__'](classListProp, classListGetter);
    }
  }

  })();
  //}}}

})(); 

(function(){

ml.date={};
(function(){
  ml.date.appendZero=function(str){ 
    if(str<10)
      return '0'+str;
    else
      return ''+str;
  }; 
  var weekday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
  var month  =new Array("January","February","March","April","May","June","July","August","September","October","November","December");
  ml.date.getWeek = function(that) 
  //{{{
  {
  /**
   * Returns the week number for that date.  dowOffset is the day of week the week
   * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
   * the week returned is the ISO 8601 week number.
   * @param int dowOffset
   * @return int
   */
  //Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    var dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(that.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((that.getTime() - newYear.getTime() - 
    (that.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
      weeknum = Math.floor((daynum+day-1)/7) + 1;
      if(weeknum > 52) {
        nYear = new Date(that.getFullYear() + 1,0,1);
        nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
        weeknum = nday < 4 ? 1 : 53;
      }
    }
    else {
      weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
  //};

  }
  //}}}
  ml.date.add = function(that,h,m,s,ms) //time -> time + h + m + s
  //{{{
  {
    if(ms===undefined)
      ms=0;
    var newMs=that.getMilliseconds()+ms;
    //var newS=that.getSeconds()+s+1;
    var newS=that.getSeconds()      +s+newMs/1000;
    var newM=that.getMinutes()      +m+newS /60;
    var newH=that.getHours()        +h+newM /60;
    //new Date(year, month, day, hours, minutes, seconds, milliseconds)
    //setHours(hours, [minutes], [seconds], [millisec])
    that.setHours(newH%24, newM%60, newS%60, newMs%1000);
    that.setUTCDate(that.getUTCDate()+newH/24);
    return that;
  };
  //}}}
  ml.date.getDayBegining=function(date) { 
    var d = new Date(+date);
    var ret = +new Date(d.getFullYear(),d.getMonth(),d.getDate());
    ret += (d.getTimezoneOffset() - new Date(ret).getTimezoneOffset())*60*1000;
    return ret;
  }; 
  ml.date.readable={};
  ml.date.readable.getHours= function(that,twelveClock)
  //{{{
  {
    var ret=that.getHours();

    if(twelveClock) {
      ret %= 12;
      if(ret==0) ret=12;
    }

    if( !twelveClock ){
      ret = ml.date.appendZero(ret);
    }

    return ret;
  };
  //}}}
  ml.date.readable.getMinutes= function(that)
  //{{{
  {
    return ml.date.appendZero(that.getMinutes());
  };
  //}}}
  ml.date.readable.getSeconds= function(that)
  //{{{
  {
    return ml.date.appendZero(that.getSeconds());
  };
  //}}}
  ml.date.readable.getDate= function(that)
  //{{{
  {
    return ml.date.appendZero(that.getDate());
  };
  //}}}
  ml.date.readable.getDay=function(that)
  //{{{
  {
    return weekday[that.getDay()];
  }
  //}}}
  ml.date.readable.getMonth=function(that)
  //{{{
  {
    return month[that.getMonth()];
  }
  //}}}
  ml.date.readable.getTime=function(s,format,digitShift,shiftTodo)
  //{{{
  {
    //random info about epoch
    //1000000000000 ms ~= 31 years
    //1000000000000    ~= Sep 2001
    //1300000000000    -= March 2011
    //10000000000000   -= Nov 2286
    ml.assert(s!==undefined && s.constructor === Number);
    ml.assert(digitShift===undefined || digitShift.constructor===Number);
    ml.assert( shiftTodo===undefined ||  shiftTodo.constructor===Number);
    ml.assert(format==='timer' || format==='time12' ||format==='time12_pretty' || format==='countdown' || format==='data');
    if(format==='time12' || format==='time12_pretty' || format==='data'){
      ml.assert(digitShift===undefined&&shiftTodo===undefined);
      digitShift=0;
      shiftTodo=2;
    }
    else {
      if(digitShift===undefined) digitShift = 1;
      if(shiftTodo ===undefined) shiftTodo  = 0;
    }

    var verbose = format==='timer';
    var cutHead = format==='timer' || format==='countdown';
    var cutTail = verbose;
    var makeAMPM = format==='time12' || format==='time12_pretty';

    //epoch digit length won't change until year 2200
    //13 digit number interpretend as milliseconds correspond to > 30 years
    if(s.toString().length>12)
    {
      ml.assert(format==='time12' || format==='time12_pretty' || format==='data');
      //onsole.log(new Date(s));
      //onsole.log(new Date(new Date(s).getFullYear(),new Date(s).getMonth(),new Date(s).getDate()));
      s = s - ml.date.getDayBegining(s);
      //onsole.log(s);
    }
    if(makeAMPM) {
      var mid_day = 12*60*60*1000;
      var isPm = s>=mid_day;
      if(isPm) s-=mid_day;
    }

    var DEFAULT_PARTITION   = 100;//needed to add trailing zeros
    var DIGITS_PARTITION    = [1000,60,60];
    var DIGITS_ABBREVATION  = ['ms','s','m','h'];

    //=====do shift
    /* failed attempt to determine digitShift (with current input information, it's not possible)
    var MAX_EPOCH_LENGTH = 13;
    var digitShift = 0;
    while((DIGITS_PARTITION.slice(0,digitShift).reverse().concat([1]).reverse().reduce(function(a,b){return a*b})*s).toString().length<MAX_EPOCH_LENGTH && digitShift<=DIGITS_PARTITION.length) digitShift++;
    ml.assert(digitShift<=DIGITS_PARTITION.length);
    */
    digitShift+=shiftTodo;
    ml.assert(digitShift<=DIGITS_PARTITION.length);
    while(shiftTodo--) s /= DIGITS_PARTITION[digitShift-(shiftTodo+1)];
    s=parseInt(s,10);
    DIGITS_PARTITION  .splice(0,digitShift);
    DIGITS_ABBREVATION.splice(0,digitShift);

    //====compute digits
    var d = [];
    for(var i=0;i<DIGITS_PARTITION.length+1;i++)
    {
      var digitValue = s;
      for(var j=i-1;j>=0;j--) digitValue /= DIGITS_PARTITION[j];
      d.push((digitValue % (DIGITS_PARTITION[i] || Infinity))|0);
    }

    if(cutHead) while(d[d.length-1]===0 && d.length>1) d.pop();
    if(makeAMPM) if(d[d.length-1]===0) d[d.length-1]=12;

    if(cutTail)
    {
      var trailCut = d.length;
      while(d[0]===0 && d.length>1) d.shift();
      trailCut -= d.length;
    }

    if(!verbose)
      for(var i=0;i<d.length;i++) d[i]='00'.substring(0,((DIGITS_PARTITION[i] || DEFAULT_PARTITION)-1).toString().length-d[i].toString().length)+d[i];

    if(verbose)
    {
      DIGITS_ABBREVATION.splice(0,trailCut);
      for(var i=0;i<d.length;i++) d[i]+=DIGITS_ABBREVATION[i];
    }

    //onsole.log(d.slice().reverse().join(verbose?' ':':'));
    //onsole.log('');
    d.reverse();
    if(format==='data') return d;
    d = d.join(verbose?' ':':');
    if(makeAMPM) {
      if(format==='time12_pretty'){
        d = d.replace(/:00$/,'').replace(/^0/,'');
      }
      d = d+' '+(isPm?'PM':'AM');
      //ml.assert(digitShift===2); if(d[0]==='0') return d.substring(1);
      return d;
    }
    return d;
  }
  //}}}
})();

ml.element={};
ml.element.getStyle=function(that,styleProp)
//{{{
{
  return document.defaultView.getComputedStyle(that,null).getPropertyValue(styleProp);
};
//}}}
ml.element.getPosition=function(that)
//{{{
{
  var curleft = 0;
  var curtop  = 0;
  var e=that;
  do
  {
    curleft += e.offsetLeft;
    curtop += e.offsetTop;
  } while (e = e.offsetParent);
  return {x: curleft, y: curtop};
};
//}}}

ml.showBrowserHint=function(name,additionalText)
//{{{
{
  var browserDetect = {
  //{{{
    init: function () {
      //this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
      this.browser = this.searchString(this.dataBrowser);
      this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        ;//|| "an unknown version";
      //this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
      for (var i=0;i<data.length;i++)	{
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) != -1)
            return data[i].identity;
        }
        else if (dataProp)
          return data[i].identity;
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
      },
      { 	string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      },
      {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      },
      {
        prop: window.opera,
        identity: "Opera"
      },
      {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
      },
      {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
      },
      {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
      },
      {		// for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
      },
      {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      },
      {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      },
      { 		// for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }
    ],
    dataOS : [
      {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
      },
      {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
      },
      {
           string: navigator.userAgent,
           subString: "iPhone",
           identity: "iPhone/iPod"
        },
      {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
      }
    ]
  };
  //}}}

  browserDetect.init();

  var str="<div style='padding: 30px'>";
  var instruction='in order to use '+name+' download the latest version of your browser at <a target="_blank" href=';
  if(browserDetect.browser)
  {
    var browser=browserDetect.browser;
    if(browser==='Chrome')
    {
      browser='Google Chrome';
      instruction+="'https://www.google.com/chrome/'>www.google.com/chrome</a>";
    }
    else if(browser==='Firefox')
    {
      instruction+="'https://www.mozilla.com/firefox/'>www.mozilla.com/firefox</a>";
    }
    else if(browser==='Safari')
    {
      instruction+="'https://www.apple.com/safari/download/'>www.apple.com/safari/download</a>";
    }
    else if(browser==='Explorer')
    {
      browser='Internet Explorer';
      instruction="in order to use "+name+" install the Google Chrome Frame plug-in at <a target='_blank' href='https://code.google.com/chrome/chromeframe/'>https://code.google.com/chrome/chromeframe</a>";
    }
    else
      instruction=null;


    str+="you are using the browser "+browser;
    if(browserDetect.version)
      str+=" "+browserDetect.version;
    str+="<br><br>";
    if(instruction)
      str+=instruction+'.<br><br>';
  }
  str+=name+" supports following browsers:<br> \
    <ul> \
      <li><b>Internet Explorer</b> with the <b>Google Chrome Frame</b> plug-in</li> \
      <li><b>Firefox 3.5</b> or higher</li> \
      <li><b>Safari 5</b> or higher</li> \
      <li><b>Google Chrome 4</b> or higher</li> \
    </ul> \
    ";

  if(additionalText) str+='<br>'+additionalText;

  str+="</div>";

  document.body.innerHTML=str;
}
//}}}

if(typeof window !== "undefined" && window['co'+'nsole']){
  window['co'+'nsole'].print=function(obj) //nice print for objects
  //{{{
  {
    //return JSON.stringify(obj);
    window['co'+'nsole'].log(JSON.stringify(obj));
    /*
    function to_str(foo)
    {
      if(foo===undefined)
        return 'undefined';
      if(foo.constructor===Object)
      {
        var str='';
        for(key in foo)
          str+=','+key+':'+to_str(foo[key]);
        str = '{'+str.substring(1)+'}';
        return str;
      }
      return foo.toString();
    }
    if(window['co'+'nsole'] && window['co'+'nsole'].log)
      window['co'+'nsole'].log(to_str(obj));
    */
  };
  //}}}
  window['co'+'nsole'].printStack=function()
  //{{{
  {
    if(window['co'+'nsole'] && window['co'+'nsole'].log)
    {
      //http://stackoverflow.com/questions/2060272/while-debugging-javascript-is-there-a-way-to-alert-current-call-stack
      window['co'+'nsole'].log(new Error().stack);
      /*
      try{wontwork}
      catch(e){
        window['co'+'nsole'].log(e.stack);
        return e.stack;
        }
        */
    }
  };
  //}}}
}
ml.assert=function(bool,msg,skipCallFcts,api_error){ 
//works properly in webkit only
  if(typeof window === "undefined") return;
  if(!bool)
  {
    var errorStack = new Error().stack;
    var errorStr = (function()
    {
      if(!skipCallFcts) skipCallFcts=0;
      skipCallFcts++;
    //var fct=arguments.callee;
      if(ml.browser().usesGecko && window['co'+'nsole'] && window['co'+'nsole'].log) window['co'+'nsole'].log(errorStack);
      if(errorStack)
      {
        do
        {
          errorStack = errorStack.replace(/.*[\s\S]/,'');
        //fct=fct.caller;
        }while(skipCallFcts--)
        var fctLine = /[^\/]*$/.exec(errorStack.split('\n')[0]).toString().replace(/\:[^\:]*$/,'');
        //return 'assertion fail at '+scriptSource+':'+(fct.name?fct.name:'(anonymous)')+':'+/[^:]*(?=:(?!.*:.*))/.exec(fctLine);
      }
      return 'assertion fail at '+fctLine;
    })();
    if(msg!==undefined) errorStr+=' ('+(msg.join&&msg.join(',')||msg)+')';
    if(api_error)
    {
      throw errorStr;
    //return;//returns anyways since throw
    }
    var HARD=window.location.hostname==='localhost';
    if(window.navigator.userAgent.indexOf('MSIE')!==-1) return; //fix for stupid IE9 bug: window['co'+'nsole'].log is defined but shoudn't be called
    if(window['co'+'nsole'] && window['co'+'nsole'].log && !HARD)
    {
      window['co'+'nsole'].log(errorStr);
      //if(cwindow['co'+'nsole']onsole['assert']) window['co'+'nsole']['assert'](false);
    }
    for(var i=3;i<arguments.length;i++)
    {
      if(window['co'+'nsole'] && window['co'+'nsole'].log) window['co'+'nsole'].log(arguments[i]);
      else errorStr += arguments[i]+'\n';
    }
    if(HARD) window.alert(errorStr+'\n'+errorStack);
    if(HARD) throw(errorStr);
  }
/*
var scriptSource =
//{{{
  //source:
    // http://stackoverflow.com/questions/984510/what-is-my-script-src-url
    // http://stackoverflow.com/questions/1865914/can-javascript-file-get-its-ows-name
(function() 
{
    var scripts = document.getElementsByTagName('script'), 
        script = scripts[scripts.length - 1]; 

    //No need to perform the same test we do for the Fully Qualified
    return script.getAttribute('src', 2); //this works in all browser even in FF/Chrome/Safari
}());
//}}}
*/
}; 

var tact;
var tactFcts=[];
ml.addTactFct=function(fct)
//{{{
{
  tactFcts.push(fct);
  if(!tact)
    tact=window.setInterval(function()
    {
      for(var i in tactFcts)
        (tactFcts[i])();
    },150);
};
//}}}

ml.hash={};
//{{{
//never use location.hash, instead use ml.hash
ml.hash.get=function()
{
  var ret = location.hash.substring(1);
  if(ml.browser().isSafari) ret = ret.replace(/%23/g,'#'); //better: escape #/%23
  return ret;
};
ml.hash.set=function(h)
{
  if(h[0] && h[0]==='#')
    h='#'+h; //leading # will collapse with default # thus adding one
  location.hash=h;
};
ml.hash.isClear=function()
{
  return ml.hash.get()==='';
};
ml.hash.clear=function() //always user hash.clear instead of location.hash='###'
{
  if(scrollY===0 && scrollX===0)
    location.hash='#';
  else
  {
    if(!this.listenerAdded)
    {
      //may not work if other listener clear hash before this listener is called
      ml.addHashListener(function()
      {
        var acHash=ml.hash.get();
        //%23%23 for safari
        if(acHash==='##' || acHash==='%23%23')
        {
          var tmp=[scrollX,scrollY];
          location.hash='#';
          scrollTo(tmp[0],tmp[1]);
        }
      });
      this.listenerAdded=true;
    }
    location.hash='###';
  }
};
//}}}
ml.addHashListener=function(fct,runOnInit)
//{{{
{
  if(window.onhashchange!==undefined)
  {
    //window.onhashchange=function(){
    //  fct();
    //};
    //window.addEventListener('hashchange',fct,false);
    window.addEventListener('hashchange',function(){fct()},false);
  }
  else
  {
    var actualHash=location.hash;
    ml.addTactFct(function()
    {
      if(location.hash!=actualHash)
      {
        actualHash=location.hash;
        fct();
      }
    });
  }
  if(runOnInit) fct();
};
//}}}

ml.getKeyNum=function(ev)
//{{{
{
  //depecrated -- don't use cose keyCode!==charKey
  if(ev.mlKeyCode)
    return ev.mlKeyCode; //mylib keycode -- used when creating keyboard events
	if(window.event) // IE
 		return ev.keyCode;
	if(ev.which) // Netscape/Firefox/Opera
 		return ev.which;
	if(ev.keyCode)
		return ev.keyCode;
};
//}}}
ml.controlKeyPressed=function(ev)
//{{{
{
  return ev.ctrlKey || ev.altKey || ev.metaKey;
};
//}}}


var faviconEl;
ml.changeIcon=function(url)
//{{{
{
  var createNewEl=ml.browser().usesGecko;
  if(!faviconEl || createNewEl)
  {
    var REL = 'icon';
    var REL2 = 'shortcut icon';

    var oldlinks=document.getElementsByTagName('link');
    for(var i=0;i<oldlinks.length;i++)
      if([REL, REL2].includes(oldlinks[i].getAttribute('rel').toLowerCase()))
        document.head.removeChild(oldlinks[i]);

    faviconEl      = document.createElement('link');
    faviconEl.rel  = REL;
    faviconEl.type = 'image/png'; //needed for webkit dynamic favicon
    document.head.appendChild(faviconEl);
  }
  faviconEl.href=url;

  /*
  if(!faviconEl)
  {
  //var REL = 'shortcut icon';
    var REL = 'icon';
    var oldlinks=document.getElementsByTagName('link');
    for(var i=0;i<oldlinks.length;i++)
      if(oldlinks[i].getAttribute('rel').toLowerCase()==REL)
        document.head.removeChild(oldlinks[i]);

    faviconEl      = document.createElement('link');
    faviconEl.rel  = REL;
    faviconEl.type = 'image/png'; //needed for webkit dynamic favicon
    document.head.appendChild(faviconEl);
  }
  faviconEl.href=url;
  */
  /*
  //var REL = 'shortcut icon';
  var REL = 'icon';
  if(!faviconEl)
  {
    var oldlinks=document.getElementsByTagName('link');
    for(var i=0;i<oldlinks.length;i++)
      if(oldlinks[i].getAttribute('rel').toLowerCase()==REL)
        document.head.removeChild(oldlinks[i]);
  }
  else
    {try{document.head.removeChild(faviconEl);}catch(e){}}

  faviconEl      = document.createElement('link');
  faviconEl.rel  = REL;
  faviconEl.href = url;
  faviconEl.type = 'image/png'; //needed for webkit dynamic favicon
  if(!window.stopi) document.head.appendChild(faviconEl);
  //*/
};
//}}}
ml.canvasIcon=function(ctxTsf)
//{{{
{
  var canvas=document.createElement('canvas');
  canvas.height=32;
  canvas.width=32;
  var ctx=canvas.getContext('2d');

  ctx=ctxTsf(ctx);

  ml.changeIcon(canvas.toDataURL());
  //if(firstTime) //chrome bug fix
    //ml.changeIcon(canvas.toDataURL());
}
//}}}
ml.timeIcon = function(scale,color,twelveClock)
//{{{
{
  if(!scale) scale=1;
  if(!color) color='black'
  var d= new Date();
  var canvas=document.createElement('canvas');
  canvas.height=32/scale;
  canvas.width =32/scale;
  var ctx=canvas.getContext('2d');

  ctx.fillStyle=color;
  ctx.font=Math.floor(15/scale)+'pt arial';
  ctx.fillText(ml.date.readable.getHours(d,twelveClock)  ,0,ml.browser().usesGecko?15/scale:14/scale);
  ctx.font=16/scale+'pt arial';
  ctx.fillText(ml.date.readable.getMinutes(d),5/scale,32/scale);

  return canvas.toDataURL();
};
//}}}
/*
ml.doneIcon = function(d,color1,color2)
//{{{
{
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var h=d;
  var w=d;
  canvas.height=h;
  canvas.width=w;
  ctx.clearRect(0,0,w,h);
  //var lingrad=ctx.createLinearGradient(0,0,0,150);
  var lingrad=ctx.createLinearGradient(0,0,0,h);
  lingrad.addColorStop(0, color2);
  lingrad.addColorStop(1, color1);
  ctx.fillStyle = lingrad;

  ctx.beginPath();

  var delta=[w/20,-h/4];

  var p1  =[0,h/2];
  var p2  =[w/10,h/2];
  //var p3  =[w/4,h/2+h/5+h/10];
  var p3 = [w/4,h-h/4];
  var p4  =[w-w/10,0];
  var p5  =[w,0];
  var p6  =[w,h/10];
  var p7  =[w/4,h];
  var p6a =[p7[0]+delta[0]+w/10,p7[1]+delta[1]-h/10];
  var p6b =[p7[0]+w/10,p7[1]-h/10];
  var p8  =[0,h/2+h/10];

  var p3a =[p7[0]-w/10,p7[1]-h/10];
  var p3a =[p3a[0]+w/40,p3a[1]-h/40];
  var p3b =[p3[0]+delta[0],p3[1]+delta[1]];
  //var p3b =[p3a[0]+delta[0]+w/10,p3a[1]+delta[1]-h/10];

  function grad()
  {
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p3a[0],p3a[1]);  
    //ctx.lineTo(p3b[0],p3b[1]);
    //ctx.lineTo(p4[0],p4[1]);
    ctx.quadraticCurveTo(p3b[0],p3b[1],p4[0],p4[1]);
    ctx.lineTo(p5[0],p5[1]);
    ctx.lineTo(p6[0],p6[1]);
    //ctx.lineTo(p6b[0],p6b[1]);
    //ctx.lineTo(p6a[0],p6a[1]);
    //ctx.quadraticCurveTo(p6a[0],p6a[1],p6b[0],p6b[1]);
    ctx.quadraticCurveTo(p6a[0],p6a[1],p7[0],p7[1]); 
    ctx.lineTo(p7[0],p7[1]);
    ctx.lineTo(p8[0],p8[1]);
    ctx.lineTo(p1[0],p1[1]);
  }

  grad();

  ctx.fill();
  //ctx.stroke();

  return canvas.toDataURL();
};
*/
//}}}
/*
ml.getColorImageURL=function(color,scale)
//{{{
{
  if(!scale) scale=1;
  if(!arguments.callee.urls) arguments.callee.urls={};
  var urls = arguments.callee.urls;

  if(!urls[color])
  {
    var canvas=document.createElement('canvas');
    canvas.height=32/scale;
    canvas.width=32/scale;
    var ctx=canvas.getContext('2d');

    ctx.scale(1/scale,1/scale);

    ctx.fillStyle = color;
    ctx.fillRect(0,0,300,150);

    urls[color] = canvas.toDataURL();
  }
  return urls[color];
};
//}}}
*/
/*
ml.timerIcon = function(diff,percent,scale,color)
//{{{
{
  ml.assert(scale===undefined);
  ml.assert(color===undefined);

//var FILL_DONE='#faa';
//var FILL_LEFT='#0f0';
//var FILL_FINISH='red';
//var FILL_STOPW='transparent';

  var FILL_DONE='#aaf';
//var FILL_LEFT='#eee';
  var FILL_LEFT='transparent';
  var FILL_FINISH='#e11';
  var FILL_STOPW=FILL_LEFT;
//FILL_FINISH=FILL_DONE;
//var TEXT_COLOR="#444";
  var TEXT_COLOR="black";
//var TEXT_COLOR="#111";

  var ICON_SIZE = 16;

  if(diff<=0 && percent) return ml.getColorImageURL(Math.abs(diff)%2===0?FILL_FINISH:'transparent',32/ICON_SIZE);
  if(diff<=0) diff=0;
  
  var canvas=document.createElement('canvas');
  canvas.height = ICON_SIZE;
  canvas.width  = ICON_SIZE;
  var ctx=canvas.getContext('2d');

  var hours   = diff/3600|0;
  var minutes = diff/60|0;
  var seconds = diff%60;
  var minutesOnBot=minutes>99;
  if(minutesOnBot)
    minutes = minutes % 60;
  var top=minutesOnBot?hours:minutes;
  var bot=minutesOnBot?minutes:seconds;

  //background
  if(percent!==undefined && percent!==null) { 
    ml.assert(percent<=1 && percent>=0,'percent==='+percent);
    var h=canvas.height;
    var w=canvas.width;

    ctx.fillStyle=FILL_LEFT;
    ctx.fillRect(0,0,w,h);

    ctx.moveTo(w/2,0);
    var borderPos = (2*h+2*w)*percent;
    if(borderPos<=w/2)
      borderPos=[w/2+borderPos,0];
    else
    {
      ctx.lineTo(w,0);   
      if(borderPos<=w/2+h)
        borderPos=[w,borderPos-w/2];
      else
      {
        ctx.lineTo(w,h);
        if(borderPos<=w/2+h+w)
          borderPos=[w-(borderPos-w/2-h),h];
        else
        {
          ctx.lineTo(0,h);
          if(borderPos<=w/2+h+w+h)
            borderPos=[0,h-(borderPos-w/2-h-w)];
          else
          {
            ml.assert(borderPos<=w/2+h+w+h+w/2,percent);
            ctx.lineTo(0,0);
            borderPos=[borderPos-(w/2+h+w+h),0];
          }
        }
      }
    }
    ctx.lineTo(borderPos[0],borderPos[1]);
    ctx.lineTo(w/2,h/2);
    ctx.fillStyle=FILL_DONE;
    //ctx.fillStyle='rgba(255,0,0,1)';
    ctx.fill();
  } 
  else { 
    ctx.fillStyle = FILL_STOPW;
    ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);
  } 

  //text
  ctx.fillStyle=TEXT_COLOR;
  if(top>0) {
    ctx.font='7pt arial';
    ctx.fillText(ml.date.appendZero(top),0,7);
    ctx.font='9pt arial';
    ctx.fillText(ml.date.appendZero(bot),2,16);
 // ctx.font='8pt arial';
 // ctx.fillText(ml.date.appendZero(top),1,8);
 // ctx.font='8pt arial';
 // ctx.fillText(ml.date.appendZero(bot),1,17);
  } else {
    ctx.font='10pt arial';
    ctx.textAlign='center';
    ctx.fillText(bot,
                8+(bot.length===1?1:0),
                12+(ml.browser().usesGecko?1:0));
  }

  return canvas.toDataURL();

  // old code
  //{{{
//====background color with time gradient
//  function getColor()
//  {
//    //G: 255 -> 180
//    //R: 0 -> 255
//    //G: 180 -> 0
//    var green=255;
//    var red=0;
//    var GREEN_STOP = 180;
//    ml.assert(percent<=1,'percent==='+percent);
//    var delta = 255*2*percent;
//    green = Math.max(255-delta,GREEN_STOP);
//    delta -= 255-GREEN_STOP;
//    if(delta>0)
//    {
//      red = Math.min(delta,255);
//      delta -= 255;
//    }
//    if(delta>0)
//    {
//      green = GREEN_STOP-delta;
//      delta -= GREEN_STOP;
//    }
//    ml.assert(delta<=0);
//    return 'rgb('+parseInt(red)+','+parseInt(green)+',0)';
//  }
//  ctx.fillStyle = percent===undefined?getColor():'#00F';
//  ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);

//====icon generation with scaling
//  canvas.height=32/scale;
//  canvas.width=32/scale;
//  ctx.scale(1/scale,1/scale);
//
////ctx.fillStyle=percent===undefined || percent===null?'white':'black';
//  ctx.fillStyle=TEXT_COLOR;
//  if(top>0)
//  {
//    ctx.font='15pt arial';
//    ctx.fillText(ml.date.appendZero(top),0,ml.browser().usesGecko?15:14);
//    ctx.font='16pt arial';
//    ctx.fillText(ml.date.appendZero(bot),5,32);
//  }
//  else
//  {
//    ctx.font='20pt arial';
//    ctx.textAlign='center';
//    ctx.fillText(bot,
//                16+(scale&&bot.length===1?1:0),
//                24+(scale>1);
//  }
    //}}}

};
//}}}
ml.circleIcon = function(imgs,d,offset)
//{{{
{
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
   var h=d;
   canvas.height=h;
   var w=d;
   canvas.width=w;
//    ctx.clearRect(0,0,w,h);
//    var lingrad=ctx.createLinearGradient(0,0,0,150);
//    lingrad.addColorStop(0, '#333');
//    lingrad.addColorStop(1, '#000');
//    ctx.fillStyle = lingrad;
//   // ctx.fillStyle = 'white';
//   // ctx.fillRect(0,0,300,150);

  function makeIconCircle(dim,offset)
  {
    //determine center, radius, perimeter
    var cX=(w-1)/2;
    var cY=(h-1)/2;
    var r=h/2-dim/2; //assume h==w

    for(var i in imgs)
    {
      var angle = 2*Math.PI*i/imgs.length;
      var X=Math.cos(angle)*r -dim/2 + cX + offset[0];
      var Y=Math.sin(angle)*r -dim/2 + cY + offset[1];
      ctx.drawImage(imgs[i],X,Y,dim,dim);
    }
  }

  if(!offset)
    offset=[-4,0];

  var dim = imgs.length>4?d/3
           :imgs.length==1?d
           :d/2;
  makeIconCircle(dim,offset);
  var ret = canvas.toDataURL();
  return ret;
};
//}}}
ml.dooityRandColor = function(gray,n)
//{{{
{
  function undim(color)
  //{{{
  //equivalent to 0.5 alpha with white background
  {
    function do_(n)
    {
      return parseInt(n+(255-n)/2,10);
      //opposite operation: dim
      //return parseInt(n/2,10);
    }
    return [do_(color[0]),do_(color[1]),do_(color[2])];
  }
  //}}}

  function to_str(c)
  //{{{
  {
    return 'rgb('+c[0]+','+c[1]+','+c[2]+')';
  }
  //}}}

  var COLORS=
  [
    [[71,183,230],[181,226,245]],
    [[43,171,51]],
    //[[115,194,255]],
    //[[163,36,36]],
    //[[64,128,64]],
    [[250, 27, 228]],
    //[[31, 210, 255]],
    [[29, 189, 207]],
    [[191, 82, 255]],
    [[174, 82, 255]],
    [[223,45,0]],
    [[237,85,85]] //trailing coma treated as fatal error for google closure
  ]; 

  if(gray)
    COLORS = [[[100,100,100]]];

  var candidates = COLORS.slice(); //one-level deep copy

  function getOne()
  {
    var color1;
    var color2;
    if(candidates.length===0)
      color1 = COLORS[0][0];
    else
    {
      var i=Math.floor(Math.random()*candidates.length);
      //i=3;
      color1 = candidates[i][0];
      color2 = candidates[i][1];
      candidates.splice(i,1);
    }

    if(!color2)
      color2 = undim(color1);

    return [to_str(color1),to_str(color2)];
  }

  if(!n)
    return getOne();
  else
  {
    var ret = [];
    while(n--)
      ret.push(getOne());
    return ret;
  }
}
*/
//}}}

/*
//changes to ml.xhr:
//-reqsCallback doesn't get deleted when executed
ml.webReq=function(url,data,callback,bulkReqsCallback)
//{{{
{
  var req=new XMLHttpRequest();
  var callee = arguments.callee;
  req.onreadystatechange=function()
  {
    if(req.readyState==4)
    {
      //first local
      if(callback) callback(req.responseText);

      //then bulk
      if(bulkReqsCallback)
      {
        bulkReqsCallback.pendingReqs--;
        if(bulkReqsCallback.pendingReqs===0) bulkReqsCallback();
      }

      //then global
      callee.pendingReqs--;
      if(callee.pendingReqs===0) if(callee.reqsCallback) callee.reqsCallback();
    }
  };
  var method='GET';
  if(data=='GET') data=null;
  else if(data) method='POST';
  req.open(method,url,true);
  if(method==='POST') req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  req.send(data);

  if(bulkReqsCallback)
  {
    if(!bulkReqsCallback.pendingReqs) bulkReqsCallback.pendingReqs=0;
    bulkReqsCallback.pendingReqs++;
  }
  if(!callee.pendingReqs) callee.pendingReqs=0;
  callee.pendingReqs++;
};
//}}}
*/

/*
ml.getUrlVars=function()
//{{{
// Read a page's GET URL variables and return them as an associative array.
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        //vars[hash[0]] = hash[1];
        // use of decodeURIComponent: http://stackoverflow.com/questions/747641/what-is-the-difference-between-decodeuricomponent-and-decodeuri
        vars[hash[0]] = window['decodeURIComponent'](hash[1]);
    }
    return vars;
};
//}}}
*/

/*
ml.deleteCookies=function()
//{{{
{
  var c=document.cookie.split(";");
  for(var i=0;i<c.length;i++)
  {
    var e=c[i].indexOf("=");
    var n=e>-1?c[i].substr(0,e):c[i];
    document.cookie=n+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};
//}}}
*/

//offline stuff
(function() {
  var head;
  ml.loadASAP=function(url,onsuccess){
    head = head || document.getElementsByTagName('head')[0];

    var attempts = 0;
    function do_(){
      //using same script el => onerror doesn't get called again in chrome
      var script= document.createElement('script');
          script.src= url;
        //script.type= 'text/javascript';
          script.onerror = function(){
            head.removeChild(script);
            setTimeout(do_,Math.min(Math.pow(2,attempts)*1000,60000));
          };
          //proxy redirects url -> false onsuccess
          //-no way found to catch this
          if(onsuccess) script.onload  = onsuccess;
      attempts++;
      head.appendChild(script);
    }
    do_();
  };
})();

//* use loadASAP instead
ml.loadScript=function(url,onload)
//{{{
{
  const scriptEl = document.createElement('script');
  scriptEl.src= url;
  scriptEl.async = true;
  if(onload) scriptEl.onload = onload;
  document.getElementsByTagName('head')[0].appendChild(scriptEl);
  return scriptEl;
};
//}}}
/*
ml.loadCss=function(url)
//{{{
{
  var link=document.createElement("link")
  link.setAttribute("rel", "stylesheet")
  link.setAttribute("type", "text/css")
  link.setAttribute("href", url)
  document.getElementsByTagName('head')[0].appendChild(link);
};
//}}}
*/
(function(){
  var cssS={};
  ml.addCss=function(content,useCache)
  //{{{
  {
    if(!useCache || !cssS[content])
    {
      var fileref=document.createElement("style");
      fileref.appendChild(document.createTextNode(content));
      fileref.setAttribute("type", "text/css");
      document.getElementsByTagName("head")[0].appendChild(fileref);
      if(useCache) cssS[content]=true;
    }
  };
  //}}}
})();

(function(){
  var browser=null;
  ml.browser=function(){ 
    if(!browser)
    {
      browser={};

      var vendor   = window.navigator.vendor   || "";
      var platform = window.navigator.platform || "";
      var UA       = window.navigator.userAgent.toLowerCase() || "";

      if(UA.indexOf('googlebot')>-1 || UA.indexOf('msnbot')>-1 || UA.indexOf('slurp')>-1)
        browser.isBot=true;
      else if(UA.indexOf("webkit")>-1) //applewebkit instead of webkit?
        browser.usesWebkit=true;
      else if(UA.indexOf('gecko')>-1)
        browser.usesGecko=true;

      if(!/\bchrome\b/.test(UA) && /safari/.test(UA))
        browser.isSafari=true;

      if(/Win/.test(platform))
        browser.isWindows=true;
      else if(/Mac/.test(platform))
        browser.isMac=true;

      if(window['opera']) browser.isOpera=true;

      /* todel
      //typeof window === "undefined" => metro background task
      var vendor   = typeof window !== "undefined" && window.navigator.vendor   || "";
      var platform = typeof window !== "undefined" && window.navigator.platform || "";
      var UA       = typeof window !== "undefined" && window.navigator.userAgent.toLowerCase() || "";

      if(UA.indexOf('googlebot')>-1 || UA.indexOf('msnbot')>-1 || UA.indexOf('slurp')>-1)
        browser.isBot=true;
      else if(UA.indexOf("webkit")>-1) //applewebkit instead of webkit?
        browser.usesWebkit=true;
      else if(UA.indexOf('gecko')>-1)
        browser.usesGecko=true;

      if(!/\bchrome\b/.test(UA) && /safari/.test(UA))
        browser.isSafari=true;

      if(platform === "" || /Win/.test(platform))
        browser.isWindows=true;
      else if(/Mac/.test(platform))
        browser.isMac=true;

      if(typeof window !== "undefined" && window['opera']) browser.isOpera=true;
      */
    }
    return browser;
  //ml.browser={};
  //(function(){ 
  //  var vendor = navigator.vendor || "";
  //  var UA = navigator.userAgent.toLowerCase();
  //
  //  if(UA.indexOf('googlebot')>-1 || UA.indexOf('msnbot')>-1 || UA.indexOf('slurp')>-1)
  //    ml.browser.isBot=true;
  //  else if(UA.indexOf("webkit")>-1) //applewebkit instead of webkit?
  //    ml.browser.usesWebkit=true;
  //  else if(UA.indexOf('gecko')>-1)
  //    ml.browser.usesGecko=true;
  //})(); 
  //(function(){ 
  //  var vendor = navigator.vendor || "";
  //  var UA = navigator.userAgent.toLowerCase();

  //  if(UA.has('googlebot') || UA.has('msnbot') || UA.has('slurp'))
  //    ml.browser.isBot=true;
  //  else if(window.opera !==undefined)
  //    ml.browser.name='opera';
  //  else if(UA.has("webkit")) //applewebkit instead of webkit?
  //  {
  //    ml.browser.usesWebkit=true;
  //    if(UA.has("chrome"))
  //      ml.browser.name='chrome';
  //    else if(vendor.has("Apple Computer, Inc."))
  //      window.safari=true;
  //  }
  //  else if(UA.has('gecko'))
  //  {
  //    ml.browser.usesGecko=true;
  //    //ml.browser.geckoVersion=;
  //    if(UA.has("firefox"))
  //      ml.browser.name='firefox';
  //    else if(UA.has("iceweasel"))
  //      ml.browser.name='iceweasel';
  //  }
  //})(); 
  }; 
})();

ml.escapeHTML=function(html)
//{{{
{
  //Shortest way to escape HTML (even works in non-HTML documents!): new Option(html).innerHTML
  //alternativly create a text node
  return html.replace(/((<)|(>)|(&))/g,function(matchStr,p1,p2,p3,p4){if(p2) return '&lt;'; if(p3) return '&gt;'; if(p4) return '&amp;'});
};
//}}}

//DOM stuff
ml.setLoader=function(canvas,color)
//{{{
{
  ml.assert(canvas && canvas.getContext('2d'));

  var h=parseInt(ml.element.getStyle(canvas,'height'),10) || parseInt(canvas.style.height,10) || canvas.height;
  var w=parseInt(ml.element.getStyle(canvas,'width' ),10) || parseInt(canvas.style.width ,10) || canvas.width ;
  ml.assert(w && h && w===h,'! width===height');
  canvas.height=h;
  canvas.width=w;
  
  var ctx = canvas.getContext('2d');

  var lingrad=ctx.createLinearGradient(0,0,w,h);
  lingrad.addColorStop(0, color?color:'#888');
  lingrad.addColorStop(1, color?color:'#555');
  ctx.strokeStyle = lingrad;

  var lineWidth=w/8;
  ctx.lineWidth=lineWidth;

  function draw(delta)
  {
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    delta = delta/(Math.PI*6);
    var begin = 0-Math.PI/4;
    var end   = Math.PI/2;
    ctx.arc(w/2,h/2,w/2-lineWidth/2,begin+delta,end+delta,false);
    ctx.stroke();
  }

  var delta=0;
  function frame()
  {
    draw(delta++)
    setTimeout(frame,10);
  }
  frame();
};
//}}}
ml.getEventSource=function(ev)
//{{{
{
  var ret=null;

  if(ev.target)
    ret=ev.target;
  else if(ev.srcElement)
    ret=ev.srcElement;

  if(ret.nodeType==3)
    ret=ret.parentNode;

  return ret;
};
//}}}
ml.isChildOf=function(child,parent_)
//{{{
{
  ml.assert(child.parentElement!==undefined);
  do{if(child===parent_)return true}while(child=child.parentElement)
  return false;
};
//}}}
ml.getChar=function(event)
//{{{
{
  if(event.type === 'keypress')
  //{{{
  {
    //charCode seem to correspond to ascii -- http://www.asciitable.com/
    var map=
    {
      10 :'enter', //ctrl+enter
      13 :'enter',

      32 :' '    ,
      37 :'left' , 
      38 :'up'   , 
      39 :'right', 
      40 :'down' , 
      43 :'+'    ,
      45 :'-'    ,
      47 :'/'    ,

      48 :'0'    ,
      49 :'1'    ,
      50 :'2'    ,
      51 :'3'    ,
      52 :'4'    ,
      53 :'5'    ,
      54 :'6'    ,
      55 :'7'    ,
      56 :'8'    ,
      57 :'9'    ,

      63 :'?'    ,

      65 :'A'    ,
      66 :'B'    ,
      67 :'C'    ,
      68 :'D'    ,
      69 :'E'    ,
      70 :'F'    ,
      71 :'G'    ,
      72 :'H'    ,
      73 :'I'    ,
      74 :'J'    ,
      75 :'K'    ,
      76 :'L'    ,
      77 :'M'    ,
      78 :'N'    ,
      79 :'O'    ,
      80 :'P'    ,
      81 :'Q'    ,
      82 :'R'    ,
      83 :'S'    ,
      84 :'T'    ,
      85 :'U'    ,
      86 :'V'    ,
      87 :'W'    ,
      88 :'X'    ,
      89 :'Y'    ,
      90 :'Z'    ,

      97 :'a'    ,
      98 :'b'    ,
      99 :'c'    ,
      100:'d'    ,
      101:'e'    ,
      102:'f'    ,
      103:'g'    ,
      104:'h'    ,
      105:'i'    ,
      106:'j'    ,
      107:'k'    ,
      108:'l'    ,
      109:'m'    ,
      110:'n'    ,
      111:'o'    ,
      112:'p'    ,
      113:'q'    ,
      114:'r'    ,
      115:'s'    ,
      116:'t'    ,
      117:'u'    ,
      118:'v'    ,
      119:'w'    ,
      120:'x'    ,
      121:'y'    ,
      122:'z'    ,


      666:'comma dummy'
    };
    if(event.mlKeyCode) return map[event.mlKeyCode];
    if(event.charCode===0)
    {
      //firefox sets charCode===0 && keyCode===13 on enter press
      //ml.assert(event.keyCode,event); uncomment this since windows keypress triggers an event with keyCode===0 && charCode===0
      return map[event.keyCode];
    }
    ml.assert(event.charCode);
    return map[event.charCode];
  }
  //}}}
  else if(event.type === 'keydown' || event.type === 'keyup' || event.type === 'change')
  //{{{
  {
    //keyCode seem to correspond to http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
    var map=
    {
      13 :'enter',
      27 :'esc'  , 
      32 :' '    , 
      37 :'left' , 
      38 :'up'   , 
      39 :'right', 
      40 :'down' , 

      48 :'0'    ,
      49 :'1'    ,
      50 :'2'    ,
      51 :'3'    ,
      52 :'4'    ,
      53 :'5'    ,
      54 :'6'    ,
      55 :'7'    ,
      56 :'8'    ,
      57 :'9'    ,

      65 :'a'    ,
      66 :'b'    ,
      67 :'c'    ,
      68 :'d'    ,
      69 :'e'    ,
      70 :'f'    ,
      71 :'g'    ,
      72 :'h'    ,
      73 :'i'    ,
      74 :'j'    ,
      75 :'k'    ,
      76 :'l'    ,
      77 :'m'    ,
      78 :'n'    ,
      79 :'o'    ,
      80 :'p'    ,
      81 :'q'    ,
      82 :'r'    ,
      83 :'s'    ,
      84 :'t'    ,
      85 :'u'    ,
      86 :'v'    ,
      87 :'w'    ,
      88 :'x'    ,
      89 :'y'    ,
      90 :'z'    ,

      //numpad numbers
      96 :'0'    ,
      97 :'1'    ,
      98 :'2'    ,
      99 :'3'    ,
      100:'4'    ,
      101:'5'    ,
      102:'6'    ,
      103:'7'    ,
      104:'8'    ,
      105:'9'    ,

      187:'+'    ,
      189:'-'    ,

      666:'comma dummy'
    };
    if(event.mlKeyCode) return map[event.mlKeyCode];
    return map[event.keyCode];
  }
  //}}}
  else ml.assert(false);
};
//}}}
ml.reqFrame=(function(){ 
  function f(fct){fct()}
  if(typeof window === "undefined") return f;
  var lastReq={};
  var req    =       window['requestAnimationFrame'] ||       window['webkitRequestAnimationFrame'] ||       window['mozRequestAnimationFrame'] ||       window['msRequestAnimationFrame'];
  var cancel = window['cancelRequestAnimationFrame'] || window['webkitCancelRequestAnimationFrame'] || window['mozCancelRequestAnimationFrame'] || window['msCancelRequestAnimationFrame'];
//if(!req || !cancel) return function(fct){fct()};
  if(!req || !cancel) return f;
  return function(fct)
  {
    //lastReq[fct]===lastReq[fct.toString()]
    if(lastReq[fct]) cancel(lastReq[fct]);
    //cpu
    lastReq[fct]=req(fct);
  };
})(); 
/*
ml.safe_call=function(fct){ 
  if(!fct) return;
  if(fct.constructor===Array)
  {
    if(fct.filter) fct=fct.filter(function(f){return !!f});//V8 bugfix
    for(var i=0;i<fct.length;i++)
    {
      var args = Array().slice.call(arguments);
      Array().splice.call(args,0,1,fct[i]);
      arguments.callee.apply(null,args);
    }
    return;
  }
  if(window.location.hostname==='localhost')
    fct.apply(null,Array().slice.call(arguments,1));
  else try{
    fct.apply(null,Array().slice.call(arguments,1));
  }catch(e){ml.assert(false,e)}
}; 
*/

//features
ml.pStore={};
(function(){
  if(typeof window === "undefined") return;//=> called as metro background task
  var __addExtBeforeListener;
  //to avoid infinite loops:
  //-do not directly use localStorage while using ml.pStore
  //-do not initiate window.location.reload on ext change
  //-(no way found to implement check for these both rules -- onbeforeunload->alert doesn't work)
  (function(){ 
    var CS = window['chrome']&&window['chrome']['storage'];

    var TS_KEY = '_ml_ts';
    function ts2str(_tsS) { ml.assert(_tsS.constructor===Array);return JSON.stringify(_tsS); }
    function str2ts(str) {
      ml.assert(str===undefined||str===null||str.constructor===String);
      var _tsS = str?JSON.parse(str):[];
      ml.assert(_tsS&&_tsS.constructor===Array&&[true].concat(_tsS.map(function(ts){return ts.constructor===Number&&ts>1340000000000})).reduce(function(b1,b2){return b1&&b2}));
      return _tsS;
    }
    function getFork(a1,a2)
    {
      var i;
      for(i=0;i<a1.length;i++) if(a1[i]!==a2[i]) break;
      return [a1.slice(i),a2.slice(i)];
    }

    var tsS=str2ts(localStorage.getItem(TS_KEY));

    var __extBeforeListners=[];
    __addExtBeforeListener=function(f){__extBeforeListners.push(f)};
    function callExtListeners(){
        setForbidden+=9;setTimeout(function(){setForbidden-=9},0);
        __extBeforeListners.forEach(function(e){e()});
        if(ml.pStore.onExtChange) ml.pStore.onExtChange();
    }

    if(CS) {
      var timeoutId=0;
      var CS_LS_sync=function(){window.clearInterval(timeoutId);timeoutId=setTimeout(function(){CS['sync']['get'](null,function(newLocalStorage){ 
      //assuming that when offline sync.get returns local values
        var cs_ts = str2ts(newLocalStorage[TS_KEY]);
        var ls_ts = str2ts(localStorage.getItem(TS_KEY));
        var fork = getFork(cs_ts,ls_ts);
        if(fork[0].length===0 && fork[1].length===0)return;
        if(fork[0].length>fork[1].length) {
          //CS to LS
          for(var i in newLocalStorage) ml.assert(newLocalStorage[i].constructor===String);
          for(var i in localStorage)    if(newLocalStorage[i]===undefined) localStorage.removeItem(i);
          for(var i in newLocalStorage) if(i!==TS_KEY) localStorage.setItem(i,newLocalStorage[i]);
          tsS = cs_ts;
          localStorage.setItem(TS_KEY       ,newLocalStorage[TS_KEY]);
          callExtListeners();
        }
        else {
          //LS to CS
          var arg = {};
          for(var i in localStorage) arg[i]=localStorage.getItem(i);
          //onsole.log(1);
          CS['sync']['clear']();
          CS['sync']['set'](arg);
          //setTimeout(function(){onsole.log(2)},0);
        }
      })},300)}; 
    }

    ml.pStore.get=function(key){
      ml.assert(key.constructor===String);
      return localStorage.getItem(key);
    };
    //-only way of having infinite loop is by calling pStore.set when Ext Listener called -- as long as ts doesn't increase no infinite loop possible
    var setForbidden=0;
    window.addEventListener('load'  ,function(){setTimeout(function(){setForbidden++},0)});
    ['click','change'].forEach(function(ev){window.addEventListener(ev,function(){setForbidden--;setTimeout(function(){setForbidden++},0)},true)});
    function set(action)
    {
      function ex(b){var msg="pStore.set call only allowed in a window.onload, window.onclick, or window.onchange call";ml.assert(b,msg,3);if(!b) throw msg}
      ex(setForbidden<=0);
      //shortcomings of following 2 lines:
      //-strict mode doesn't allow caller
      //-new Error().stack.split('\n')<=11
      //ex(/\s*at\s(HTML|window\.onload)/.test(new Error().stack.split('\n').reverse()[0]));
      //for(var caller = arguments.callee;caller=caller.caller;) ex(onExtChange.concat([window.setTimeout,window.setInterval]).indexOf(caller)===-1);

      action();

      tsS.push(+new Date());
      localStorage.setItem(TS_KEY,ts2str(tsS));
      CS&&CS_LS_sync();
    }
    ml.pStore.set=function(key,str){
      ml.assert(key.constructor===String && str.constructor===String);
      set(function(){localStorage.setItem(key,str)});
    };
    ml.pStore.clear=function(){
      set(function(){
        localStorage.clear()
      });
    };

    window.addEventListener('storage',function(){
      var ls_ts = str2ts(localStorage.getItem(TS_KEY));
      if(tsS.length!==ls_ts.length || tsS[tsS.length-1]!==ls_ts[ls_ts.length-1]) {
        tsS=ls_ts;
        callExtListeners();
      }
    });
    CS&&CS['onChanged']['addListener'](CS_LS_sync);
    CS&&CS['onChanged']['addListener'](function(){/*onsole.log(1.5);*/CS_LS_sync()});
    CS&&CS_LS_sync();
  })(); 
  (function(){
    var constructorCallForbiden;
    window.addEventListener('load',function(){setTimeout(function(){constructorCallForbiden=true},0)});
    ml.PersistantObject=function(key,initial_value)
    //{{{
    //put won't actualize other variables with same key -> use only one variable for each key
    {
      ml.assert(!constructorCallForbiden);
      //every constructor call adds a Listener -> do not create too much / temporary PersistantObjects
      if(constructorCallForbiden) throw "ml.PersistantObject call only allowed in window.onload call";
      ml.assert(!initial_value);

      function getStorageValue() {
        var res = ml.pStore.get(key);
        res = res&&JSON.parse(res) || {};
        ml.assert(res.constructor===Object);
        return res;
      }
      var ret = getStorageValue();

      //JSON.stringify ignores put and keys functions
      //google closure trick works:
      //-http://closure-compiler.appspot.com/home
      //-var o={};Object.defineProperty(o,Object.keys({puthe:true})[0],{value:'hey'});alert(o.puthe);
      Object.defineProperty(ret,Object.keys({put :true}),{value:function(){ml.pStore.set(key,JSON.stringify(ret))}});
      /*
      Object.defineProperty(ret,Object.keys({keys:true}),{value:function(){
        var res = {};
      //for(var prop in ret) if(ret[prop] !== ret.put && ret[prop] !== ret.keys) res[prop]=true;
        for(var prop in ret) res[prop]=true;
        return res;
      }});
      */

      //this listener should be called before any other relevant listener
      //-not necessarily the case, if problems: make a privat ext event fired before public ext event
      function moveWithReferences(newObj,obj) {
      //doesn't keep Array references
        ml.assert(obj instanceof Object && newObj instanceof Object);
        for(var i in obj) if(!newObj[i]) delete obj[i];
        for(var i in newObj)
        {
          if(!(obj[i] instanceof Array) && !(newObj[i] instanceof Array) &&
               obj[i] instanceof Object &&   newObj[i] instanceof Object) moveWithReferences(newObj[i],obj[i]);
          else obj[i]=newObj[i];
        }
      }
      //change data first then call ext listener
      __addExtBeforeListener(function(){
        moveWithReferences(getStorageValue(),ret);
      });

      return ret;
    };
    //}}}
  })();
})();
//}}}
// todo replace persistantInput
/*
ml.optionInput=function(optionId,default_,listener,opts){
  //possibleValues,keyUpDelay,noFirstListenerCall,storageObject
  ml.assert(default_!==undefined);

  var isListInput,
      isBinaryInput,
      isColorInput,
      isTextInput;
  if(opts&&opts.possibleValues)
    isListInput=true;
  else if(default_===true||default_===false)
    isBinaryInput =true;
  else if(default_.constructor===String&&default_[0]==='#')
    isColorInput  =true;
  else if(default_.constructor===String)
    isTextInput   =true;

  var el = document.createElement(isListInput?'select':'input');
  el.id=optionId;
  return  el;
//
////{{{
////convention:
////-inputEl.id === id for localStorage
////-default_===0 || default_===1 => checkbox input
//{
////ml.assert(false,'replace localstorage with pStore');
//  ml.assert(id!="key");
//  if(default_===undefined || default_===null) default_='';
//  var inputEl = document.getElementById(id);
//  if(window.localStorage!==undefined)
//  {
//    if(!ml.persistantInput.chromeBugFixed)
//      //{{{
//    //fix for stupid chrome bug: if value is equal to '' then when browser restarts the value become undefined
//      (function()
//      {
//        if(!window.localStorage['key']) return;
//        var keys={};
//        for(var i=0;i<window.localStorage.length;i++) keys[window.localStorage['key'](i)]=true;
//        for(var key in keys) if(!window.localStorage[key]) window.localStorage[key]='';
//        ml.persistantInput.chromeBugFixed=true;
//      })();
//      //}}}
//
//    var binaryInput = default_===false || default_===true;
//    
//    var val = window.localStorage.getItem(id)!==null?window.localStorage[id]:default_;//opera's hasOwnProperty allways return true
//    if(binaryInput) val=!!val;
//    ml.assert(binaryInput === (inputEl.type==='checkbox'));
//    if(inputEl.nodeName==='SELECT' && inputEl.childNodes.length===0) inputEl.innerHTML='<option>'+val+'</option>';
//    inputEl[binaryInput?'checked':'value']=val;
//    if(listener && !noFirstListenerCall) listener(val);
//
//    var lastTimeout;
//    var changeListener=function(){
//      if(lastTimeout) window.clearTimeout(lastTimeout);
//      lastTimeout=window.setTimeout(function()
//      {
//        var newVal = binaryInput?(inputEl['checked']?"true":""):inputEl['value'];
//        if(window.localStorage[id]!=newVal)
//        {
//          window.localStorage[id]=newVal;
//          if(listener) listener(binaryInput?!!newVal:newVal);
//        }
//      },keyUpDelay!==undefined?keyUpDelay:(binaryInput?0:1000));
//    }
//    var addChangeListener = binaryInput ||  inputEl.type.toLowerCase()==='color' || inputEl.nodeName==='SELECT';
//    if( addChangeListener)                                inputEl.addEventListener('change',changeListener,false);
//    if(!addChangeListener || inputEl.nodeName==='SELECT') inputEl.addEventListener('keyup' ,changeListener,false);
//  }
//  else
//  {
//    inputEl.parentNode.removeChild(inputEl);
//    if(!noFirstListenerCall) listener(default_);
//  }
//};
////}}}
//
}
*/

ml.zoomable_element=function({containerEl, scaleEl, zoomEl, keybinding, bottomElements})
//{{{
{
  /*
  const DEBUG = 1;
  /*/
  const DEBUG = 0;
  //*/

  scaleEl = scaleEl || document.documentElement;

  DEBUG && console.log('zoom', {zoomEl, scaleEl, containerEl});

  assert(containerEl && scaleEl && zoomEl);

  const el = zoomEl;

  function fullscreenZoomableElement(el)
  //{{{
  //TODO
  //-listen change to: element size change + window size change
  // -just add resize listener and onDiffChange listener
  //-listen to counter changing position (happens when using arrow keys to change countdown)
  //-fallback in case no transition&transform
  {

    var TRANSITION_DURATION = 600;
    var prefixes=['-webkit-','-moz-','-ms-','-o-',''];
    //in firefox: document.createElement('div').style['-moz-transition']!==document.createElement('div').style['MozTransition'];
    var omPrefixes=['WebkitT','MozT','msT','OT','t'];//reference: modernizr

    //test if browser support required features
    var rightPre;
    for(var i=0;i<omPrefixes.length;i++)
    {
      var pre=omPrefixes[i];
      if(scaleEl.style[pre+'ransition']==='' && scaleEl.style[pre+'ransform']==='') {
        scaleEl.style[pre+'ransition']=prefixes[i]+'transform '+(TRANSITION_DURATION/1000)+'s ease-in-out';
        if(scaleEl.style[pre+'ransition']) rightPre=pre;
      }
    }
    if(!rightPre) return false;

    var zoomed;
    var container_original_props;
    function zoomIn()
    {
      function boxSize(el){
        function getSize(prop){return parseInt(ml.element.getStyle(el,prop),10)||0}
        var h=getSize('height');
        var w=getSize('width');
        //gecko's computed values ignores box-sizing:border-box
        var isBorderBox = !ml.browser().usesGecko && ['-webkit-','-moz-','-ms-','-o',''].reduce(function(p1,p2){return ml.element.getStyle(el,p1+'box-sizing')||ml.element.getStyle(el,p2+'box-sizing')})==='border-box';
        function getTotal(d){return d.map(function(di){
          const paddingSize = getSize('padding-'+di);
          const borderSize = getSize('border-'+di);
          //*
          const marginSize = 0;
          /*/
          const marginSize = getSize('margin-'+di);
          //*/
          return (isBorderBox?0:(paddingSize+borderSize))+marginSize;
        }).reduce(function(i1,i2){return i1+i2}) }
        h+=getTotal(['top','bottom']);
        w+=getTotal(['left','right']);
        return {height:h,width:w};
      }

      // Contain overflowing of zooming element
      container_original_props = {
        overflow: containerEl.style.overflow,
        width: containerEl.style.width,
        height: containerEl.style.height,
      };
      const container_width = ml.element.getStyle(containerEl, 'width');
      const container_height = ml.element.getStyle(containerEl, 'height');
      container_original_props = containerEl.style['overflow'];
      /*
      containerEl.style.width = container_width;
      containerEl.style.height = container_height;
      */
      containerEl.style.overflow = 'hidden';

      var sizes = boxSize(el);
      var elWidth   = sizes.width;
      var elHeight  = sizes.height;
      var botPad    = !bottomElements?0:bottomElements.map(function(el){return boxSize(el).height}).reduce(function(i1,i2){return i1+i2});
      var elPos     = ml.element.getPosition(el);

      // make elPos relative to scaleEl
      elPos.x -= ml.element.getPosition(scaleEl).x
      elPos.y -= ml.element.getPosition(scaleEl).y;

      //crop top padding
      var elPadTop  = parseInt(ml.element.getStyle(el,'padding-top'),10);
      elPos.y += elPadTop;
      elHeight-= elPadTop;

      var winWidth  = window.innerWidth;
      var winHeight = window.innerHeight;
      var viewWidth  = elWidth;
      var viewHeight = elHeight+botPad;
      DEBUG && console.log('zoom', {elWidth, elHeight, botPad, el});

      var scale = Math.min(winHeight/viewHeight,winWidth/viewWidth);
      var offset_to_middle = [winWidth-2*(elPos.x+viewWidth/2),winHeight-2*(elPos.y+viewHeight/2)];
      var scale_offset = scale/2; //divide by 2 because scale crops top overflow

      DEBUG && console.log('zoom', {scale_offset, offset_to_middle});
      var translation = scale_offset*offset_to_middle[0]+'px,'+scale_offset*offset_to_middle[1]+'px';
      DEBUG && console.log('zoom', {translation, scale});
      scaleEl.style[rightPre+'ransform']='translate('+translation+') scale('+scale+')';
      zoomed=true;

      /*
      overflow_orginial = scaleEl.style['overflow'];
      scaleEl.style['overflow']='hidden';
      var elWidth   = parseInt(ml.element.getStyle(el,'width')       ,10);
      var elHeight  = parseInt(ml.element.getStyle(el,'height')      ,10);
      var botPad    = bottomElements.map(function(el){return parseInt(ml.element.getStyle(el,'height'),10)||0}).reduce(function(i1,i2){return i1+i2});
      var elPos     = ml.element.getPosition(el);
      //gecko doesn't consider border box sizing
      if(ml.browser().usesGecko||['-webkit-','-moz-','-ms-','-o',''].reduce(function(p1,p2){return ml.element.getStyle(el,p1+'box-sizing')||ml.element.getStyle(el,p2+'box-sizing')})!=='border-box') {
        //adjust pos
        elPos.y+=parseInt(ml.element.getStyle(el,'padding-top'),10);
        //side paddings added to the fullscreen view
        elWidth+=parseInt(ml.element.getStyle(el,'padding-left'),10)+parseInt(ml.element.getStyle(el,'padding-right'),10);
      }
      else{
        //adjust pos
        elPos.y+=parseInt(ml.element.getStyle(el,'padding-top'),10);
        //top padding croped in fullscreen view
        elHeight-=parseInt(ml.element.getStyle(el,'padding-top'),10);
      }
      var winWidth  = window.innerWidth;
      var winHeight = window.innerHeight;
      var scale = Math.min(winHeight/elHeight,winWidth/elWidth);
      var diff  = Math.min(winHeight-scale*elHeight,scale*botPad);
      var translation = scale*(winWidth/2-(elPos.x+elWidth/2))+'px,'+(scale*(winHeight/2-(elPos.y+elHeight/2))-diff)+'px';
      scaleEl.style[rightPre+'ransform']='translate('+translation+') scale('+scale+')';
      zoomed=true;
      */
    }
    function zoomOut()
    {
      scaleEl.style[rightPre+'ransform']='';
      //timeout makes transition of zoom counter smoother
      setTimeout(function(){
        if(!zoomed) {
          /*
          containerEl.style.overflow = container_original_props.overflow;
          containerEl.style.width = 'auto';
          containerEl.style.height = 'auto';
          */
          /*
          containerEl.style.width = container_original_props.width;
          containerEl.style.height = container_original_props.height;
          */
        }
      }, TRANSITION_DURATION+1);
      zoomed=false;
    }
    return [zoomIn,zoomOut];
  };
  //}}}

  const zoom_fcts = fullscreenZoomableElement(el);;
  if(!zoom_fcts) return;
  const [zoom_in, zoom_out] = zoom_fcts;

  let is_zoomed = false;
  function set_zoom() {
    if( is_zoomed ) {
      zoom_in();
    } else {
      zoom_out();
    }
  }

  el.addEventListener('click', () => {
    is_zoomed = !is_zoomed;
    set_zoom();
  }, {passive: true});

  window.addEventListener('resize', function() { set_zoom(); }, {passive: true});

  return;

  /*
  var fullscreen_toggle;
  var hashListener;
  //{{{
  (function()
  {
    var FULLSCREEN_HASH = 'fullscreen';

    function isFullscreen(){return location.hash==='#'+FULLSCREEN_HASH}
    el.unfullscreen=function(){if(isFullscreen()) location.hash=''};

 // too disruptive
 // function dom_fullscreen_toggle()
 // {
 // // http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+html5rocks+%28HTML5Rocks%29&utm_content=Google+Reader
 // // http://www.thecssninja.com/javascript/fullscreen
 //   if(isFullscreen())
 //   {
 //     if(scaleEl['webkitRequestFullScreen']) scaleEl['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']);
 //     if(scaleEl['mozRequestFullScreen'])    scaleEl['mozRequestFullScreen']();
 //   }
 //   else
 //   {
 //     if(document['webkitCancelFullScreen']) document['webkitCancelFullScreen']();
 //     if(document['mozCancelFullScreen'])    document['mozCancelFullScreen']();
 //   }
 // }

    fullscreen_toggle=function()
    //{{{
    {
      location.hash=isFullscreen()?'':FULLSCREEN_HASH;
    //dom_fullscreen_toggle();
    };
    //}}}

    (function(){
      var isFs;
      var last_isFs;
      hashListener=function(){
        ml.reqFrame(function(){
          if(!last_isFs || last_isFs!=isFs) {
          //dom_fullscreen_toggle();
            last_isFs=isFs;
          }
          if(isFullscreen()) {
            fsFcts[0]();
            isFs=true;
          }
          else {
            //if(location.hash) location.hash='#';
            fsFcts[1]();
            isFs=false;
          }
        });
      }
    })();
  })();
  //}}}

  el.addEventListener('click',fullscreen_toggle,false);
  if(keybinding) window.addEventListener('keydown',function(ev)
  //{{{
  {
    ev = ev || window.event;
    if(ml.controlKeyPressed(ev)) return;
    var targetType = ml.getEventSource(ev).type;
    if(targetType==='text' || targetType==='url') return;
    if(ml.getChar(ev)===keybinding) fullscreen_toggle();
  },false);
  //}}}

  hashListener();
  ml.addHashListener(hashListener);
  window.addEventListener('resize',function() { setTimeout(hashListener,1); },false);
  return hashListener;
  */
};
//}}}

(function(){
  var els={};
  ml.getElementByIdStatic=function(id)
  //{{{
  {
    if(!els[id]) els[id]=document.getElementById(id);
    return els[id];
  };
  //}}}
//window['$']=ml.getElementByIdStatic;
})();

ml.replaceWebApp=function(newUrl) { 
  if(window.parent!==window) return false;
   document.body.innerHTML='';
   var iframe_=document.createElement('iframe');
   iframe_.src=newUrl;
   iframe_.setAttribute('frameborder','0');
   document.documentElement.style['overflow']=document.body.style['overflow']='hidden';
   document.documentElement.style['margin']  =document.body.style['margin']  ='0';
   document.documentElement.style['width']   =document.body.style['width']   =
   document.documentElement.style['height']  =document.body.style['height']  =
                    iframe_.style['height']  =      iframe_.style['width']   ='100%';
   document.body.appendChild(iframe_);
   return true;
}; 

ml.loadAnalytics=function(id) { 
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', id]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
  })();

  window['_gaq']=_gaq;//added by me
}; 

(function(){
  var winObj = typeof Windows !== "undefined" && Windows;
  if(!winObj) return;
  ml.metro={};
  var Noti = winObj['UI']['Notifications'];
  ml.metro.IS_BG_TASK = typeof window === "undefined";
  ml.metro.tile={};
  ml.metro.tile.createText=function(type,line1,line2,line3){ 
    ml.assert(type==='big' || type==='bigCenter');
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
    //var squareTile = Noti['TileUpdateManager']['getTemplateContent'](Noti['TileTemplateType']['tileSquareImage']);
    //var tileAttributes = squareTile.getElementsByTagName("image");
    //tileAttributes[0].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMElEQVRYR+3QQREAAAgCQekfWm3BZ7kCzGb2Ky4OECBAgAABAgQIECBAgAABAm2BA4XeP+FCGziJAAAAAElFTkSuQmCC";

    var node = wideTile.importNode(squareTile.getElementsByTagName("binding").item(0), true);
    wideTile.getElementsByTagName("visual").item(0).appendChild(node);

    return wideTile;
  }; 
  ml.metro.tile.createImg=function(imageFile){ 
  //var template = Noti.TileTemplateType.tileSquareImage;
    var template = Noti.TileTemplateType.tileWideImage;
    var tileXml = Noti.TileUpdateManager.getTemplateContent(template);
    var tileImageAttributes = tileXml.getElementsByTagName("image");
    tileImageAttributes[0].setAttribute("src", imageFile);
    return tileXml;
  }; 
  ml.metro.tile.update=function(newTile,expire_,scheduled){ 
    ml.assert(newTile&&expire_&&expire_.constructor===Date&&(!scheduled||scheduled.constructor===Date));
    var tileNotification = scheduled&&(new Noti['ScheduledTileNotification'](newTile,scheduled)) || (new Noti['TileNotification'](newTile));
    tileNotification['expirationTime'] = expire_;
    Noti['TileUpdateManager']['createTileUpdaterForApplication']()[scheduled?'addToSchedule':'update'](tileNotification);
  }; 
  ml.metro.maintenanceTrigger=function(jsFile,freshnes){ 
    var builder = new winObj['ApplicationModel']['Background']['BackgroundTaskBuilder']();
    builder['name'] = "Maintenance background task";
    builder['taskEntryPoint'] = jsFile;
    //Run every `freshnes` minutes if the device is on AC power
    var trigger = new winObj['ApplicationModel']['Background']['MaintenanceTrigger'](freshnes, false);
    builder['setTrigger'](trigger);
    var task = builder['register']();
  }; 
  ml.metro.storage = winObj['Storage']['ApplicationData']['current']['localSettings']['values'];
  ml.metro.canvas2file=function(canvas,fileName,callback){ 
    //Save blob to image
    var blob = canvas.msToBlob();
    var out = null;
    var blobStream = null;
    var outputStream = null;

    winObj.Storage.ApplicationData.current.localFolder.createFileAsync(fileName, winObj.Storage.CreationCollisionOption.replaceExisting)
        .then(function (file) {
            return file.openAsync(winObj.Storage.FileAccessMode.readWrite);
        })
        .then(function (stream) {
            outputStream = stream;
            out = stream.getOutputStreamAt(0);
            blobStream = blob.msDetachStream();
            return winObj.Storage.Streams.RandomAccessStream.copyAsync(blobStream, out);
        })
        .then(function () {
            return out.flushAsync();
        })
        .done(function () {
            blobStream.close();
            out.close();
            outputStream.close();

            callback("ms-appdata:///local/"+fileName);
        });
  }; 
})();

})(); //warning: don't forget ; after function definition, critical before (function(){})();
