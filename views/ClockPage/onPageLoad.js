
import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
// import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from 'tab-utils/auto_remove_hash';
import {on_big_text_load} from '../BigText';

export default onPageLoad;

async function onPageLoad (loadWrapper){
  await loadClock();

  on_big_text_load();

  loadWrapper();

  auto_remove_hash();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}
