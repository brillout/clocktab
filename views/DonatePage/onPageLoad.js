export default onPageLoad;

function onPageLoad() {
  set_email_paypal();
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
