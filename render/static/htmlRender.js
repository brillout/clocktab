const React = require('react');
const ReactDOMServer = require('react-dom/server');

module.exports = htmlRender;

async function htmlRender({page, initialProps}) {
  const html = (
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(page.view, initialProps)
    )
  );

  return {
    head: [
    ],
    body: [
      '<div id="top_content">'+html+'</div>',
    ]
  };
}
