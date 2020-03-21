import React from 'react';
import PageWrapper from './PageWrapper';
import logoUrl from '../Header/logo.svg';

export {getPageConfig};

function getPageConfig(View, titleMain, {route, onPageLoad}={}) {
  route = route || '/'+titleMain.toLowerCase().split(' ').join('-');
  const title = titleMain + ' - Clock Tab';

  const view = () => (
    <PageWrapper>
      <View />
    </PageWrapper>
  );

  return {
    view,
    route,
    title,
    onPageLoad,
    favicon: logoUrl,
    renderToDom: true,
    renderToHtml: true,
  };
};

