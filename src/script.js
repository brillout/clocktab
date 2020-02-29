import 'regenerator-runtime/runtime'

import loadAd from './loadAd';
import loadClock from './loadClock';

window.onload = async () => {
  await loadClock();
  loadAnalytics();
  loadAd();
};
