import './page-wrapper.css';

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default PageWrapper;

function PageWrapper({children}) {
  return <>
    <Header/>
    <div id="page-wrapper">
      {children}
    </div>
    <Footer/>
  </>;
}

