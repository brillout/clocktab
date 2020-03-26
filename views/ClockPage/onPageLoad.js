import loadAd from './js/loadAd';
import load_clock from './js/load_clock';
import init_clock_options from './js/init_clock_options';
// import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from '../../tab-utils/auto_remove_hash';
import {on_big_text_load, set_max_width_getter} from '../BigText';
import {sleep} from '../../tab-utils/sleep';

export default onPageLoad;

async function onPageLoad (loadWrapper){
  const {get_option_value, font_loaded_promise} = init_clock_options();

  set_max_width_getter(() => get_option_value('font_size'));

  load_clock({get_option_value});

  on_big_text_load();

  loadWrapper();

  auto_remove_hash();

  await Promise.race([
    font_loaded_promise,
    sleep({seconds: 0.4}),
  ]);

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}
