export { change_icon };

let favicon_dom_el;

function change_icon(url) {
  if (!favicon_dom_el) {
    var REL = "icon";
    var REL2 = "shortcut icon";

    var oldlinks = document.getElementsByTagName("link");
    for (var i = 0; i < oldlinks.length; i++)
      if ([REL, REL2].includes(oldlinks[i].getAttribute("rel").toLowerCase()))
        document.head.removeChild(oldlinks[i]);

    favicon_dom_el = document.createElement("link");
    favicon_dom_el.rel = REL;
    favicon_dom_el.type = "image/png"; //needed for webkit dynamic favicon
    document.head.appendChild(favicon_dom_el);
  }
  favicon_dom_el.href = url;
}
