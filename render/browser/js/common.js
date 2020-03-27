import '../css/common.css';

import loadAnalytics from './loadAnalytics';
import activate_email_links from './activate_email_links';

export default loadCommon;

function loadCommon() {
//document.documentElement.classList.remove('hideApp');

  activate_email_links();

  loadAnalytics();
}
