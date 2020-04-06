import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    Paste your bug fix (that Romuald provided you):

    <textarea id="settings-data-input" style={{width: '100%', minHeight: '50vh'}} />
    <br/>

    <button id="apply-fix">Apply Fix</button>
    <br/>
    <br/>

    Result:
    <pre id="result" style={{margin: 0}} />
  </>,
  'Bug Fix',
  {onPageLoad},
);

function onPageLoad() {
  const apply_fix = document.querySelector('#apply-fix');
  const settings_data_input = document.querySelector('#settings-data-input');
  const result = document.querySelector('#result');

  apply_fix.onclick = replace_db;

  return;

  function replace_db() {
    result.innerHTML = '';

    let db;
    try {
      db = JSON.parse(settings_data_input.value);
    } catch(err) {
      result.innerHTML = err;
      return;
    }

    window.localStorage.clear();
    Object.keys(db).forEach(key => {
      window.localStorage[key] = db[key];
    });

    result.innerHTML = 'Success!';
  }
}
