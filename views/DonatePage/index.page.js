import React from 'react';
import PageWrapper from '../PageWrapper';

import DonateView from './DonateView';
import onPageLoad from './onPageLoad';
import './style.css';

export default {
  route: '/donate',
  title: 'Donate - Clock Tab',
  view: () => (
    <PageWrapper>
      <DonateView/>
    </PageWrapper>
  ),

  onPageLoad,

  renderToDom: true,
  renderToHtml: true,
};
