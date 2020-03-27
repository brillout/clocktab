import './big_text.css';
import React from 'react';
import get_max_font_size from './get_max_font_size';
import assert from '@brillout/assert';
import ml from '../ml';

export default BigText;
export {on_big_text_load};
export {refresh_big_text_size};
export {set_bottom_line};
export {set_max_width_getter};
export {set_text_position};

function BigText({top_content, big_text, bottom_max_font_size, id}) {
  return (
    <div id="zoom_container">
      <div id='layout_container' className='position-center'>

        <div id="layout_top">
          {top_content}
        </div>

        <div id={id} className="layout_middle">
          <table id='middle_table'>
            <tr><td id='big_line'>
              {big_text}
            </td></tr>
            <tr><td id='bottom_line' data-max-font-size={bottom_max_font_size}>
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

  loop();

  function loop() {
    refresh_big_text_size();

    window.requestAnimationFrame(() => {
      setTimeout(loop, 300);
    });
  }
}

function activate_zoom() {
    const containerEl = document.querySelector('#zoom_container');
    const scaleEl = document.querySelector('#layout_container');
    const zoomEl = document.querySelector('#middle_table');
    assert(containerEl && scaleEl && zoomEl);
    ml.zoomable_element({containerEl, scaleEl, zoomEl, keybinding: 'f'});
}


function refresh_big_text_size() {
  const bottom_el = document.getElementById('bottom_line');
  const big_el = document.getElementById('big_line');
  assert(bottom_el && big_el);

  let time_new_size;
  let date_new_size;

  time_new_size = get_max_font_size({
    dom_el: big_el,
    max_width: Math.min(window.innerWidth, parseInt(get_max_width(),10)||Infinity),
    max_height: window.innerHeight,
  });

  if(bottom_el.innerHTML!="") {
    const max_font_size = bottom_el.getAttribute('data-max-font-size');
    date_new_size = get_max_font_size({
      dom_el: bottom_el,
      max_width: time_new_size.width*0.95,
      max_height: window.innerHeight,
      max_font_size,
    });

    const diff = time_new_size.height+date_new_size.height-window.innerHeight;
    if(diff>0) {
      time_new_size = get_max_font_size({
        dom_el: big_el,
        max_width: window.innerWidth,
        max_height: window.innerHeight-date_new_size.height,
      });
      date_new_size = get_max_font_size({
        dom_el: bottom_el,
        max_width: time_new_size.width,
        max_height: window.innerHeight-time_new_size.height,
        max_font_size,
      });
      time_new_size = get_max_font_size({
        dom_el: big_el,
        max_width: window.innerWidth,
        max_height: window.innerHeight-date_new_size.height,
      });
    }

    bottom_el.style.fontSize = date_new_size.fontSize+'px';
  }

  big_el.style.fontSize = time_new_size.fontSize  +'px';
}

