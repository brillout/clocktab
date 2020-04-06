import ml from '../ml';

export default load_font_list;

let promise;

function load_font_list() {
  if( promise ) {
    return promise;
  }

  let resolve_promise;
  promise = new Promise(r => resolve_promise = r);

  window['onfontsload'] = function(resp){
    if( resp.error ) {
      console.error(resp.error.message);
      resolve_promise([]);
      return;
    }

    let font_list = resp['items'].map(f => f.family).sort();

    if(ml.browser().usesGecko) {
      // Firefox crashes when selecting a from too many options
      const MAX = 300;
      font_list = font_list.slice(0, MAX);
    }

    resolve_promise(font_list);
  };

  ml.loadASAP('https://www.googleapis.com/webfonts/v1/webfonts?callback=onfontsload&sort=popularity&key=AIzaSyAOMrdvfJJPa1btlQNCkXT9gcA-lCADPeE');

  return promise;
}
