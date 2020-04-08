import React from 'react';
import {getPageConfig} from '../PageWrapper';
import './world-clock-wrapper.css';
//import * as ifr from 'iframe-resizer';
import {iframeResize} from 'iframe-resizer';

export default getPageConfig(
  () => <>
    <iframe id="content-frame" src="/world-clock-content/"/>
  </>,
  'World Clock',
  {
    onPageLoad,
    noHeader: true,
  },
);

function onPageLoad() {
  iframeResize({
    /*
    log: true,
    heightCalculationMethod: 'lowestElement',
    */
    heightCalculationMethod: 'taggedElement',
  }, '#content-frame');

  /*
  const iframe = document.querySelector('iframe#content-frame');

  iframe.onload = () => {
    const iframeBody = iframe.contentWindow.document.body;

    const observer = new MutationObserver((...args) => {
      console.log(...args);
    });

    observer.observe(iframeBody, {attributes: true, characterData: true, childList: true, subtree: true});

    loop();

    function loop() {
      resizeIframe();
      setTimeout(loop, 5000);
    }

    function resizeIframe() {
      const height = iframeBody.scrollHeight + 'px';
      console.log('r', height);
      iframe.style.height = height;
    }
  };
  */
}
