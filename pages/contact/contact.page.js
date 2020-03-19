import React from 'react';
import '../content_page.css';
import ContactView from './ContactView.js';
import onPageLoad from './onPageLoad.js';

export default {
  route: '/',
  view: ContactView,

  title: 'Contact - Clock Tab',

  onPageLoad,

  renderToDom: true,
  renderToHtml: true,
};


