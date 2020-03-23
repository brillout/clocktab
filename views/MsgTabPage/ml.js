(function() {
  if( typeof window === 'undefined' ) {
    return;
  }


const ml = {};



ml.assert=function(bool,msg,skipCallFcts,api_error)
//{{{
//works properly only in webkit
{
  if(!bool)
  {
    var errorStr = (function()
    {
      if(!skipCallFcts) skipCallFcts=0;
      skipCallFcts++;
      var fct=arguments.callee;
      var fctLine = new Error().stack;
      if(ml.browser().usesGecko && window['co'+'snole'] && window['co'+'snole'].log) window['co'+'snole'].log(fctLine);
      if(fctLine)
      {
        var fctLine = fctLine.toString().replace(/.*[\s\S]/,'');
        do
        {
          fctLine = fctLine.replace(/.*[\s\S]/,'');
          fct=fct.caller;
        }while(skipCallFcts--)
        fctLine = /[^\/]*$/.exec(fctLine.split('\n')[0]).toString().replace(/\:[^\:]*$/,'');
        //return 'assertion fail at '+scriptSource+':'+(fct.name?fct.name:'(anonymous)')+':'+/[^:]*(?=:(?!.*:.*))/.exec(fctLine);
      }
      return 'assertion fail at '+fctLine;
    })();
    if(msg!==undefined) errorStr+=': '+msg;
    if(api_error)
    {
      throw errorStr;
      return;
    }
    var hard=window.location.hostname==='localhost';
    //errorStr += '\n' + fctLine;
    if(window.navigator.userAgent.indexOf('MSIE')!==-1) return; //fix for stupid IE9 bug: window['co'+'snole'].log is defined but shoudn't be called
    if(window['co'+'snole'] && window['co'+'snole'].log && !hard)
    {
      window['co'+'snole'].log(errorStr);
      //if(cwindow['co'+'snole']onsole['assert']) window['co'+'snole']['assert'](false);
    }
    for(var i=3;i<arguments.length;i++)
    {
      if(window['co'+'snole'] && window['co'+'snole'].log) window['co'+'snole'].log(arguments[i]);
      else errorStr += arguments[i]+'\n';
    }
    if(hard) window.alert(errorStr);
    if(hard) throw(errorStr);
  }
};
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
//}}}



Element.prototype.hide=function()
//{{{
{
  this.style.visibility='hidden';
};
//}}}
Element.prototype.show=function()
//{{{
{
  this.style.visibility='inherit';
};
//}}}



Element.prototype.getStyle=function(styleProp)
//{{{
{
  return document.defaultView.getComputedStyle(this,null).getPropertyValue(styleProp);
};
//}}}



Element.prototype.getPosition=function()
//{{{
{
  var curleft = 0;
  var curtop  = 0;
  var e=this;
  do
  {
    curleft += e.offsetLeft;
    curtop += e.offsetTop;
  } while (e = e.offsetParent);
  return {x: curleft, y: curtop};
};
//}}}



Element.prototype.setTextSize=function(width,height,noDOMChanges,possibleChars)
//{{{
//assert width & height in px
//assert this.style.display=='inline-block'
{
  //absolute font-size is equally precise as percentage font-size
  //chars can have different widths
  //assumption that width of a text is proportional to its fontSize is wrong but good approx
  ml.assert(this.tagName!=='TEXTAREA');
  /*
  if(width===0||height===0)
  {
    if(noDOMChanges) return {width:0,height:0};
    this.style.fontSize = "0px";
    return;
  }
  */
  ml.assert(width&&height);
  var DUMMY_SIZE=100;//intuitively: the bigger the font-size the more precise the approximation

  var dummy=document.createElement(this.tagName);
    dummy.style.fontSize=DUMMY_SIZE+'px'; //is better approx than percentage since same preciseness
    dummy.style.display='inline-block';
    dummy.style.whiteSpace='nowrap';//should this be equal to this.getStyle('white-space')?
    dummy.style.position='absolute';
    dummy.style.fontFamily=this.getStyle('font-family');
    dummy.style.letterSpacing=this.getStyle('letter-spacing');
    //hide this shit
    dummy.style.top='-9999px';
    dummy.style.zIndex='-1';
    dummy.style.visibility='hidden';

  var worstCaseText=this.innerHTML;
  if(worstCaseText==='') worstCaseText='y';
  else if(possibleChars) //if possibleChars not given we then assume that all char have same width
  {
    ml.assert(this.innerHTML===this.textContent);
    ml.assert(possibleChars.constructor === Array && possibleChars.length>0);
    //determining worst case char
    var widestChar;
    var widestSize=-1;
    document.documentElement.appendChild(dummy);
    for(var i=0;i<possibleChars.length;i++)
    {
      var char_ = possibleChars[i];
      dummy.innerHTML=char_;
      var charWidth=parseInt(dummy.getStyle('width'),10);
      if(charWidth>widestSize)
      {
        widestSize=charWidth;
        widestChar=char_;
      }
    }
    ml.assert(widestChar);
    worstCaseText='';
    for(var i=0;i<this.textContent.length;i++) worstCaseText+=widestChar;
  }

  dummy.innerHTML=worstCaseText;
  document.documentElement.appendChild(dummy);
  var  width_dummy = parseInt(dummy.getStyle('width' ),10);
  var height_dummy = parseInt(dummy.getStyle('height'),10);
  var ratio = Math.min(height/height_dummy,width/width_dummy);
  document.documentElement.removeChild(dummy);

  if(noDOMChanges) return {width:ratio*width_dummy,height:ratio*height_dummy,fontSize:ratio*DUMMY_SIZE};
  this.style.fontSize=Math.floor(ratio*DUMMY_SIZE)+'px';

  //******** Refinment ********
  ml.assert(this.getStyle('display')==='block' || this.getStyle('display')==='inline-block' || this.getStyle('display')==='table-cell',"this.getStyle('display')=="+this.getStyle('display'),1);
  this.hide();
  //==old approx
  //x-height ~=/2 font-size in px ~= height of text -> x-width ~=/2 font-size in px
  //this.style.fontSize=1.3*( Math.min(parseInt(height,10),parseInt(width,10)/countCharacters(this)) )+'px';
  //var max=1000;
  ml.assert(this.getStyle('font-size')===this.style.fontSize);

  //ml.assert(parseInt(this.getStyle('width' ),10)===this.clientWidth);
  //ml.assert(parseInt(this.getStyle('height'),10)===this.clientHeight,"this.getStyle('height')==="+this.getStyle('height')+" && this.clientHeight==="+this.clientHeight+" && this.scrollHeight==="+this.scrollHeight);

  var max=100;

  while( this.getStyle('width')<width && this.getStyle('height')<height  && --max) this.style.fontSize=parseInt(this.style.fontSize,10)+2+'px';
  while((this.getStyle('width')>width || this.getStyle('height')>height) && --max) this.style.fontSize=parseInt(this.style.fontSize,10)-1+'px';
  ml.assert(max>0,'max===0');
  this.show();
};
//}}}
})();
