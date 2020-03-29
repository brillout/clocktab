import React from 'react';
import {getPageConfig} from '../PageWrapper';
import Bowser from "bowser";

export default getPageConfig(
  () => <>
    <p>
    Your Clock Tab does not work? Click <a id='repair-link' data-subject="Bug Repair" className="contact-address" target="_blank">here</a>.
    </p>
    <p>
    You will get a response ASAP.
    </p>
    <p>
    Alternatively, you can describe your problem at <a data-subject="Bug" className="contact-address" target="_blank"></a>.
    </p>

    <br/>
    Your browser:
    <pre id="browser-spec" style={{margin: 0}}/>

    <br/>
    Your settings:
    <pre id="setting-spec" style={{margin: 0, wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}/>
  </>,
  'Bug Repair',
  {onPageLoad},
);

function onPageLoad() {
  const link = document.querySelector('#repair-link');

  const browser_spec = getBrowser();
  const setting_spec = getSettings();

  link.setAttribute('data-body', [
    "Hi Romuald, my Clock Tab doesn't work.",
    '',
    'My Browser:',
    browser_spec,
    '',
    'My Settings:',
    setting_spec,
    '',
    'Thanks for having a look!',
  ].join('\n'));

  document.querySelector('#browser-spec').innerHTML = browser_spec;
  document.querySelector('#setting-spec').innerHTML = setting_spec;
}

function getBrowser() {
  const browser = Bowser.getParser(window.navigator.userAgent);
  return JSON.stringify(browser.getBrowser(), null, 2);
}

function getSettings() {
  return JSON.stringify(window.localStorage, null, 2);
}
