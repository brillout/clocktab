import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import logoUrl from '../Header/logo.svg';
import './full-view.css';
import on_page_load from './on_page_load';

export {FullView, MorePanel, config};

function FullView({children, ...props}) {
  return <>
    <Header/>

    <div
      className="pretty_scroll_area__hide_scroll_element load-area"
      {...props}
      style={{
        height: '100vh',
        /* This div's `width` is already set to `100vw` because it is children of .pretty_scroll_area
        width: '100vw',
        */
        ...props.style
      }}
    >
      {children}
    </div>

    <div id="screen-buttons-wrapper" className="pretty_scroll_area__absolute_positioned">
      <div className="screen-button glass-background" id="manual-fullscreen">Fullscreen</div>
      <div className="screen-button glass-background" id="manual-scroll">Center</div>
      <div className="screen-button glass-background" id="auto-scroll">&nbsp;</div>
    </div>
  </>;
}

function MorePanel({children}) {
  return (
    <div id="more_panel">
      <div id="more_panel_background" className='glass-background'></div>
      <div id="more_panel_jumper_wrapper">
        <div id="more_panel_jumper" className='glass-background'></div>
      </div>
      {children}
      <Footer/>
    </div>
  );
}

function config(conf) {
  return {
    renderToDom: true,
    renderToHtml: true,
    favicon: logoUrl,
    ...conf,
    on_page_load: () => on_page_load(conf.onPageLoad),
  };
}
