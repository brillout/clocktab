import React from 'react';
import PageWrapper from './PageWrapper';
import logoUrl from '../Header/logo.svg';
import on_page_load from './on_page_load';

export {getPageConfig};

function getPageConfig(View, header, {route, onPageLoad, noHeader, ...pageConfig}={}) {
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
    on_page_load: () => on_page_load(onPageLoad),
    favicon: logoUrl,
    renderToDom: true,
    renderToHtml: true,
    ...pageConfig
  };
};

