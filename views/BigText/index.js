import "./big_text.css";
import React from "react";
import { get_max_font_size, isPositiveNumber } from "./get_max_font_size";
import assert from "@brillout/assert";
import { make_element_zoomable } from "../../tab-utils/make_element_zoomable";
import { ads_are_removed } from "../../tab-utils/load_ad";

export default BigText;
export { on_big_text_load };
export { refresh_big_text_size };
export { set_bottom_line };
export { set_max_width_getter };
export { set_text_position };

function BigText({ content_on_top, top_line_content, id }) {
  return (
    <div id="bt-zoom-container" style={{ width: "100vw" }}>
      <div id="bt-layout-container" className="bt-position-center">
        <div id="bt-layout-top">
          <div id="bt-layout-top-content">{content_on_top}</div>
        </div>

        <div id={id} className="bt-layout-middle">
          <table id="bt-middle-table">
            <tr>
              <td id="bt-top-line">{top_line_content}</td>
            </tr>
            <tr>
              <td id="bt-bot-line"></td>
            </tr>
          </table>
        </div>

        <div id="bt-layout-bottom"></div>
      </div>
    </div>
  );
}

function set_text_position(position) {
  assert(
    [
      "top-left",
      "top",
      "top-right",
      "center-left",
      "center",
      "center-right",
      "bottom-left",
      "bottom",
      "bottom-right",
    ].includes(position),
    { position }
  );
  const layout_container = document.querySelector("#bt-layout-container");
  ["top", "center", "bottom", "right", "left"].forEach((slot) => {
    layout_container.classList[position.includes(slot) ? "add" : "remove"](
      "bt-position-" + slot
    );
  });
}

function on_big_text_load() {
  activate_auto_resize();
  activate_zoom();
}

function set_bottom_line(bottom_text) {
  const bot_el = document.getElementById("bt-bot-line");
  assert(bot_el);
  bot_el.innerHTML = bottom_text;
}

let get_max_width;
function set_max_width_getter(_get_max_width) {
  get_max_width = _get_max_width;
}

function activate_auto_resize() {
  window.addEventListener("resize", refresh_big_text_size, { passive: true });
}

function activate_zoom() {
  const containerEl = document.querySelector("#bt-zoom-container");
  const scaleEl = document.querySelector("#bt-layout-container");
  const zoomEl = document.querySelector("#bt-middle-table");
  assert(containerEl && scaleEl && zoomEl);
  make_element_zoomable({ containerEl, scaleEl, zoomEl });
}

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function refresh_big_text_size() {
  const bot_el = document.getElementById("bt-bot-line");
  const top_el = document.getElementById("bt-top-line");
  assert(bot_el && top_el);

  const { max_height, max_width } = compute_max_size();
  DEBUG &&
    console.log("[size-computation]", bot_el, top_el, {
      "window.innerHeight": window.innerHeight,
      "window.innerWidth": window.innerWidth,
      max_width,
      max_height,
    });

  const { bot_line_sizes, top_line_sizes } = compute_font_sizes({
    max_height,
    max_width,
    top_el,
    bot_el,
  });
  DEBUG && assert.log("[size-computation]", { top_line_sizes, bot_line_sizes });

  assert(
    isPositiveNumber(top_line_sizes.fontSize) &&
      (!bot_line_sizes || isPositiveNumber(bot_line_sizes.fontSize)),
    { top_line_sizes, bot_line_sizes }
  );

  if (bot_line_sizes) {
    bot_el.style.fontSize = bot_line_sizes.fontSize + "px";
  }
  top_el.style.fontSize = top_line_sizes.fontSize + "px";
}

function compute_max_size() {
  let max_width = window.innerWidth;
  let max_height = window.innerHeight;
  assert(
    isPositiveNumber(max_width) && isPositiveNumber(max_height),
    "unexpected window sizes",
    {
      max_width,
      max_height,
    }
  );

  {
    // Remove padding
    const middle_table = document.getElementById("bt-middle-table");
    const padding = {
      width:
        get_size(middle_table, "padding-left") +
        get_size(middle_table, "padding-right"),
      height:
        get_size(middle_table, "padding-top") +
        get_size(middle_table, "padding-bottom"),
    };

    max_width = max_width - padding.width;
    max_height = max_height - padding.height;
  }

  // Make space space for top content (advertisements)
  if (!ads_are_removed()) {
    const layout_top_content = document.getElementById("bt-layout-top-content");
    const layout_top_content_height = get_size(layout_top_content, "height");
    max_height -= layout_top_content_height;
  }

  {
    // User can control max width
    const width_limit = parseInt(get_max_width(), 10) || Infinity;
    assert(isPositiveNumber(width_limit), { width_limit });
    max_width = Math.min(max_width, width_limit);
  }

  {
    // Avoid ugly long vertical big block
    max_height = Math.min(max_height, max_width * 1.6);
  }

  {
    // Negative values break computation down the line
    max_height = Math.max(max_height, 0);
    max_width = Math.max(max_width, 0);
  }

  assert(isPositiveNumber(max_width) && isPositiveNumber(max_height), {
    max_height,
    max_width,
  });
  return { max_width, max_height };
}

function compute_font_sizes({ bot_el, top_el, max_height, max_width }) {
  let top_line_sizes;
  let bot_line_sizes;

  top_line_sizes = get_max_font_size({
    dom_el: top_el,
    max_width,
    max_height,
  });

  if (bot_el.innerHTML != "") {
    const bottom_line_width_reducer = 0.95;

    bot_line_sizes = get_max_font_size({
      dom_el: bot_el,
      max_width: top_line_sizes.width * bottom_line_width_reducer,
      max_height,
    });

    const too_big = top_line_sizes.height + bot_line_sizes.height > max_height;
    if (too_big) {
      const resolve_ratio = 1 / 3;

      top_line_sizes = get_max_font_size({
        dom_el: top_el,
        max_width,
        max_height: max_height * (1 - resolve_ratio),
      });

      bot_line_sizes = get_max_font_size({
        dom_el: bot_el,
        max_width: top_line_sizes.width * bottom_line_width_reducer,
        max_height: max_height * resolve_ratio,
      });

      top_line_sizes = get_max_font_size({
        dom_el: top_el,
        max_width,
        max_height: max_height - bot_line_sizes.height,
      });
    }
  }

  return { bot_line_sizes, top_line_sizes };
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
