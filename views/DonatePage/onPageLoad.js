export default onPageLoad;

function onPageLoad(loadCommon) {
  set_email_paypal();
  set_email_contact();
  loadCommon();
}

function set_email_paypal() {
  let paypal_email = 'paypal';
  paypal_email+='@';
  paypal_email+='brillout';
  paypal_email+='.';
  paypal_email+='com';
  const paypalEl = document.getElementById('paypal-email');
  paypalEl.innerHTML = paypal_email;
}

function set_email_contact() {
  let email = 'clocktab';
  email+='@';
  email+='brillout';
  email+='.';
  email+='com';
  const contact_email = document.getElementById('contact-email');
  contact_email.innerHTML = email;
  contact_email.setAttribute(
    'href',
    'mailto:'+email
  );
}
