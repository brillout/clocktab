export default onPageLoad;

function onPageLoad() {
  let clock_tab_email = 'clocktab';
  clock_tab_email+='@';
  clock_tab_email+='brillout';
  clock_tab_email+='.';
  clock_tab_email+='com';
  const contactEl = document.getElementById('clocktab-contact');
  contactEl.innerHTML = clock_tab_email;
  const href = 'mailto:'+clock_tab_email;
  contactEl.setAttribute('href', href);
}

