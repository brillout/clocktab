import assert from "@brillout/assert";

export { get_max_font_size };
export { isPositiveNumber };
export { get_size };

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function get_max_font_size({ dom_el, max_width, max_height }) {
  assert(
    dom_el && isPositiveNumber(max_width) && isPositiveNumber(max_height),
    { max_width, max_height, dom_el }
  );
  const { fontSize, height, width } = getEstimation(
    dom_el,
    max_width,
    max_height
  );

  const log_data = {
    dom_el: dom_el.id,
    height,
    width,
    max_height,
    max_width,
    fontSize,
  };

  const approximation = 1.02;
  assert(
    isPositiveNumber(fontSize) &&
      isPositiveNumber(height) &&
      isPositiveNumber(width) &&
      height <= max_height * approximation &&
      width <= max_width * approximation,
    log_data
  );

  DEBUG && assert.log("[max-font-size-computation]", log_data);

  return { fontSize, height, width, max_height, max_width };
}

// export {adjustFontSize};

function getEstimation(
  el,
  outer_width = Infinity,
  outer_height = Infinity,
  possibleChars,
  minTextLength
) {
  assert(outer_height >= 0 && outer_width >= 0, { outer_height, outer_width });

  const DUMMY_FONT_SIZE = 100; //intuitively: the bigger the font-size the more precise the approximation

  var dummyContent = el.innerHTML;
  if (minTextLength) {
    if (dummyContent.length < minTextLength && minTextLength.length) {
      dummyContent = minTextLength;
    }
  }
  if (dummyContent.length < 1) dummyContent = "y";
  if (possibleChars) {
    //if possibleChars not given we then assume that all char have same width
    assert.warning(el.children.length === 0);
    var widestChar = getWidestChar(possibleChars);
    var dummyTextLength = dummyContent.length;
    dummyContent = "";
    for (var i = 0; i < dummyTextLength; i++) dummyContent += widestChar;
  }

  var dummy = getDummy(el.tagName);
  dummy.innerHTML = dummyContent;
  dummy.style.fontFamily = get_el_style(el, "font-family");
  dummy.style.fontSize = DUMMY_FONT_SIZE + "px";
  dummy.style.whiteSpace = "nowrap"; //should el be equal to get_el_style('white-space')?
  dummy.style.letterSpacing = get_el_style(el, "letter-spacing");
  dummy.style.lineHeight = get_el_style(el, "line-height");

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
  const dummy_height = parseInt(get_el_style(dummy, "height"), 10);
  const dummy_width = parseInt(get_el_style(dummy, "width"), 10);

  /*
  const padding_height = parseInt(get_el_style(el, 'padding-left'), 10) + parseInt(get_el_style(el, 'padding-right') ,10);
  const padding_width  = parseInt(get_el_style(el, 'padding-top' ), 10) + parseInt(get_el_style(el, 'padding-bottom'),10);
  const inner_width  = outer_width  - padding_height;
  const inner_height = outer_height - padding_width;
  console.log({el, padding_width, padding_height});

  const ratio_width  = inner_width  / dummy_width;
  const ratio_height = inner_height / dummy_height;
  */

  const ratio_width = outer_width / dummy_width;
  const ratio_height = outer_height / dummy_height;

  const ratio = Math.min(ratio_width, ratio_height);

  return {
    fontSize: ratio * DUMMY_FONT_SIZE,
    width: ratio * dummy_width,
    height: ratio * dummy_height,
  };
}

