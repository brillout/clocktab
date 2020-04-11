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
    <div id="zoom_container" style={{width: '100vw'}}>
      <div id='layout--container' className='position--center'>

        <div id="layout--top">
          {content_on_top}
        </div>

        <div id={id} className="layout_middle">
          <table id='middle_table'>
            <tr><td id='top-line'>
              {top_line_content}
            </td></tr>
            <tr><td id='bot-line'>
            </td></tr>
          </table>
        </div>

        <div id="layout--bottom"></div>
      </div>
    </div>
  );
}

function set_text_position(position) {
  const layout__container = document.querySelector('#layout--container');
  layout__container.setAttribute('class',
    position.split('-')
    .map(pos => 'position--'+pos)
    .join(' ')
  );
}

function on_big_text_load() {
  activate_auto_resize();
  activate_zoom();
}

function set_bottom_line(bottom_text) {
  const bot_el = document.getElementById('bot-line');
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
    const containerEl = document.querySelector('#zoom_container');
    const scaleEl = document.querySelector('#layout--container');
    const zoomEl = document.querySelector('#middle_table');
    assert(containerEl && scaleEl && zoomEl);
    make_element_zoomable({containerEl, scaleEl, zoomEl});
}


//*/
const DEBUG = true;
/*/
const DEBUG = false;
/*/

function refresh_big_text_size() {
  const bot_el = document.getElementById('bot-line');
  const top_el = document.getElementById('top-line');
  assert(bot_el && top_el);

  const padding_el = document.getElementById('middle_table');
  const padding = {
    height: parseInt(get_el_style(padding_el, 'padding-left'), 10) + parseInt(get_el_style(padding_el, 'padding-right') ,10),
    width : parseInt(get_el_style(padding_el, 'padding-top' ), 10) + parseInt(get_el_style(padding_el, 'padding-bottom'),10),
  };

  const window_width = window.innerWidth - padding.width;
  const window_height = window.innerHeight - padding.height;

  const max_width = Math.min(window_width, parseInt(get_max_width(),10)||Infinity);
//const max_height = Math.min(window_height, max_width*0.4);
  const max_height = Math.min(window_height, max_width*0.6);

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

function get_el_style(el, styleProp) {
  return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
}
