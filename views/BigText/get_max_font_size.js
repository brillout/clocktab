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

function getEstimation(el, outer_width = Infinity, outer_height = Infinity) {
  assert(outer_height >= 0 && outer_width >= 0, { outer_height, outer_width });

  const DUMMY_FONT_SIZE = 100; //intuitively: the bigger the font-size the more precise the approximation

  var dummyContent = el.innerHTML;
  if (dummyContent.length < 1) dummyContent = "y";

  var dummy = getDummy(el.tagName);
  dummy.innerHTML = dummyContent;
  dummy.style.fontFamily = get_computed_style(el, "font-family");
  dummy.style.fontSize = DUMMY_FONT_SIZE + "px";
  dummy.style.whiteSpace = "nowrap"; //should el be equal to get_computed_style('white-space')?
  dummy.style.letterSpacing = get_computed_style(el, "letter-spacing");
  dummy.style.lineHeight = get_computed_style(el, "line-height");

  const dummy_height = parseInt(get_computed_style(dummy, "height"), 10);
  const dummy_width = parseInt(get_computed_style(dummy, "width"), 10);

  const ratio_width = outer_width / dummy_width;
  const ratio_height = outer_height / dummy_height;

  const ratio = Math.min(ratio_width, ratio_height);

  return {
    fontSize: ratio * DUMMY_FONT_SIZE,
    width: ratio * dummy_width,
    height: ratio * dummy_height,
  };
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

function get_computed_style(el, styleProp) {
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
  const val = get_computed_style(el, styleProp);

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
