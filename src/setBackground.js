export default setBackground;

//tricky bg images to test:
//-http://static.panoramio.com/photos/original/3719338.jpg
//-cover test: http://cdn.techpp.com/wp-content/uploads/2008/10/gmail_logo.jpg
//black floor: http://img.wallpaperstock.net:81/black-floor-wallpapers_6854_1680x1050.jpg
//http://lh6.googleusercontent.com/-AAQe-KJXX-w/TcRrpukjk6I/AAAAAAAACwE/-7gmjOI-ctQ/IMG_2649mod.jpg
//http://www.a-better-tomorrow.com/blog/wp-content/wallpaper_abt1.jpg
//http://www.gowallpaper.net/wp-content/uploads/2011/04/Windows-7-3d-wide-wallpaper-1280x800.jpg
//http://vistawallpapers.files.wordpress.com/2007/03/vista-wallpapers-69.jpg


/*
const LOAD_IMG_URL = 'http://i.imgur.com/cvyOo.gif';
/*/
const LOAD_IMG_URL = 'https://i.imgur.com/zqG5F.gif';
//*/
//ml.assert(!arguments.callee.neverCalled);arguments.callee.neverCalled=true;

const LOAD_IMG = 'url('+LOAD_IMG_URL+')';

//to test: resize image to screen.width and screen.height using canvas and webworkers
//window.screen.width;
//window.screen.height;

function setCss({color='white', img='none'}={}) {
  console.log('set-background', color, img, BG_EL);
  BG_EL.style.backgroundColor=color; //style.background='' => Opera discareds fixed and cover style
  BG_EL.style.backgroundImage=img;
  BG_EL.style['backgroundSize'] = img===LOAD_IMG?'auto':'cover';
}

function setBackground(val) {
  init();
  if( !val ) { setCss(); return; }
  if( setImage(val) ) return;
  if( setGradient(val) ) return;
  setColor(val);
}

function setColor(val) {
  setCss({
    color: val,
  });
}

function setGradient(val){
  if( val.indexOf('gradient')===-1 ) {
    return false;
  }

  setCss({
    img: val,
  });

  return true;
}

let BG_EL;
function init() {
  if( BG_EL ) return;
  BG_EL=document.body;

  //following 2 styles used for auto sized background for loading gif
  BG_EL.style['backgroundRepeat'] = 'no-repeat';
  BG_EL.style['backgroundPosition'] = 'center';
  //fixed because no way found to set BG_EL's size to scroll size of window
  //-http://stackoverflow.com/questions/7540418/css-setting-an-elements-size-to-the-scroll-size-of-the-page
  BG_EL.style['backgroundAttachment'] = 'fixed';
  //make sure size is at least size of window
  BG_EL.style['min-height']='100%';
  BG_EL.style['min-width']='100%';

  //// not needed when backgroundAttachment == fixed
  //BG_EL.style['minHeight']            = '100%';
  //BG_EL.style['minWidth ']            = '100%';
}

function setImage(val) {
  const isURI = val.indexOf('.')!==-1 || /^data:image/.test(val);
  if( !isURI ){
    return false;
  }

  var imgEl=document.createElement('img');
  var loaded;
  imgEl.onload=function() {
    var w=this.width;
    var h=this.height;
    if(w*h>4000000) {
      alert('The provided image has a size of '+w+'*'+h+' pixels. Large images are likely to slow down your machine. Thus only images of maximal 4 000 000 pixels -- e.g. 2500*1600 pixels -- are allowed.');
    }
    else if(img==='url("'+val+'")') {
      img='url("'+val+'")';
      setCss({img});
    }
    loaded=true;
  };
  imgEl.onerror=function() {
    if(img===LOAD_IMG && img==='url("'+val+'")') {
      img='none';
      setCss();
    }
  };

  window.setTimeout(function() {
    if(!loaded && img==='url("'+val+'")') {
      setCss({img: LOAD_IMG});
    }
  }, 50);

  imgEl.src=val;

  return true;
}
