import React from 'react';
import {FullView, MorePanel, config} from '../FullViewWrapper';
import './ml.js';
import init_msg_tab from './init_msg_tab';

export default config({
  route: '/msg-tab',
  title: 'Msg Tab',
  view: () => <>
    <FullView>
      <div style={{height: '100vh', paddingRight: 'var(--scroll-bar-width)', backgroundColor: 'red'}}>
        <div id='hint'>type something...</div>
        <div contentEditable='true' id='text'>&nbsp;</div>
      </div>
    </FullView>
    <MorePanel />
  </>,
  onPageLoad: loadWrapper => {
    loadWrapper();
    init_msg_tab();
  },
});
