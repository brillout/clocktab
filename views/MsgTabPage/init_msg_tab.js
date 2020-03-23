import {getScroll, setScroll} from 'tab-utils/pretty_scroll_area';

export default init_msg_tab;

function init_msg_tab({text}) {
  document.body.onload=function()
  {
    maximize();
    text.focus(); //autofocus doesn't seem to work
  };

  let firstTime = true;
  let lastScroll;
  window.onkeydown = () => {
    lastScroll = getScroll();
    if(firstTime)
    {
      document.getElementById('hint').style.opacity='0';
      text.innerHTML=' '; //text.innerHTML='' makes loses focus, carrent hidden when no text
      firstTime=false;
    }
  };

  window.onclick = refocus;
  setInterval(refocus, 100);

  window.onfocus = function() {
    text.focus();
  };

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
  text.onkeyup=function() {
    // Carret is hidden when no text
    if( ! text.innerHTML ){
      text.innerHTML = '&nbsp;';
    }

    maximize();
    if( lastScroll ){
    setScroll(lastScroll);
    lastScroll = null;
    }
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

