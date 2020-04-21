export default autoReloadPage;

export { hasBeenAutoReloaded };

const oneMinute = 1 * 60 * 1000;

/*
const DEBUG = true;
/*/
const DEBUG = false;
//*/

function autoReloadPage() {
  console.log(
    "auto-reload - activated [" + new Date().toLocaleTimeString() + "]"
  );
  detectActivity();
  reloadInFuture();
}
function reloadInFuture() {
  const tenMinutes = (!DEBUG ? 10 : 0.1) * oneMinute;
  setTimeout(reloadPage, tenMinutes);
}
function reloadPage() {
  console.log("auto-reload - attemp to reload");
  if (isOlderThan(lastActivity, (!DEBUG ? 1 : 0.2) * oneMinute)) {
    console.log("auto-reload - reload now");
    window.localStorage.setItem(
      "auto_reloaded",
      new Date().getTime().toString()
    );
    window.location.reload();
  } else {
    console.log("auto-reload - reload postponed");
    reloadInFuture();
  }
}

function hasBeenAutoReloaded() {
  let lastAutoReload = window.localStorage.getItem("auto_reloaded");
  lastAutoReload = lastAutoReload && new Date(parseInt(lastAutoReload, 10));
  window.localStorage.removeItem("auto_reloaded");
  if (!lastAutoReload) {
    return false;
  }
  if (isOlderThan(lastAutoReload, oneMinute)) {
    return false;
  }
  console.log("auto-reload - successfully reloaded");
  return true;
}

function isOlderThan(date, timespan1) {
  const now = new Date();
  const timespan2 = now - date;
  return timespan2 > timespan1;
}

let lastActivity = new Date();
function activityListener() {
  lastActivity = new Date();
}
function detectActivity() {
  [
    "keydown",
    "wheel",
    "mousewheel",
    "touchstart",
    "touchmove",
    "mousedown",
    "mousemove",
  ].forEach((evName) => {
    document.addEventListener(evName, activityListener, { passive: true });
  });
}
