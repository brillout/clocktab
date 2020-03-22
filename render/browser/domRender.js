import loadCommon from './js/common.js';
/*
import React from 'react';
import ReactDOM from 'react-dom';
*/

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

  if( !page.onPageLoad ){
    loadCommon();
  } else {
    let loadCommon_called = false;
    page.onPageLoad(() => {loadCommon_called = true; loadCommon();});
    if( !loadCommon_called ){
      loadCommon();
    }
  }
}
