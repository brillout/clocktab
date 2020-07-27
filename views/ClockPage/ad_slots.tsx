import monitor_banner_img from "./monitor-banner-ct.png";
import React from "react";

export { ad_slots };

const ad_slots = [
  /*
  {
    // ct_atf_responsive
    slot_id: "8079958663",
    slot_name: "ATF",
    is_adsense: true,
  },
  {
    // ct_btf_responsive
    slot_id: "9556691865",
    slot_name: "BTF",
    is_adsense: true,
  },
  */
  {
    // ct_left_atf
    slot_id: "7889725703",
    slot_name: "LEFT_AD_ATF",
    is_adsense: true,
  },
  {
    // ct_left_btf
    slot_id: "1075920200",
    slot_name: "LEFT_AD_BTF",
    is_adsense: true,
  },
  {
    img_src: monitor_banner_img,
    click_name: "monitor_banner",
    slot_name: "LEFT_AD_ATF",
    is_custom: true,
  },
  {
    product_name: "product-clock-fan",
    product_text: (
      <span>
        USB Clock Fan &mdash; for hot summer days :-).
        <br />
        <br />
      </span>
    ),
    amazon_banner: `
      <a target="_blank" href="https://www.amazon.com/gp/product/B010M9KRHO/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B010M9KRHO&linkCode=as2&tag=brilloutamazo-20&linkId=433159f0067b4ff9142cc0acaad6ed63"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B010M9KRHO&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=brilloutamazo-20" ></a><img src="//ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=am2&o=1&a=B010M9KRHO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    `,
    product_link:
      "https://www.amazon.com/gp/product/B010M9KRHO/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=brilloutamazo-20&linkId=37d16e9c32f7c039fca2b3730639d27e",
    is_product: true,
  },
  {
    product_name: "product-tablet-monitor",
    product_text:
      "Tablet monitor, perfect to put Clock Tab on! No-name brand but the monitor is well designed.",
    amazon_banner: `
      <a href="https://www.amazon.com/UPERFECT-Portable-1920%C3%971080-Raspberry-Cellphone/dp/B07K8JLR4C/ref=as_li_ss_il?dchild=1&keywords=tablet+monitor+12&qid=1589308273&refinements=p_72:2661618011&rnid=2661617011&sr=8-1&linkCode=li3&tag=brilloutamazo-20&linkId=e8497f14d55d8da11c3cef37e1a85a9a" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07K8JLR4C&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B07K8JLR4C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    `,
    product_link:
      "https://www.amazon.com/UPERFECT-Portable-1920%C3%971080-Raspberry-Cellphone/dp/B07K8JLR4C/ref=as_li_ss_tl?dchild=1&keywords=tablet+monitor+12&qid=1589308273&refinements=p_72:2661618011&rnid=2661617011&sr=8-1&linkCode=ll1&tag=brilloutamazo-20&linkId=375eebbf83f4c1c3758e3975f8c58d05",
    is_product: true,
  },
  {
    product_name: "product-vockgeng-clock",
    product_text:
      "Desk Clock by Vockgeng. Available with many different backgrounds.",
    amazon_banner: `
    <a href="https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_il?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=li3&tag=brilloutamazo-20&linkId=3923a336d01beeae2194af92741a399d" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0875WBM2N&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=brilloutamazo-20" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=brilloutamazo-20&l=li3&o=1&a=B0875WBM2N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    `,
    product_link:
      "https://www.amazon.com/Vockgeng-Sunflower-Charging-Function-6-2x3-8x0-9/dp/B0875WBM2N/ref=as_li_ss_tl?dchild=1&keywords=Vockgeng+clock&qid=1589231158&sr=8-23&th=1&linkCode=ll1&tag=brilloutamazo-20&linkId=871192f4426176e2048523b3f9c06038",
    is_product: true,
  },
];
