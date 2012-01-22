    /*
      var fontChanger;
      ml.loadScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',function()
      //{{{
      {
        fontChanger=function(el,fontName,callback)
        {
          window['WebFont']['load']({'google':{'families':[fontName]},'active':function()
          {
            setTimeout(function()
            {
              el.style.fontFamily=fontName;
              if(callback)callback();
            },100);
          }});
        };
        setFont(document.getElementById('options'),'Arvo');
        refreshFont();
      });
      //}}}
      function setFont(){if(fontChanger) fontChanger.apply(null,arguments)};
      refreshFont=function(){setFont(document.body,getOpt('font'),setSize)};
    */


      /*
      if(ml.browser().usesGecko)
      {
        document.getElementById('time').style.cursor='default';
        return;
      }
      function bigger()
      //{{{
      {
        //document.body.webkitRequestFullScreen();
        //timeEl.style.marginTop='0px';
        //timeEl.style.marginTop=window.innerHeight/2-timeEl.getPosition().y
        //                    -parseInt(ml.element.getStyle(timeEl,'height'))/2
        //                    +'px';
        document.documentElement['classList'].add('big');
        setSize();
      }
      //}}}
      function unbigger()
      //{{{
      {
        //timeEl.style.marginTop='0px';
        document.documentElement['classList'].remove('big');
        setSize();
      }
      //}}}
      ml.fullscreenElement(bigger,unbigger,[document.getElementById('time')],'f');
      */




//on disable feature for installed app: https://developer.mozilla.org/en/Apps/Apps_JavaScript_API
/*
if(ml.browser().usesGecko)
{
  document.documentElement.innerHTML='';
  function alert(msg)
  {
    document.documentElement.innerHTML+=JSON.stringify(msg)+"<br>";
  }
  alert('alert working');
  if(window['navigator']['mozApps'] && window['navigator']['mozApps']['getSelf'])
  {
    var keys=[];
    for(var i in window['navigator']['mozApps']) keys.push(i);
    alert(keys);
    alert(window['navigator']['mozApps']);
    window['navigator']['mozApps']['getSelf']()       ['onsuccess']=function(){alert(this['result'])};
    window['navigator']['mozApps']['getInstalled']()  ['onsuccess']=function(){alert(this['result'])};
    window['navigator']['mozApps']['mgmt']['getAll']()['onsuccess']=function(){alert(this['result'])};
  }
  else alert("not passed");
  //on disable feature for installed app: https://developer.mozilla.org/en/Apps/Apps_JavaScript_API
  document.getElementById('time').style.cursor='default';
  return;
}
*/




  function setSize(){
    if(document.documentElement['classList'].contains('big'))
    {
      setTextSize(timeEl,window.innerWidth,window.innerHeight);
      return;
    }
html.big #top,
html.big #date
{
  display: none;
  height: 0px !important;
}
html.big #content_padding
{
  height: 10%;
}





      /* canvas -> tile
          var c = document.createElement('canvas');
          var ctx = c.getContext("2d");
          var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
          grd.addColorStop(0, "red");
          grd.addColorStop(1, "black");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, 512, 512);


          //Save blob to image
          var blob = c.msToBlob();
          var out = null;
          var blobStream = null;
          var outputStream = null;

          Windows.Storage.ApplicationData.current.localFolder.createFileAsync("picture.png", Windows.Storage.CreationCollisionOption.replaceExisting)
              .then(function (file) {
                  return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
              })
              .then(function (stream) {
                  outputStream = stream;
                  out = stream.getOutputStreamAt(0);
                  blobStream = blob.msDetachStream();
                  return Windows.Storage.Streams.RandomAccessStream.copyAsync(blobStream, out);
              })
              .then(function () {
                  return out.flushAsync();
              })
              .done(function () {
                  blobStream.close();
                  out.close();
                  outputStream.close();

                  //Do tile update
                  var notifications = Windows.UI.Notifications;
                  var template = notifications.TileTemplateType.tileSquareImage;
                  var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

                  var tileImageAttributes = tileXml.getElementsByTagName("image");
                  tileImageAttributes[0].setAttribute("src", "ms-appdata:///local/picture.png");

                  var tileNotification = new notifications.TileNotification(tileXml);
                  notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
              });
      */




    (function clock(){
      return;
      var d = new Date();
      var time = d.getHoursReadable(true) + ":" +d.getMinutesReadable()+' '+(d.getHours()<12?'AM':'PM');
      var day  = d.getDayReadable();
      var date = d.getMonthReadable() + " "+ d.getDateReadable();
      var expire_ = new Date(new Date().getTime()+60000);
      tile.update(tile.create(time,day,date),expire_);
      setTimeout(clock,1000*60);
    })();
