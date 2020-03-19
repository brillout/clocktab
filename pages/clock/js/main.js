/*
import 'regenerator-runtime/runtime';
*/

import 'tab-utils/more_panel';

import loadAd from './loadAd';
import loadClock from './loadClock';
import loadAnalytics from './loadAnalytics';
import autoReloadPage from './autoReloadPage';

window.onload = async () => {
  await loadClock();

  document.documentElement.classList.remove('hideApp');

  loadAnalytics();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
};
