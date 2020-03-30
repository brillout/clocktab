import './css/common.css';
import {start_tracking, track_error, setup_error_handlers} from '../../views/common/google_analytics';
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
    setup_error_handlers();
    page.on_page_load();
  } catch(err) {
    on_error(err);
  }
}

function on_error(err) {
  console.error(err);

  start_tracking();
  track_error(err);

  // Timeout to ensure event tracking happened.
  setTimeout(() => {
    alert('Something went wrong. Your Clock Tab seems to be broken; click on "Bug Repair" in the footer below to fix the problem.');
  }, 2000);
}
