export default init_msg_tab;

function init_msg_tab({text, container}) {
  document.body.onload=function()
  {
    maximize();
    //no carret on first focus because carret is hidden when no text
    text.focus(); //autofocus doesn't seem to work
  };

  var firstTime=true;
  window.onkeydown = () => {
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
    const textPos = text.getPosition().y;
    const containerPos = text.getPosition().y;
    const paddingTop = (
      window.innerHeight/2 -
      /*
      textPos -
      containerPos -
      */
      parseInt(text.getStyle('height'))/2
    );
    console.log('ppp', {paddingTop, textPos, containerPos});
    text.style.paddingTop= paddingTop + 'px';
  }
  text.onkeyup=function()
  {
    maximize();
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

