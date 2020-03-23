import React from 'react';
import {FullView, MorePanel, config} from '../FullViewWrapper';
//import './_.js';
//import init_msg_tab from './init_msg_tab';

export default config({
  route: '/msg-tab',
  title: 'Msg Tab',
  view: () => <>
    <FullView>
      <div style={{height: '100vh', backgroundColor: 'red'}}>
        bla
      </div>
    </FullView>
    <MorePanel />
  </>,
 // onPageLoad: () => { init_msg_tab() },
});
    /*
    <div id='hint'>type something...</div>
    <div contentEditable='true' id='text'>&nbsp;</div>
    */
