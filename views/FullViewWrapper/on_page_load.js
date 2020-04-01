import assert from '@brillout/assert';
import pretty_scroll_area, {scrollToElement, addScrollListener} from '../../tab-utils/pretty_scroll_area';
import load_common from '../common/load_common';
import { show_toast } from '../common/show_toast';

export default on_page_load;

function on_page_load(on_load) {
  on_load(() => {
    load_full_view();
    load_common();
  });
}

function load_full_view() {
  pretty_scroll_area();

  activate_screen_buttons();

  actionize_more_panel_link();
}

function actionize_more_panel_link() {
  const link_source = document.querySelector('#more_panel_jumper');
  if( !link_source ) return;
  link_source.onclick = ev => {
    scrollToElement('#more_panel');
    ev.preventDefault();
    return false;
  };
}

function activate_screen_buttons() {
  const manual_scroll = document.querySelector('#manual-scroll');
  const manual_fullscreen = document.querySelector('#manual-fullscreen');
  const clock_view = document.querySelector('.pretty_scroll_area__hide_scroll_element');

  manual_scroll.onclick = do_scroll;
  manual_fullscreen.onclick = do_fullscreen;

  const stop_auto_scroll = activate_auto_scroll({do_scroll});

  return;

  async function do_scroll() {
    stop_auto_scroll();
    await scrollToElement(clock_view);
  }
  async function do_fullscreen() {
    try {
      document.documentElement.requestFullscreen();
    } catch(err) {
      show_toast("Your browser doesn't support fullscreen.", {is_error: true, short_duration: true});
      return;
    }
    // When tab goes to fullscreen, scroll is changed; ensure with `requestAnimationFrame` that
    // scrolling happens *after* the tab goes fullscreen.
    requestAnimationFrame(async () => {
      await do_scroll();
    });
  }
}

function activate_auto_scroll({do_scroll}) {
  /*/
  const AUTO_DURATION = 6;
  /*/
  const AUTO_DURATION = 9;
  //*/

  const auto_scroll = document.querySelector('#auto-scroll');
  const disable_prop = 'data-disable-auto-scroll';

  addScrollListener(scrollListener, {onlyUserScroll: true, fireInitialScroll: false});
  start_auto_scroll();

  return stop_auto_scroll;

  var counter;
  var repeater;
  function start_auto_scroll() {
    show();
    if( repeater ) return;
    counter = AUTO_DURATION;
    inOneSec();
    assert.internal(repeater);
  }
  function stop_auto_scroll() {
    hide();
    if( repeater ) {
      window.clearTimeout(repeater);
      repeater = null;
    }
  }

  function show() {
    auto_scroll.removeAttribute(disable_prop);
  }
  function hide() {
    auto_scroll.setAttribute(disable_prop, 'true');
  }

  function inOneSec() {
    assert.internal(0<counter && counter<=AUTO_DURATION);
    --counter;
    updateDom();
    if( counter===0 ){
      do_scroll();
      stop_auto_scroll();
      assert.internal(repeater===null);
    } else {
      repeater = window.setTimeout(inOneSec, 1000);
    }
  }

  function updateDom() {
    if( !counter ) {
      hide();
    } else {
      show();
    }
    auto_scroll.textContent = 'Auto-center ' + counter + 's';
  }

  function scrollListener(scrollPos) {
    if( document.fullscreenElement ){
      document.exitFullscreen();
    }

    if( scrollPos===0 ){
      start_auto_scroll();
    } else {
      stop_auto_scroll();
    }
  }
}
