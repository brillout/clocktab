import ml from './ml';

export default loadFontList;

function loadFontList() {
  window['onfontsload'] = function(resp){
    if( resp.error ) {
      console.error(resp.error.message);
      return;
    }
    var fonts=resp['items'];
    var val = document.getElementById('font').value;
    document.getElementById('font').innerHTML='';
    var max=300;//firefox crashes when selecting a from too many options
    for(var i in fonts)
    {
      if(ml.browser().usesGecko && !max--)break;
      var fop=document.createElement('option');
      fop.innerHTML=fonts[i]['family'];
      fop.value    =fonts[i]['family'];
      document.getElementById('font').appendChild(fop);
    }
    document.getElementById('font').value=val;
  };
  ml.loadASAP('https://www.googleapis.com/webfonts/v1/webfonts?callback=onfontsload&sort=popularity&key=AIzaSyAOMrdvfJJPa1btlQNCkXT9gcA-lCADPeE');
}
