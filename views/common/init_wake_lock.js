export default init_wake_lock;

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
    console.log('[Wake Lock] Not available');
    return;
  }
  wakeLock.addEventListener('release', () => {
    console.log('[Wake Lock] Released');
  });
  console.log('[Wake Lock] Active');
}

function on_page_focus(listener) {
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
      listener();
    }
  });
}
