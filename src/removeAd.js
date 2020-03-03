// Since Clock Tab's source code is open anyone can read this and bypass doing a donation to remove ads
// If you are short on money then please do this :-)

export default removeAd;

function removeAd() {
  if( codeIsInUrl()===true ){
    return true;
  }
  if( codeIsInLocalStorage()===true ){
    return true;
  }

  document.documentElement.classList.add('show_ad');

  return false;
}

function codeIsInUrl() {
  if( window.location.hash==='#thanks-for-your-donation' ){
    window.localStorage.setItem('thanks-for-your-donation', '1');
    removeHash();
    return true;
  }
  return false;
}

function codeIsInLocalStorage() {
  return !!window.localStorage.getItem('thanks-for-your-donation');
}

function removeHash () {
  // `window.location.hash = '';` doesn't remove leading `#` sign.
  // See https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r
  window.history.pushState("", document.title, window.location.pathname + window.location.search);
}

