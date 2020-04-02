import assert from '@brillout/assert';

import ml from '../ml';

export {load_tracker};
export {track_event};
export {track_error};

const IS_DEV = typeof window !== "undefined" && window.location.hostname === 'localhost';

const DEBUG = IS_DEV;

const GA_ID = 'UA-5263303-5';

init();

let already_loaded = false;
async function load_tracker() {
  if( already_loaded ) return;
  already_loaded = true;
  ml.loadScript('//www.google-analytics.com/analytics.js');
  DEBUG && console.log('[GA] ga code loaded');
}

function track_user_clicks() {
  window.addEventListener('click', ev => {
    const {target} = ev;
    let eventAction = target.id || target.getAttribute('class') || 'null';
    let eventLabel = target.href || target.value || target.textContent.slice(0, 100);
    track_event({
      eventCategory: 'user_click',
      eventAction,
      eventLabel,
    });
  }, {passive: false});
}

function track_page_view() {
  ga('send', 'pageview');
  DEBUG && console.log('[GA] page view');
}

async function track_error(err) {
  send_error_event({err, eventCategory: '[error] manual_catch'});
}
function send_error_event({eventCategory, err, ...rest}) {
  assert(eventCategory);
  assert(err);
  assert(Object.keys(rest).length===0);

  const eventAction = (err||{}).message || 'no_error_message';
  const eventLabel = (
    err && err.stack && (
      err.stack
    ) ||
    err && (
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    ) || (
      'no_error_object'
    )
  );

  const track_props = {
    eventCategory,
    eventAction,
    eventLabel,
  };
  track_event(track_props);

  IS_DEV && alert(JSON.stringify(track_props, null, 2));
}
async function track_event(args) {
  /* use TS instead
  const keys = Object.keys(args);
  assert(keys.length===3);
  assert(keys.includes('eventCategory').length===3);
  */
  ga('send', {hitType: 'event', ...args});
  DEBUG && console.log('[GA] event', args);
}

function init() {
  if( typeof window === "undefined" ) return;
  setup_ga();
  track_page_view();
  track_user_clicks();
  track_error_events();
}

function setup_ga() {
  // Source:
  //  - https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference#async-unminified

  window.ga = window.ga || function() {
    (ga.q = ga.q || []).push(arguments)
  };

  // Sets the time (as an integer) this tag was executed.
  // Used for timing hits.
  ga.l = +new Date;

  // Creates a default tracker with automatic cookie domain configuration.
  ga('create', GA_ID, 'auto');
}

// https://stackoverflow.com/questions/12571650/catching-all-javascript-unhandled-exceptions/49560222#49560222
function track_error_events() {
  window.onerror = function (...args_list) {

    try {
      load_tracker();

      const [message, filename, lineno, colno, error] = args_list;
      const eventCategory = '[error] window.onerror';
      let err = error || {};
      err.message = err.message || message;
      if( !err.stack ){
        Object.assign(err, {filename, lineno, colno, noErrorObj: true});
      }
      send_error_event({eventCategory, err})

    // Avoid infinite loop
    } catch(_) {console && console.error && console.error(_)}

    return false;
  };
  window.addEventListener("error", function (ev) {
    try {
      load_tracker();

      const eventCategory = '[error] ErrorEvent';
      const err = ev.error || {};
      err.message = err.message || ev.message;
      if( !err.stack ) {
        const {filename, lineno, colno} = ev;
        Object.assign(err, {filename, lineno, colno, noErrorObj: true});
      }
      send_error_event({eventCategory, err});

    // Avoid infinite loop
    } catch(_) {console && console.error && console.error(_)}

    return false;
  }, {useCapture: true, passive: false});
  window.addEventListener('unhandledrejection', function (ev) {
    const eventCategory = '[error] unhandledrejection';
    const err = ev.reason;
    send_error_event({eventCategory, err});
  });
}
