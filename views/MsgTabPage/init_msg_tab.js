export default init_msg_tab;

function init_msg_tab() {
  var text =document.getElementById('text');

  document.body.onload=function()
  {
    maximize();
    //no carret on first focus because carret is hidden when no text
    text.focus(); //autofocus doesn't seem to work
  };

  var firstTime=true;
  window.onkeydown=function()
  {
    text.focus();
    if(firstTime)
    {
      document.getElementById('hint').style.opacity='0';
      text.innerHTML=' '; //text.innerHTML='' makes loses focus, carrent hidden when no text
      firstTime=false;
    }
    /*
    var l = text.value.length;
    text.selectionStart=l;
    text.selectionStart=l;
    */
  };

  window.onfocus=function()
  {
    text.focus();
  };

  function maximize()
  {
    text.setTextSize(window.innerWidth,window.innerHeight);
                text.style.marginTop='0px';
                text.style.marginTop=window.innerHeight/2-text.getPosition().y
                                    -parseInt(text.getStyle('height'))/2
                                    +'px';
  }
  text.onkeyup=function()
  {
    maximize();
  }
  window.onresize=maximize;
}
