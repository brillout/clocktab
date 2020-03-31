import ml from '../ml';

export {setup_error_handlers};
export {load_tracker};
export {track_event};
export {track_error};

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

const GA_ID = 'UA-5263303-5';

const IS_DEV = typeof window !== "undefined" && window.location.hostname === 'localhost';

init_ga();

let already_loaded = false;
async function load_tracker() {
  if( already_loaded ) return;
  already_loaded = true;
  ml.loadScript('//www.google-analytics.com/analytics.js');
  DEBUG && console.log('[ga] ga code loaded');
}

function add_user_action_tracking() {
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
  DEBUG && console.log('[ga] page view');
}

async function track_error(err) {
  IS_DEV && alert(err);
  const errorMessage = (err||{}).message || 'no_error_object_1';
  track_event({
    eventCategory: 'code_error',
    eventAction: errorMessage,
    eventLabel: JSON.stringify(err||null),
  });
}
async function track_event(args) {
  /* use TS instead
  const keys = Object.keys(args);
  assert(keys.length===3);
  assert(keys.includes('eventCategory').length===3);
  */
  ga('send', {hitType: 'event', ...args});
  DEBUG && console.log('[ga] event', args);
}

// Source: https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference#async-unminified
function init_ga() {
  if( typeof window === "undefined" ) return;
  window.ga = window.ga || function() {
    (ga.q = ga.q || []).push(arguments)
  };

  // Sets the time (as an integer) this tag was executed.
  // Used for timing hits.
  ga.l = +new Date;

  // Creates a default tracker with automatic cookie domain configuration.
  ga('create', GA_ID, 'auto');

  track_page_view();

  add_user_action_tracking();
}

// https://stackoverflow.com/questions/12571650/catching-all-javascript-unhandled-exceptions/49560222#49560222
function setup_error_handlers() {
  window.onerror = function (args_list) {
 // const [message, file, line, col, error] = args_list;
    IS_DEV && alert(args_list.join('\n\n'));
    const message = args_list[0];
    DEBUG && console.log("[error-tracking] onerror: "+message);
    return false;
  };
  window.addEventListener("error", function (ev) {
    const err = ev.error || {message: 'no_error_object_2'};
    DEBUG && console.log("[error-tracking] error event: "+err.message);
    track_error(err);
    return false;
  });
  window.addEventListener('unhandledrejection', function (ev) {
    const err = ev.reason || {message: 'no_error_object_3'};
    DEBUG && console.log("[error-tracking] error event: "+err.message);
    track_error(err);
  });
}
