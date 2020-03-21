import React from 'react';
import PageWrapper from '../PageWrapper';

export default getPageConfig();

function PageView() {
  return (
    <PageWrapper>
      <h1>Roadmap</h1>
      <ul>
        <li>[Background] Option to set  YouTube live stream as background.</li>
        <li>[Clock] Option to move position of Clock, e.g. in the top left corner.</li>
      </ul>
    </PageWrapper>
  )
}

function getPageConfig() {
  return {
    route: '/roadmap',
    view: PageView,

    title: 'Roadmap - Clock Tab',

    renderToDom: true,
    renderToHtml: true,
  };
};
