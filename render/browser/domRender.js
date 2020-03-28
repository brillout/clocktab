import './css/common.css';
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

  try {
    page.on_page_load();
  } catch(err) {
    alert('Something went wrong. Your Clock Tab seems to be broken; click on "Bug Repair" to fix it.');
  }
}
