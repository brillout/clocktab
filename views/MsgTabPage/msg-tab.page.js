import React from 'react';
import {getPageConfig} from '../PageWrapper';
import './_.js';
import init_msg_tab from './init_msg_tab';

export default getPageConfig(
  () => <>
    <div id='hint'>type something...</div>
    <div contentEditable='true' id='text'>&nbsp;</div>
  </>,
  'Msg Tab',
  {
    noHeader: true,
    onPageLoad: () => { init_msg_tab() },
  }
);
