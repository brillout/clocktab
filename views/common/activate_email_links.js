export default activate_email_links;

function activate_email_links() {
  let mail = 'clocktab';
  mail+='@';
  mail+='brillout';
  mail+='.';
  mail+='com';

  Array.from(document.querySelectorAll('a.contact-address'))
  .forEach(link => {
    link.innerHTML = link.innerHTML || mail;
    link.setAttribute('href', getHref(link, mail));
  });
}

function getHref(link, mail) {
  let href = 'mailto:'+mail;
  const data_subject = link.getAttribute('data-subject');
  const data_body = link.getAttribute('data-body');

  if( !data_subject && !data_body ){
    return href;
  }

  href += '?';

  if( data_subject ){
    href += 'subject='+encodeURIComponent(data_subject);
    if( data_body ){
      href += '&';
    }
  }

  if( data_body ){
    href += 'body='+encodeURIComponent(data_body);
  }

  return href;
}
