const React = require('react');
const ReactDOMServer = require('react-dom/server');
const FooterView = require('./FooterView');

module.exports = htmlRender;

async function htmlRender({page, initialProps}) {
  const html = (
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(page.view, initialProps)
    )
  );

  const footerHtml = (
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(FooterView)
    )
  );

  return {
    head: [
    ],
    body: [
      '<div id="top_content">'+html+'</div>',
      footerHtml,
    ]
  };
}
