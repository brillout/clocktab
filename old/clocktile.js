//**************
//generate windows 8 tiles displaying current time with canvas
//**************


(function(){
localStorage = ml.metro&&ml.metro.storage||localStorage;

var DEFAULT_BG = '#0000ff';
var DEFAULT_FG = '#333333';
var getOpt;
var opts={
  'bg'          :{type:'color',default_:DEFAULT_BG},
  'fg'          :{type:'color',default_:DEFAULT_FG},
  'showPeriod'  :{type:'bool',default_:true},
  'isTwelve'    :{type:'bool',default_:true}
};
getOpt=function(opt){
  return localStorage[opt]||opts[opt].default_;
};

function canvasTime(d){
  var canvas = document.createElement('canvas');
  canvas.height=150;
  canvas.width=310;
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = getOpt('bg');
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = getOpt('fg');
  ctx.textAlign = "center";
  ctx.textBaseline = 'middle';
  ctx.font = "bold 50px Arial";
  ctx.fillText(ml.date.readable.getTime('time12',+d),150,75,310);

  return canvas;
}

if(ml.metro){
  console.log(0);
//var lastScheduledTile = parseInt(ml.metro.storage['lastTile'],10) || -1;
  var lastScheduledTile = -1;//console
  var time;
  var base = new Date().setSeconds(0);
  for(var i=0;i<60;i++) {
    time = +(base)+i*60000;
    if(time>lastScheduledTile){
      console.log(1);
      ml.metro.canvas2file(canvasTime(time),time.toString(),function(imageFile){
        console.log(imageFile);
        ml.metro.tile.update(ml.metro.tile.createImg(imageFile),new Date(time+60000),i>0&&(new Date(time)));
      });
    }
  }
  ml.metro.storage['lastTile'] = time;

  if(ml.metro.IS_BG_TASK){close();return;}
  else ml.metro.maintenanceTrigger("sf\\_.js",15);
}


(function(){

  var previewEl = document.getElementById('preview');
  function do_(){
    previewEl.innerHTML='';
    var now = new Date();
    var canvas = canvasTime(now);
    previewEl.appendChild(canvas);
  }
  setInterval(do_,1000);
  do_();

  var optionsEl = document.getElementById('options');
  for(var i in opts){
    var opt = opts[i];
    var optEl = document.createElement('input');
    optEl.setAttribute('type',opt.type==='bool'?'checkbox':(opt.type==='color'?'color':'text'));
    optEl.id=i;
    optEl.value = opt.default_;
    optionsEl.appendChild(optEl);
    //ml.persistantInput(i,changeListener,opt.default_,0,opt.id!=='show_seconds'&&opt.id!=='show_pm'&&opt.id!=='12_hour');
  };
})();

})();
