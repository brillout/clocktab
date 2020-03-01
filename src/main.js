import 'regenerator-runtime/runtime'

import loadAd from './loadAd';
import loadClock from './loadClock';
import loadAnalytics from './loadAnalytics';
import loadFontList from './loadFontList';
import autoReloadPage from './autoReloadPage';

window.onload = async () => {
  await loadClock();
  console.log("load progress", "clock loading done");

  document.documentElement.classList.remove('hideApp');

  loadAnalytics();

  loadAd();

  // To avoid memory leak
  autoReloadPage();
};
