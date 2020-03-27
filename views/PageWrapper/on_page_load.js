import load_common from '../common/load_common';

export default on_page_load;

function on_page_load(on_load) {
  if( on_load ){
    on_load();
  }

  load_common();
}
