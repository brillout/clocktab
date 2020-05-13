import "./ProductsView.css";

import React from "react";

export { load_product_view };

export { ProductsView };

function ProductsView() {
  return (
    <div
      id="products-section"
      style={{ display: "none" }}
      className="more_panel_block"
    >
      <div className="more_panel_block_title">Products</div>
      <div id="product-list">
        <ProductView
          name="product-clock-fan"
          text="USB Clock Fan &mdash; for hot summer days :-)."
          link="https://www.amazon.com/gp/product/B010M9KRHO/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=brilloutamazo-20&linkId=37d16e9c32f7c039fca2b3730639d27e"
        />
        <ProductView
          name="product-tablet-monitor"
          text="Tablet monitor, perfect to put Clock Tab on."
          link="https://www.amazon.com/Portable-Monitor-Computer-1920%C3%971080-Protector/dp/B07RGPCQG1/ref=as_li_ss_tl?dchild=1&keywords=lepow&qid=1588966606&sr=8-1&linkCode=ll1&tag=brilloutamazo-20&linkId=f7c74ebde53387fe5b4e8bd97f5ba559"
        />
        <ProductView
          name="product-vockgeng-clock"
          text="Desk Clock by Vockgeng, with background."
          link="https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_tl?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=ll1&tag=brilloutamazo-20&linkId=871192f4426176e2048523b3f9c06038"
        />
      </div>
    </div>
  );
}

function ProductView({ link, text, name }) {
  return (
    <div data-click-name={"[" + name + "]"} style={{ width: 250 }}>
      <div>
        <ul style={{ paddingLeft: 20 }}>
          <li>{text}</li>
        </ul>
      </div>
      <div id={name}></div>
      <a className="product-link" href={link}></a>
    </div>
  );
}

function load_product_view() {
  const products_section = document.querySelector("#products-section");
  (products_section as HTMLElement).style.display = "";

  document.querySelector("#product-clock-fan").innerHTML = `
    <a target="_blank" href="https://www.amazon.com/gp/product/B010M9KRHO/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B010M9KRHO&linkCode=as2&tag=brilloutamazo-20&linkId=433159f0067b4ff9142cc0acaad6ed63"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B010M9KRHO&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=brilloutamazo-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=am2&o=1&a=B010M9KRHO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  `;

  document.querySelector("#product-tablet-monitor").innerHTML = `
    <a href="https://www.amazon.com/Portable-Monitor-Computer-1920%C3%971080-Protector/dp/B07RGPCQG1/ref=as_li_ss_il?dchild=1&keywords=lepow&qid=1588966606&sr=8-1&linkCode=li3&tag=brilloutamazo-20&linkId=277061cf2fe45f339307d412e9264e10" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07RGPCQG1&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B07RGPCQG1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  `;
  document.querySelector("#product-vockgeng-clock").innerHTML = `
    <a href="https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_il?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=li3&tag=brilloutamazo-20&linkId=3923a336d01beeae2194af92741a399d" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0875WBM2N&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B0875WBM2N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  `;
}
