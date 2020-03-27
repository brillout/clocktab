import assert from '@brillout/assert';

export default get_max_font_size;

function get_max_font_size({dom_el, max_width, max_height}) {
  const el = dom_el;
  const w = max_width;
  const h = max_height;

  const {fontSize, height, width} = getEstimation(el,w,h)
  assert(fontSize);
  assert(height);
  assert(width);
  return {fontSize, height, width};
}

// export {adjustFontSize};

function getEstimation(el,width,height,possibleChars,minTextLength){ 
  const DUMMY_SIZE=100;//intuitively: the bigger the font-size the more precise the approximation

  var dummyContent=el.innerHTML;
    if( minTextLength ){
      if( dummyContent.length<minTextLength&&minTextLength.length ) {
        dummyContent=minTextLength;
      }
    }
    if(dummyContent.length<1) dummyContent='y';
    if(possibleChars) //if possibleChars not given we then assume that all char have same width
    {
      assert.warning(el.children.length===0);
      var widestChar = getWidestChar(possibleChars);
      var dummyTextLength = dummyContent.length;
      dummyContent = '';
      for(var i=0;i<dummyTextLength;i++) dummyContent+=widestChar;
    }

  var dummy= getDummy(el.tagName);
    dummy.style.fontFamily=get_el_style(el,'font-family');
    dummy.style.fontSize=DUMMY_SIZE+'px';
    dummy.style.whiteSpace='nowrap';//should el be equal to get_el_style('white-space')?
    dummy.style.letterSpacing=get_el_style(el,'letter-spacing');
    dummy.style.lineHeight=get_el_style(el,'line-height');

  dummy.innerHTML=dummyContent;
  document.body.appendChild(dummy);
  //dummyinspect
  //onsole
  /*
  if(!window.bla)window.bla=0;
  window.bla++;
  var c = window.bla;
  onsole.log('t0');
  onsole.log(c);
  onsole.log(get_el_style(dummy,'font-family'));
  onsole.log(get_el_style(dummy,'width'));
  setTimeout(function(){
  onsole.log('t1');
  onsole.log(c);
  onsole.log(get_el_style(dummy,'font-family'));
  onsole.log(get_el_style(dummy,'width'));
  },0);
  setTimeout(function(){
  onsole.log('t2');
  onsole.log(c);
  onsole.log(get_el_style(dummy,'font-family'));
  onsole.log(get_el_style(dummy,'width'));
  },100);
  setTimeout(function(){
  onsole.log('t3');
  onsole.log(c);
  onsole.log(get_el_style(dummy,'font-family'));
  onsole.log(get_el_style(dummy,'width'));
  },1000);
  setTimeout(function(){
  onsole.log('t4');
  onsole.log(c);
  onsole.log(get_el_style(dummy,'font-family'));
  onsole.log(get_el_style(dummy,'width'));
  },5000);
  */
  var  width_dummy =  width&&parseInt(get_el_style(dummy,'width' ),10);
  var height_dummy = height&&parseInt(get_el_style(dummy,'height'),10);
  var ratio = Math.min(height?(height/height_dummy):Infinity,
                        width?( width/ width_dummy):Infinity);
  return {
    fontSize:ratio*DUMMY_SIZE,
    width:ratio*width_dummy,
    height:ratio*height_dummy,
  };
} 

var boxSizingPropName=null;
function adjustFontSize(el,possibleChars,noHeight,minTextLength) { 
  //using cache -> assumption is made that font familly and box size doesn't change
  //based on assumption that width of a text is approx proportional to its fontSize
  //notes
  //-absolute font-size is equally precise as percentage font-size
  //-possibleChars is used for fonts with variable char width
  var textLength = el.innerHTML.length;
  if(textLength===el._oldTextLength) return;
  el._oldTextLength=textLength;
  if(!el._ml_textSizeRatioCache) el._ml_textSizeRatioCache={};
  if(el._ml_textSizeRatioCache[textLength]) return el._ml_textSizeRatioCache[textLength];

  //noHeight computed automatically using getMatchedCSSRules
  //-http://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
  //-but only implemented in webkit: https://bugzilla.mozilla.org/show_bug.cgi?id=438278
  //-gecko polyfill: https://gist.github.com/3033012

  function getSize(el,prop){return parseInt(get_el_style(el,prop)||0,10)};

  var width  = getSize(el,'width');
  var height;
  if(!noHeight) height = getSize(el,'height');

  if(boxSizingPropName===null) boxSizingPropName = ['box-sizing','-moz-box-sizing','-o-box-sizing','-ms-box-sizing','-webkit-box-sizing']
                                       .filter(function(p){return document.createElement('div').style[p]!==undefined})[0];
  if(boxSizingPropName&&get_el_style(el,boxSizingPropName)==='border-box') {
     width -= getSize(el,'border-left')+getSize(el,'border-right' )+getSize(el,'padding-left')+getSize(el,'padding-right' );
    if(height)
    height -= getSize(el,'border-top' )+getSize(el,'border-bottom')+getSize(el,'padding-top' )+getSize(el,'padding-bottom');
  }

  el.style.fontSize=Math.floor(getEstimation(el,width,height,possibleChars,minTextLength).fontSize)+'px';

  assert.warning(get_el_style(el,'display')==='block' || get_el_style(el,'display')==='inline-block' || get_el_style(el,'display')==='table-cell',"get_el_style(el,'display')=="+get_el_style(el,'display'),1);

  //following assert fails with browser zoom
  //assert.warning(get_el_style(el,'font-size')===el.style.fontSize);

  //good enough without refinment?
  //note: will break minTextLength option
  //******** Refinment ********
  /*
  assert.warning(!minTextLength);
  var max=100;
  assert.warning(width!==0&&height!==0);
  while( get_el_style(el, 'width')<( width||0       ) &&
         get_el_style(el,'height')<(height||0       )  &&--max) el.style.fontSize=parseInt(el.style.fontSize,10)+2+'px';
  while((get_el_style(el, 'width')>( width||Infinity) ||
         get_el_style(el,'height')>(height||Infinity)) &&--max) el.style.fontSize=parseInt(el.style.fontSize,10)-1+'px';
  assert.warning(max>0,'max===0');
  */
}; 

function getDummy(tagName) { 
  var dummy = document.createElement(tagName||'div');
  dummy.style.display='inline-block';
  dummy.style.position='absolute';
  dummy.style.top='0';
  dummy.style.top='-9999px';
  dummy.style.zIndex='-9999';
  dummy.style.visibility='hidden';
  return dummy;
} 

function getWidestChar(chars) { 
  var widestChar;
  var widestSize=-1;
  var dummy = document.body.appendChild(getDummy());
  for(var i=0;i<chars.length;i++) {
    dummy.innerHTML=chars[i];
    var charWidth=parseInt(get_el_style(dummy,'width'),10);
    if(charWidth>widestSize)
    {
      widestSize=charWidth;
      widestChar=chars[i];
    }
  }

  //window.bla=window.bla||0;
  //if(window.bla!==2&&window.bla!==0) document.body.removeChild(dummy);
  //window.bla++;

  //dummyinspect
  //onsole
  // TODO
  document.body.removeChild(dummy);
  assert.warning(widestChar);
  return widestChar;
} 

function get_el_style(el, styleProp) {
  return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
}

