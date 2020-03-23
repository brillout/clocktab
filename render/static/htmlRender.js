const React = require('react');
const ReactDOMServer = require('react-dom/server');

module.exports = htmlRender;

async function htmlRender({page, initialProps, CONTAINER_ID}) {
  const html = (
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(page.view, initialProps)
    )
  );

  return {
    body: [
      '<div id="'+CONTAINER_ID+'" class="pretty_scroll_area__content_container">'+html+'</div>',
    ]
  };
}