var boxSizingPropName = null;
function adjustFontSize(el, possibleChars, noHeight, minTextLength) {
  //using cache -> assumption is made that font familly and box size doesn't change
  //based on assumption that width of a text is approx proportional to its fontSize
  //notes
  //-absolute font-size is equally precise as percentage font-size
  //-possibleChars is used for fonts with variable char width
  var textLength = el.innerHTML.length;
  if (textLength === el._oldTextLength) return;
  el._oldTextLength = textLength;
  if (!el._ml_textSizeRatioCache) el._ml_textSizeRatioCache = {};
  if (el._ml_textSizeRatioCache[textLength])
    return el._ml_textSizeRatioCache[textLength];

  //noHeight computed automatically using getMatchedCSSRules
  //-http://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
  //-but only implemented in webkit: https://bugzilla.mozilla.org/show_bug.cgi?id=438278
  //-gecko polyfill: https://gist.github.com/3033012

  function getSize(el, prop) {
    return parseInt(get_el_style(el, prop) || 0, 10);
  }

  var width = getSize(el, "width");
  var height;
  if (!noHeight) height = getSize(el, "height");

  if (boxSizingPropName === null)
    boxSizingPropName = [
      "box-sizing",
      "-moz-box-sizing",
      "-o-box-sizing",
      "-ms-box-sizing",
      "-webkit-box-sizing",
    ].filter(function (p) {
      return document.createElement("div").style[p] !== undefined;
    })[0];
  if (
    boxSizingPropName &&
    get_el_style(el, boxSizingPropName) === "border-box"
  ) {
    width -=
      getSize(el, "border-left") +
      getSize(el, "border-right") +
      getSize(el, "padding-left") +
      getSize(el, "padding-right");
    if (height)
      height -=
        getSize(el, "border-top") +
        getSize(el, "border-bottom") +
        getSize(el, "padding-top") +
        getSize(el, "padding-bottom");
  }

  el.style.fontSize =
    Math.floor(
      getEstimation(el, width, height, possibleChars, minTextLength).fontSize
    ) + "px";

  assert.warning(
    get_el_style(el, "display") === "block" ||
      get_el_style(el, "display") === "inline-block" ||
      get_el_style(el, "display") === "table-cell",
    "get_el_style(el,'display')==" + get_el_style(el, "display"),
    1
  );

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
}

let dummy_el;
function getDummy(tagName) {
  if (!dummy_el) {
    dummy_el = document.createElement(tagName);
    dummy_el.id = "font-size-dummy";
    dummy_el.style.display = "inline-block";

    dummy_el.style.pointerEvents = "none";
    dummy_el.style.position = "absolute";
    dummy_el.style.top = "0";
    dummy_el.style.left = "0";

    // Create a wrapper to ensure that dummy is not cropped by a `overflow: hidden` ancestor
    // See https://css-tricks.com/popping-hidden-overflow/
    const dummy_wrapper = document.createElement("div");
    dummy_wrapper.style.overflow = "hidden";
    dummy_wrapper.style.position = "absolute";
    dummy_wrapper.style.top = "0";
    dummy_wrapper.style.left = "0";

    if (DEBUG) {
      dummy_el.style.opacity = "0.5";
      dummy_wrapper.style.width = "300px";
      dummy_wrapper.style.height = "300px";
    } else {
      dummy_el.style.visibility = "hidden";
    }

    dummy_wrapper.appendChild(dummy_el);
    document.body.appendChild(dummy_wrapper);
  }
  assert(dummy_el.tagName === tagName);
  return dummy_el;
}

function getWidestChar(chars) {
  var widestChar;
  var widestSize = -1;
  var dummy = document.body.appendChild(getDummy());
  for (var i = 0; i < chars.length; i++) {
    dummy.innerHTML = chars[i];
    var charWidth = parseInt(get_el_style(dummy, "width"), 10);
    if (charWidth > widestSize) {
      widestSize = charWidth;
      widestChar = chars[i];
    }
  }

  document.body.removeChild(dummy);
  assert.warning(widestChar);
  return widestChar;
}

function get_el_style(el, styleProp) {
  return document.defaultView.getComputedStyle(el).getPropertyValue(styleProp);
}

function isPositiveNumber(val) {
  assert(null >= 0, "unexpected");
  return (
    val !== null &&
    (val === 0 || (val && val.constructor === Number && val > 0))
  );
}

function get_size(el, styleProp) {
  assert(el, "[get_size][error]", { styleProp, el });
  const val = document.defaultView
    .getComputedStyle(el)
    .getPropertyValue(styleProp);
  const el_id = el.id;

  // Less safe:
  if (!val) return 0;
  const val__casted = parseInt(val, 10);
  if (!val__casted) return 0;
  assert(isPositiveNumber(val__casted), "[get_size][error]", {
    el_id,
    styleProp,
    val,
    val__casted,
  });
  return val__casted;

  // Safer:
  /*
  assert(val, "[get_size][error]", { el_id, styleProp, val, val__casted });
  const val__casted = parseInt(val, 10);
  assert(isPositiveNumber(val__casted), "[get_size][error]", { el_id, styleProp, val, val__casted });
  return val__casted;
  */
}
