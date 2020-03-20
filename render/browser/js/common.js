import '../css/common.css';

import loadAnalytics from './loadAnalytics';

export default loadCommon;

function loadCommon() {
  document.documentElement.classList.remove('hideApp');

  loadAnalytics();
}
