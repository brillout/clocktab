export default init_wake_lock;

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function init_wake_lock() {
  call_wake_lock();
  on_page_focus(call_wake_lock);
}

async function call_wake_lock() {
  let wakeLock;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch(e){}
  if( !wakeLock ){
    DEBUG && console.log('[Wake Lock] Not available');
    return;
  }
  wakeLock.addEventListener('release', () => {
    DEBUG && console.log('[Wake Lock] Released');
  });
  DEBUG && console.log('[Wake Lock] Active');
}

function on_page_focus(listener) {
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
      listener();
    }
  });
}
