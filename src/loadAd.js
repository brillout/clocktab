import ml from './ml';
import removeAd from './removeAd';

export default loadAd;

const AD_SLOTS = [
  {
    slotID: 'div-gpt-ad-1582657330353-0',
    slotName: '/21735472908/CLOCKTAB_leaderboard_ATF_desktop',
    slotSize: [728, 90],
  },
  {
    slotID: 'div-gpt-ad-1582659017480-0',
    slotName: '/21735472908/CLOCKTAB_leaderboard_ATF_mobile',
    slotSize: [320, 50],
  },
];

function loadAd() {
  console.log('load-progress - start loading ad');

  if( removeAd() ){
    console.log('load-progress - ad removed');
    return;
  }

  loadAdsByGoogle();
  loadGoogleTag();
  loadApsTag();

  AD_SLOTS.forEach(({slotID}) => {
    googletag.cmd.push(function() { googletag.display(slotID); });
  });

  setInterval(function () {
    refreshBids({timeout: 2e3});
  }, 90000);
}
function loadAdsByGoogle() {
  const scriptEl = ml.loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  scriptEl.setAttribute('data-ad-client', "ca-pub-3994464140431603");
}


function loadGoogleTag() {
  ml.loadScript("https://securepubads.g.doubleclick.net/tag/js/gpt.js");

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    AD_SLOTS.forEach(({slotID, slotName, slotSize}) => {
      googletag
      .defineSlot(slotName, slotSize, slotID)
      .addService(googletag.pubads());
    });

    googletag.pubads().disableInitialLoad();
    //googletag.pubads().enableSingleRequest();
    googletag.enableServices();

    console.log("load-progress", "ad enabled - 1");
  });
}

function refreshBids(args) {
  apstag.fetchBids(
    {
      slots: AD_SLOTS.map(({slotID, slotName, slotSize}) => {
        return {
          slotID,
          slotName,
          sizes: [slotSize],
        };
      }),
      ...args
    },
    function(bids) {
      // set apstag bids, then trigger the first request to DFP

      // set apstag targeting on googletag then refresh all DFP

      googletag.cmd.push(function() {
          apstag.setDisplayBids();
          googletag.pubads().refresh();
          console.log("load-progress", "ad refreshed");
      });
    }
  );
}

function loadApsTag() {
  !function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");

  apstag.init({
     pubID:  '9f69069e-7132-4170-a8f2-2b572c005f5b',
     adServer: 'googletag',
     bidTimeout: 2e3
  });

  refreshBids();
}


