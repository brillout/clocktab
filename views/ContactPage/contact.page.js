import React from 'react';
import ContactView from './ContactView.js';
import onPageLoad from './onPageLoad.js';

export default {
  route: '/contact',
  view: ContactView,

  title: 'Contact - Clock Tab',

  onPageLoad,

  renderToDom: true,
  renderToHtml: true,
};

