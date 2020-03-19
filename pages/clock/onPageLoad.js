import more_panel from 'tab-utils/more_panel';

import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
import loadAnalytics from './js/loadAnalytics';
import autoReloadPage from './js/autoReloadPage';

async function onPageLoad (){
  await loadClock();

  more_panel();

  document.documentElement.classList.remove('hideApp');

  loadAnalytics();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}


