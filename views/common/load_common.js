import activate_email_links from './activate_email_links';
import activate_app from './activate_app';
import loadAnalytics from './loadAnalytics';
import init_wake_lock from './init_wake_lock';

export default load_common;

function load_common() {
  activate_email_links();

  activate_app();

  loadAnalytics();

  try {
    init_wake_lock();
  } catch(e){}
}
