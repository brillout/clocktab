import './css/more_panel';
import React from 'react';
import ReactDOM from 'react-dom';
import more_panel from 'tab-utils/more_panel';
import loadAnalytics from './js/loadAnalytics';

export default domRender;

async function domRender({page, initialProps, CONTAINER_ID}) {
  /*
  const element = React.createElement(page.view, initialProps);
  const container = document.getElementById(CONTAINER_ID);
  if( page.renderToHtml ){
    ReactDOM.hydrate(element, container);
  } else {
    ReactDOM.render(element, container);
  }
  */

  page.onPageLoad(loadCommon);
}

function loadCommon() {
  more_panel();

  document.documentElement.classList.remove('hideApp');

  loadAnalytics();
}
