import {getScroll, setScroll, scrollToHideScrollElement, isScrolledToHideScrollElement} from 'tab-utils/pretty_scroll_area';
import {sleep} from 'tab-utils';

export default init_msg_tab;

function init_msg_tab({text, textHidden}) {
  document.body.onload=function()
  {
    maximize();
 // text.focus(); //autofocus doesn't seem to work
  };

  let firstTime = true;
  let lastScroll;
  window.onkeydown = () => {
    scroll_and_block();
    text.focus();
 // lastScroll = getScroll();
    if(firstTime)
    {
      document.getElementById('hint').style.opacity='0';
      text.innerHTML=' '; //text.innerHTML='' makes loses focus, carrent hidden when no text
      firstTime=false;
    }
  };

  /*
  window.onclick = refocus;
  setInterval(refocus, 100);

  window.onfocus = function() {
    text.focus();
  };
  */

  function maximize()
  {
    text.setTextSize(window.innerWidth,window.innerHeight);
    text.style.paddingTop='0px';
    const paddingTop = (
      window.innerHeight/2 -
      parseInt(text.getStyle('height'))/2
    );
    text.style.paddingTop= paddingTop + 'px';
  }
  window.onkeyup=function() {
    // Carret is hidden when no text
    if( ! text.innerHTML ){
      text.innerHTML = '&nbsp;';
    }

    /*
    console.log('pr',textHidden.innerHTML);
    text.innerHTML = textHidden.innerHTML;
    console.log(text.innerHTML);

    console.log('selectionS', textHidden.selectionStart, textHidden.selectionEnd);
    text.selectionStart = textHidden.selectionStart;
    text.selectionEnd = textHidden.selectionEnd;
    */

    scroll_and_block();
    maximize();
    scroll_and_block();

    /*
    if( lastScroll ){
    setScroll(lastScroll);
    lastScroll = null;
    }
    */
  }
  window.onresize=maximize;

  function refocus() {
    requestAnimationFrame(() => {
      text.focus();
      /*
      var l = text.value.length;
      text.selectionStart=l;
      text.selectionStart=l;
      */
    });
  }
}


let block_start;
let is_blocking = false;
async function scroll_and_block() {
  do_scroll();
  requestAnimationFrame(do_scroll);

  block_start = new Date();

  if( is_blocking ) return;

  is_blocking = true;
  while( milliseconds_elapsed_since_block_start() < 100 ){
    await sleep({milliseconds: 10});
    do_scroll();
  }
  is_blocking = false;

  return;

  function milliseconds_elapsed_since_block_start() {
    return get_epoch(new Date()) - get_epoch(block_start);
  }
  function get_epoch(d) {
    return d.getTime();
  }

  function do_scroll() {
    scrollToHideScrollElement({smooth: false});
  }
}
