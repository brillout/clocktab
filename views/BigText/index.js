import './big_text.css';
import React from 'react';
import get_max_font_size from './get_max_font_size';
import assert from '@brillout/assert';
import {make_element_zoomable} from '../../tab-utils/make_element_zoomable';

export default BigText;
export {on_big_text_load};
export {refresh_big_text_size};
export {set_bottom_line};
export {set_max_width_getter};
export {set_text_position};

function BigText({content_on_top, top_line_content, id}) {
  return (
    <div id="bt-zoom-container" style={{width: '100vw'}}>
      <div id='bt-layout-container' className='bt-position-center'>

        <div id="bt-layout-top">
          {content_on_top}
        </div>

        <div id={id} className="bt-layout-middle">
          <table id='bt-middle-table'>
            <tr><td id='bt-top-line'>
              {top_line_content}
            </td></tr>
            <tr><td id='bt-bot-line'>
            </td></tr>
          </table>
        </div>

        <div id="bt-layout-bottom"></div>
      </div>
    </div>
  );
}

function set_text_position(position) {
  const layout_container = document.querySelector('#bt-layout-container');
  layout_container.setAttribute('class',
    position.split('-')
    .map(pos => 'bt-position-'+pos)
    .join(' ')
  );
}

function on_big_text_load() {
  activate_auto_resize();
  activate_zoom();
}

function set_bottom_line(bottom_text) {
  const bot_el = document.getElementById('bt-bot-line');
  assert(bot_el);
  bot_el.innerHTML = bottom_text;
}

let get_max_width;
function set_max_width_getter(_get_max_width) {
  get_max_width = _get_max_width;
}

function activate_auto_resize() {
  window.addEventListener('resize', refresh_big_text_size , {passive: true});
}

function activate_zoom() {
    const containerEl = document.querySelector('#bt-zoom-container');
    const scaleEl = document.querySelector('#bt-layout-container');
    const zoomEl = document.querySelector('#bt-middle-table');
    assert(containerEl && scaleEl && zoomEl);
    make_element_zoomable({containerEl, scaleEl, zoomEl});
}


/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function refresh_big_text_size() {
  const bot_el = document.getElementById('bt-bot-line');
  const top_el = document.getElementById('bt-top-line');
  assert(bot_el && top_el);

  let max_width = window.innerWidth;
  let max_height = window.innerHeight;

  { // Remove padding
    const middle_table = document.getElementById('bt-middle-table');
    const padding = {
      height: get_size(middle_table, 'padding-left') + get_size(middle_table, 'padding-right') ,
      width : get_size(middle_table, 'padding-top' ) + get_size(middle_table, 'padding-bottom'),
    };

    max_width = max_width - padding.width;
    max_height = max_height - padding.height;
  }

  { // User can control max width
    max_width = Math.min(max_width, parseInt(get_max_width(),10)||Infinity);
  }

  { // Avoid ugly long horizontal big block
    max_height = Math.min(max_height, max_width*0.6);
  }

  DEBUG && console.log('[size-computation] begin', {bot_el, top_el, max_width, max_height});

  let top_line_sizes;
  let bot_line_sizes;

  top_line_sizes = get_max_font_size({
    dom_el: top_el,
    max_width,
    max_height,
  });

  if(bot_el.innerHTML!="") {
    const bottom_line_width_reducer = 0.95;

    bot_line_sizes = get_max_font_size({
      dom_el: bot_el,
      max_width: top_line_sizes.width*bottom_line_width_reducer,
      max_height,
    });

    const too_big = top_line_sizes.height + bot_line_sizes.height > max_height;
    if( too_big ){
      const resolve_ratio = 1/3;

      top_line_sizes = get_max_font_size({
        dom_el: top_el,
        max_width,
        max_height: max_height * (1 - resolve_ratio),
      });
      bot_line_sizes = get_max_font_size({
        dom_el: bot_el,
        max_width: top_line_sizes.width*bottom_line_width_reducer,
        max_height: max_height * resolve_ratio,
      });
    }

    bot_el.style.fontSize = bot_line_sizes.fontSize+'px';
  }

  top_el.style.fontSize = top_line_sizes.fontSize  +'px';

  DEBUG && assert.log('[size-computation] end', {top_line_sizes, bot_line_sizes});
}

function get_size(el, styleProp) {
  const computed_val = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
  return parseInt(computed_val, 10);
}
