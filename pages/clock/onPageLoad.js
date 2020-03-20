
import loadAd from './js/loadAd';
import loadClock from './js/loadClock';
import autoReloadPage from './js/autoReloadPage';
import auto_remove_hash from 'tab-utils/auto_remove_hash';
import pretty_scroll_area, {scrollToElement} from 'tab-utils/pretty_scroll_area';

export default onPageLoad;

async function onPageLoad (loadCommon){
  await loadClock();

  auto_remove_hash();

  loadCommon();

  pretty_scroll_area();

  actionize_more_panel_link();

  loadAd();
//setTimeout(() => loadAd(), 500);

  // To avoid memory leak
//autoReloadPage();
}

function actionize_more_panel_link() {
  const link_source = document.querySelector('#more_panel_jumper');
  if( !link_source ) return;
  link_source.onclick = ev => {
    scrollToElement('#more_panel');
    ev.preventDefault();
    return false;
  };
}
