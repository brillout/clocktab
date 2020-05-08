import assert from "@brillout/assert";
import { track_error } from "../../tab-utils/views/common/tracker";
import { get_browser_info } from "../../tab-utils/utils/get_browser_info";

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

  let dummy_html = el.innerHTML;
  if (dummy_html.length < 1) dummy_html = "y";

  var dummy = getDummy(el.tagName);
  dummy.innerHTML = dummy_html;
  const dummy_text = dummy.textContent;

  if (dummy_text === "") {
    track_error({
      name: "[known_unexpected][get_max_font_size]empty_dummy",
      value: dummy_html,
    });
    return {
      fontSize: 0,
      width: 0,
      height: 0,
    };
  }

  dummy.style.fontFamily = get_computed_style(el, "font-family");
  dummy.style.fontSize = DUMMY_FONT_SIZE + "px";
  dummy.style.whiteSpace = "nowrap"; //should el be equal to get_computed_style('white-space')?
  dummy.style.letterSpacing = get_computed_style(el, "letter-spacing");
  dummy.style.lineHeight = get_computed_style(el, "line-height");

  const dummy_height = get_size(dummy, "height");
  const dummy_width = get_size(dummy, "width");

  assert(dummy_text.length > 0);
  assert(isPositiveNumber(dummy_width) && isPositiveNumber(dummy_height), {
    dummy_width,
    dummy_height,
    dummy_html,
  });

  if (dummy_height === 0 || dummy_width === 0) {
    if (dummy_height !== 0 || dummy_width !== 0) {
      track_error({
        name: "unexpected dummy size",
        value: JSON.stringify({ dummy_height, dummy_width, dummy_text }),
      });
    } else if (is_rendered(dummy)) {
      track_error({
        name: "unexpected zero-sized rendered dummy",
        value: "dummy_text == " + dummy_text,
      });
    }

    return {
      fontSize: 0,
      width: 0,
      height: 0,
    };
  }

  assert(dummy_height > 0 && dummy_width > 0);

  const ratio_width = outer_width / dummy_width;
  const ratio_height = outer_height / dummy_height;
  const ratio = Math.min(ratio_width, ratio_height);

  const fontSize = ratio * DUMMY_FONT_SIZE;
  const width = ratio * dummy_width;
  const height = ratio * dummy_height;

  assert(
    isPositiveNumber(fontSize) &&
      isPositiveNumber(height) &&
      isPositiveNumber(width),
    {
      fontSize,
      width,
      height,
      dummy_width,
      dummy_height,
      outer_width,
      outer_height,
    }
  );

  return {
    fontSize,
    width,
    height,
  };
}

let dummy_el;
function getDummy(tagName) {
  if (!dummy_el) {
    // Create a wrapper to ensure that dummy is not cropped by a `overflow: hidden` ancestor
    // See https://css-tricks.com/popping-hidden-overflow/
    const dummy_wrapper = document.createElement("div");
    dummy_wrapper.pointerEvents = "none";
    dummy_wrapper.style.overflow = "hidden";
    dummy_wrapper.style.height = "1px";
    dummy_wrapper.style.width = "1px";
    dummy_wrapper.style.position = "absolute";
    dummy_wrapper.style.zIndex = "999999999";
    dummy_wrapper.visibility = "hidden";

    dummy_el = document.createElement(tagName);
    dummy_el.style.position = "absolute";

    dummy_wrapper.prepend(dummy_el);
    document.body.prepend(dummy_wrapper);
  }
  assert(dummy_el.tagName === tagName);
  return dummy_el;
}

function get_computed_style(el, styleProp) {
  return document.defaultView.getComputedStyle(el).getPropertyValue(styleProp);
}

function isPositiveNumber(val) {
  // `return val>=0;` doesn't catch `val===null`
  assert(null >= 0);

  return (
    val !== null &&
    (val === 0 || (val && val.constructor === Number && val > 0))
  );
}

function get_size(el, styleProp) {
  assert(el, "[get_size][error]", { styleProp, el });

  const el_id = el.id;

  const rendered = is_rendered(el);
  const val = get_computed_style(el, styleProp);

  if (!val) {
    if (rendered) {
      track_error({
        name: "unexpected computed style",
        value: "val == " + val,
      });
    }
    return 0;
  }

  const val__casted = parseInt(val, 10);

  if (!val__casted && val__casted !== 0) {
    if (rendered) {
      track_error({
        name: "unexpected computed style value",
        value: "val == " + val,
      });
    }
    return 0;
  }

  assert(isPositiveNumber(val__casted), "[get_size][error]", {
    el_id,
    styleProp,
    val,
    val__casted,
  });

  return val__casted;
}

function is_rendered(el) {
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom/21696585#21696585
  return el.offsetParent !== null;
}
