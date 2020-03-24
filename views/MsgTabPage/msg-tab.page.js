import React from 'react';
import {FullView, MorePanel, config} from '../FullViewWrapper';
import './ml.js';
import './msg-tab.css';
import init_msg_tab from './init_msg_tab';

export default config({
  route: '/msg-tab',
  title: 'Msg Tab',
  view: () => <>
    <FullView id='msg-container'>
      <div id='hint'>Type something...</div>
      <div id='text' spellCheck="false">&nbsp;</div>
    </FullView>
    <MorePanel />
  </>,
  onPageLoad: loadWrapper => {
    loadWrapper();
    const text = window.document.getElementById('text');
    text.setAttribute('contentEditable', 'true');
    init_msg_tab({text});
  },
});
