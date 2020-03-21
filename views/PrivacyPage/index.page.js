import React from 'react';
import PageWrapper from '../PageWrapper';
import PrivacyPolicyView from './PrivacyPolicyView';

export default getPageConfig();

function getPageConfig() {
  return {
    route: '/privacy-policy',
    title: 'Privacy Policy - Clock Tab',
    view: () => (
      <PageWrapper>
        <PrivacyPolicyView />
      </PageWrapper>
    ),

    renderToDom: true,
    renderToHtml: true,
  };
};
