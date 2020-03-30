import ml from '../ml';

export {start_tracking};
export {track_event};

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

define_ga();

async function start_tracking() {
  load_ga('UA-5263303-5');

  track_page_view();

  add_user_action_tracking();
}

function add_user_action_tracking() {
  window.addEventListener('click', ev => {
    const {target} = ev;
    let eventAction = target.id || target.getAttribute('class') || 'null';
    let eventLabel = target.href || target.value || target.textContent.slice(0, 100);
    track_event({
      eventAction,
      eventLabel,
    });
  }, {passive: false});
}

function track_page_view() {
  ga('send', 'pageview');
  DEBUG && console.log('[ga] page view');
}

async function track_event(args) {
  /* use TS instead
  const keys = Object.keys(args);
  assert(keys.length===3);
  assert(keys.includes('eventCategory').length===3);
  */
  args.eventCategory = args.eventCategory || 'user_action';

  ga('send', {hitType: 'event', ...args});
  DEBUG && console.log('[ga] event', args);
}

// Source: https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference#async-unminified
function load_ga(id) {
  // Sets the time (as an integer) this tag was executed.
  // Used for timing hits.
  ga.l = +new Date;

  // Creates a default tracker with automatic cookie domain configuration.
  ga('create', id, 'auto');

  ml.loadScript('//www.google-analytics.com/analytics.js');
}

function define_ga() {
  if( typeof window === "undefined" ) return;
  window.ga = window.ga || function() {
    (ga.q = ga.q || []).push(arguments)
  };
}
