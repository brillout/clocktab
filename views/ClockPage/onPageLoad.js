import loadAd from './js/loadAd';
import load_clock from './js/load_clock';
import init_clock_options from './js/init_clock_options';
import {get_option} from './js/init_options';
// import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from '../../tab-utils/auto_remove_hash';
import {on_big_text_load, set_max_width_getter} from '../BigText';

export default onPageLoad;

async function onPageLoad (loadWrapper){
  set_max_width_getter(() => get_option('font_size'));

  await init_clock_options();

  load_clock();

  on_big_text_load();

  loadWrapper();

  auto_remove_hash();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}
