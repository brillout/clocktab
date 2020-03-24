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
      <div id='text-container'>
        <div id='text' spellCheck="false">&nbsp;</div>
      </div>
    </FullView>
    <MorePanel>
      <UseCases />
    </MorePanel>
  </>,
  onPageLoad: loadWrapper => {
    loadWrapper();
    const text = window.document.getElementById('text');
    text.setAttribute('contentEditable', 'true');
    init_msg_tab({text});
  },
});


function UseCases() {
  return (
    <Center>
      <Title>Msg Tab Use Cases</Title>
      <Item>School - Communicate to students without speaking, e.g. during examination.</Item>
      <Item>Presentation - Audio is not working.</Item>
      <Item>Video Conference - Audio is not working.</Item>
      <Item>At the library - You are forbidden to talk.</Item>
      <Item>For Fun.</Item>
    </Center>
  );
}
function Center({children}) {
  return (
    <div style={{textAlign: 'center', padding: '30px 0'}}>
      <div style={{textAlign: 'left', display: 'inline-block'}}>
        {children}
      </div>
    </div>
  );
}
function Title({children}) {
  return (
    <span style={{
      textDecoration: 'underline',
      fontSize: '1.2em',
      /*
      display: 'block',
      textAlign: 'center',
      */
    }}>
      {children}
    </span>
  );
}
function Item({children}) {
  return <div style={{paddingLeft: 7, marginTop: 5}}>• {children}</div>;
}
