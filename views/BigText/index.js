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

function BigText({top_content, big_text, id}) {
  return (
    <div id="zoom_container" style={{width: '100vw'}}>
      <div id='layout_container' className='position-center'>

        <div id="layout_top">
          {top_content}
        </div>

        <div id={id} className="layout_middle">
          <table id='middle_table'>
            <tr><td id='big_line'>
              {big_text}
            </td></tr>
            <tr><td id='bottom_line'>
            </td></tr>
          </table>
        </div>

        <div id="layout_bottom"></div>
      </div>
    </div>
  );
}

function set_text_position(position) {
  const layout_container = document.querySelector('#layout_container');
  layout_container.setAttribute('class',
    position.split('-')
    .map(pos => 'position-'+pos)
    .join(' ')
  );
}

function on_big_text_load() {
  activate_auto_resize();
  activate_zoom();
}

function set_bottom_line(bottom_text) {
  const bottom_el = document.getElementById('bottom_line');
  assert(bottom_el);
  bottom_el.innerHTML = bottom_text;
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
    const scaleEl = document.querySelector('#layout_container');
    const zoomEl = document.querySelector('#middle_table');
    assert(containerEl && scaleEl && zoomEl);
    make_element_zoomable({containerEl, scaleEl, zoomEl});
}


function refresh_big_text_size() {
  const bottom_el = document.getElementById('bottom_line');
  const big_el = document.getElementById('big_line');
  assert(bottom_el && big_el);

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

  let time_new_size;
  let date_new_size;

  time_new_size = get_max_font_size({
    dom_el: big_el,
    max_width,
    max_height,
  });

  if(bottom_el.innerHTML!="") {
    const bottom_line_width_reducer = 0.95;

    date_new_size = get_max_font_size({
      dom_el: bottom_el,
      max_width: time_new_size.width*bottom_line_width_reducer,
      max_height,
    });

    const too_big = time_new_size.height + date_new_size.height > max_height;
    if( too_big ){
      const resolve_ratio = 1/3;

      time_new_size = get_max_font_size({
        dom_el: big_el,
        max_width,
        max_height: max_height * (1 - resolve_ratio),
      });
      date_new_size = get_max_font_size({
        dom_el: bottom_el,
        max_width: time_new_size.width*bottom_line_width_reducer,
        max_height: max_height * resolve_ratio,
      });
    }

    bottom_el.style.fontSize = date_new_size.fontSize+'px';
  }

  big_el.style.fontSize = time_new_size.fontSize  +'px';
}

function get_el_style(el, styleProp) {
  return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
}
