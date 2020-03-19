
import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
import autoReloadPage from './js/autoReloadPage';

export default onPageLoad;

async function onPageLoad (loadCommon){
  await loadClock();

  loadCommon();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}


