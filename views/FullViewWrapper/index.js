import React from 'react';
import pretty_scroll_area, {scrollToElement, addScrollListener, removeScrollListener} from '../../tab-utils/pretty_scroll_area';
import Header from '../Header';
import Footer from '../Footer';
import assert from '@brillout/assert';
import logoUrl from '../Header/logo.svg';
import './full-view.css';

export {FullView, MorePanel, config};


function FullView({children, ...props}) {
  return <>
    <Header/>

    <div
      className="pretty_scroll_area__hide_scroll_element"
      {...props}
      style={{
        height: '100vh',
        /* This div's `width` is already set to `100vw` because it is children of .pretty_scroll_area
        width: '100vw',
        */
        ...props.style
      }}
    >
      {children}
    </div>

    <div id="screen-buttons-wrapper" className="pretty_scroll_area__absolute_positioned">
      <div className="screen-button glass-background" id="manual-fullscreen">Fullscreen</div>
      <div className="screen-button glass-background" id="manual-scroll">Center</div>
      <div className="screen-button glass-background" id="auto-scroll"></div>
    </div>
  </>;
}

function MorePanel({children}) {
  return (
    <div id="more_panel">
      <div id="more_panel_background" className='glass-background'></div>
      <div id="more_panel_jumper_wrapper">
        <div id="more_panel_jumper" className='glass-background'></div>
      </div>
      {children}
      <Footer/>
    </div>
  );
}

function config(conf) {
  return {
    renderToDom: true,
    renderToHtml: true,
    favicon: logoUrl,
    ...conf,
    onPageLoad: loadWrapper => {
      if( conf.onPageLoad ){
        conf.onPageLoad(() => {
          onPageLoad(loadWrapper);
        });
      } else {
        onPageLoad(loadWrapper);
      }
    },
  };
}

function onPageLoad(loadWrapper) {
  loadWrapper();

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
    document.documentElement.requestFullscreen();
    // When tab goes to fullscreen, scroll is changed; ensure with `requestAnimationFrame` that
    // scrolling happens *after* the tab goes fullscreen.
    requestAnimationFrame(async () => {
      await do_scroll();
    });
  }
}
function activate_auto_scroll({do_scroll}) {
  //*/
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
    auto_scroll.removeAttribute(disable_prop);
    if( repeater ) return;
    counter = AUTO_DURATION;
    inOneSec();
    assert.internal(repeater);
  }
  function stop_auto_scroll() {
    auto_scroll.setAttribute(disable_prop, 'true');
    if( repeater ) {
      window.clearTimeout(repeater);
      repeater = null;
    }
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
 // auto_scroll.setAttribute('data-counter', (counter<10?'0':'')+counter);
    auto_scroll.setAttribute('data-counter', counter);
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

