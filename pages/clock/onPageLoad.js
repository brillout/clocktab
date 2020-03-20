
import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from 'tab-utils/auto_remove_hash';

export default onPageLoad;

async function onPageLoad (loadCommon){
  await loadClock();

  auto_remove_hash();

  loadCommon();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}


