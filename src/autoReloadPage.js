export default autoReloadPage;

const oneMinute = 1*60*1000;

//*
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function autoReloadPage() {
  console.log("auto-reload - activated ["+new Date().toLocaleTimeString()+"]");
  detectActivity();
  reloadInFuture();
}
function reloadInFuture() {
  const tenMinutes = (!DEBUG?10:0.3)*oneMinute;
  setTimeout(reloadPage, tenMinutes);
}
function reloadPage() {
  console.log("auto-reload - attemp to reload");
  if( isOlderThan(lastActivity, (!DEBUG?1:0.1)*oneMinute) ) {
    console.log("auto-reload - reload now");
    window.location.reload();
  } else {
    console.log("auto-reload - reload postponed");
    reloadInFuture();
  }
}

function isOlderThan(date, timespan1) {
  const now = new Date();
  const timespan2 = now - date;
  return timespan2 > timespan1;
}

let lastActivity = new Date();;
function activityListener() {
  lastActivity = new Date();
}
function detectActivity() {
  [
    'keydown',
    'wheel',
    'mousewheel',
    'touchstart',
    'touchmove',
    'mousedown',
    'mousemove',
  ].forEach(evName => {
    document.addEventListener(evName, activityListener, {passive: true});
  });
}
