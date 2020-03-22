import React from 'react';
import PageWrapper from './PageWrapper';
import logoUrl from '../Header/logo.svg';

export {getPageConfig};

function getPageConfig(View, header, {route, onPageLoad, noHeader}={}) {
  route = route || '/'+header.toLowerCase().split(' ').join('-');
  const title = header + ' - Clock Tab';

  const view = () => (
    <PageWrapper>
      {!noHeader && <h1>{header}</h1>}
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

