import "./ProductsView.css";
import React from "react";
import { scrollToElement } from "../../../tab-utils/pretty_scroll_area";

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
          text={
            <span>
              USB Clock Fan &mdash; for hot summer days :-).
              <br />
              <br />
            </span>
          }
          link="https://www.amazon.com/gp/product/B010M9KRHO/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=brilloutamazo-20&linkId=37d16e9c32f7c039fca2b3730639d27e"
        />
        <ProductView
          name="product-tablet-monitor"
          text="Tablet monitor, perfect to put Clock Tab on! By a no-name brand but it's well designed."
          link="https://www.amazon.com/UPERFECT-Portable-1920%C3%971080-Raspberry-Cellphone/dp/B07K8JLR4C/ref=as_li_ss_tl?dchild=1&keywords=tablet+monitor+12&qid=1589308273&refinements=p_72:2661618011&rnid=2661617011&sr=8-1&linkCode=ll1&tag=brilloutamazo-20&linkId=375eebbf83f4c1c3758e3975f8c58d05"
        />
        <ProductView
          name="product-vockgeng-clock"
          text="Desk Clock by Vockgeng. Available with many different backgrounds."
          link="https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_tl?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=ll1&tag=brilloutamazo-20&linkId=871192f4426176e2048523b3f9c06038"
        />
      </div>
    </div>
  );
}

function ProductView({ link, text, name }) {
  return (
    <div click-name={name} style={{ width: 250 }}>
      <div>
        <ul style={{ paddingLeft: 20 }}>
          <li>{text}</li>
        </ul>
      </div>
      <div id={name}></div>
      <a className="product-link" href={link} target="_blank"></a>
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
    <a href="https://www.amazon.com/UPERFECT-Portable-1920%C3%971080-Raspberry-Cellphone/dp/B07K8JLR4C/ref=as_li_ss_il?dchild=1&keywords=tablet+monitor+12&qid=1589308273&refinements=p_72:2661618011&rnid=2661617011&sr=8-1&linkCode=li3&tag=brilloutamazo-20&linkId=e8497f14d55d8da11c3cef37e1a85a9a" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07K8JLR4C&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B07K8JLR4C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  `;
  document.querySelector("#product-vockgeng-clock").innerHTML = `
    <a href="https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_il?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=li3&tag=brilloutamazo-20&linkId=3923a336d01beeae2194af92741a399d" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0875WBM2N&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B0875WBM2N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
      `;

  (document.querySelector("#custom-banner") as HTMLElement).onclick = () => {
    scrollToElement(products_section);
  };
}
