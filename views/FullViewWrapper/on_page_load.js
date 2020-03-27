import activate_email_links from '../activate_email_links';
import activate_app from '../activate_app';
import loadAnalytics from '../loadAnalytics';

export default on_page_load;

function on_page_load(on_load) {
  on_load(load_common);
}

function load_common() {
  activate_email_links();

  activate_app();

  loadAnalytics();
}
