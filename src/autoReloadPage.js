export default autoReloadPage;

function autoReloadPage() {
  const tenMinutes = 10*60*1000;
  setTimeout(reloadPage, tenMinutes);
}

function reloadPage() {
  window.location.reload();
}
