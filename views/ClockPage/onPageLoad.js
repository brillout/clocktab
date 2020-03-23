
import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
// import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from 'tab-utils/auto_remove_hash';

export default onPageLoad;

async function onPageLoad (loadWrapper){
  await loadClock();

  loadWrapper();

  auto_remove_hash();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}
