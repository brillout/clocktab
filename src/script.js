import 'regenerator-runtime/runtime'

import loadAd from './loadAd';
import loadClock from './loadClock';
import loadAnalytics from './loadAnalytics';
import loadFontList from './loadFontList';
import autoReloadPage from './autoReloadPage';

window.onload = async () => {
  await loadClock();
  console.log('finished waiting loading clock');

  document.body.classList.remove('hideApp');

  loadAnalytics();

  loadAd();

  // To avoid memory leak
  autoReloadPage();
};
