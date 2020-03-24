import {setScroll, scrollToHideScrollElement} from 'tab-utils/pretty_scroll_area';
import {sleep} from 'tab-utils/sleep';
import assert from '@brillout/assert';

export default init_msg_tab;

function init_msg_tab({text}) {
  document.body.onload=function() {
    maximize();
    do_focus(); // autofocus doesn't seem to work
    scroll_to_top();
  };

  window.onclick = do_focus;
  /*
  setInterval(do_focus, 100);
  */
  window.onfocus = function() {
    do_focus();
  };

  function maximize() {
    text.setTextSize(window.innerWidth,window.innerHeight);
    text.style.paddingTop='0px';
    const paddingTop = (
      window.innerHeight/2 -
      parseInt(text.getStyle('height'))/2
    );
    text.style.paddingTop= paddingTop + 'px';
  }

  const EMPTY_FILLER = '&nbsp;';
  let previousText = text.innerHTML;
  window.oninput=function() {
    const currentText = text.innerHTML;

    if( currentText===previousText ) return;

    // Carret is hidden when no text
    if( currentText==='' ) {
      text.innerHTML = EMPTY_FILLER;
      set_carret_position(0);
    }

    // Remove trailing EMPTY_FILLER
    if( previousText===EMPTY_FILLER && currentText.endsWith(EMPTY_FILLER) && currentText.length === previousText.length+1 ){
      const currentText__mod = currentText.slice(0, currentText.length - EMPTY_FILLER.length);
      assert(currentText__mod.length===1);
      text.innerHTML = currentText__mod;
      set_carret_position(1);
    }

    document.getElementById('hint').style.opacity = currentText.replace(/\s/g, '').length===0?'1':'0';

    scroll_and_block();
    maximize();
    scroll_and_block();
  }
  window.onresize=maximize;

  function do_focus() {
    text.focus();
    requestAnimationFrame(() => {
      text.focus();
      /*
      var l = text.value.length;
      text.selectionStart=l;
      text.selectionStart=l;
      */
    });
  }

  function set_carret_position(pos) {
    const sel = window.getSelection();
    var range = document.createRange();
    range.setStart(text, pos);
    range.setEnd(text, pos);
    sel.removeAllRanges();
    sel.addRange(range);
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

function scroll_to_top() {
  do_top_scroll();
  setTimeout(do_top_scroll, 10);

  function do_top_scroll() {
    setScroll(0);
    requestAnimationFrame(() => setScroll(0));
  }
}
