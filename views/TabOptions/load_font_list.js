import assert from '@brillout/assert';
import ml from '../ml';

export default load_font_list;

let fontLoaded;

function load_font_list({fonts, font_option_id}) {
  if( fontLoaded ) {
    return;
  }
  setFontList(fonts, font_option_id);

  window['onfontsload'] = function(resp){
    if( resp.error ) {
      console.error(resp.error.message);
      return;
    }
    fontLoaded = true;
    setFontList(resp['items'].map(f => f.family), font_option_id);
    console.log('load-progress - font-list - done');
  };

  console.log('load-progress - font-list - start');
  ml.loadASAP('https://www.googleapis.com/webfonts/v1/webfonts?callback=onfontsload&sort=popularity&key=AIzaSyAOMrdvfJJPa1btlQNCkXT9gcA-lCADPeE');
}

function setFontList(fontList, font_option_id) {
  assert(font_option_id, font_option_id);
  const clockFontOptEl = document.getElementById(font_option_id);
  assert(clockFontOptEl, {font_option_id});

  const selectedFont = clockFontOptEl.value;

  fontList = makeUnique([selectedFont, ...fontList]);

  clockFontOptEl.innerHTML='';
  var max=300;//firefox crashes when selecting a from too many options
  for(var i in fontList) {
    const fontFamily = fontList[i];
    if(ml.browser().usesGecko && !max--)break;
    var fop=document.createElement('option');
    fop.innerHTML = fontFamily;
    fop.value     = fontFamily;
    clockFontOptEl.appendChild(fop);
  }
  clockFontOptEl.value = selectedFont || fontList[0];
}

function makeUnique(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}
