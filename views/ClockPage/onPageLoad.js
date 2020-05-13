import load_clock from "./js/load_clock";
import init_clock_options from "./js/init_clock_options";
import auto_remove_hash from "../../tab-utils/auto_remove_hash";
import { on_big_text_load, set_max_width_getter } from "../BigText";
import { sleep } from "../../tab-utils/sleep";
import { ad_slots } from "./ad_slots";
import { load_ads } from "../../tab-utils/load_ad";
import { load_product_view } from "./Products/ProductsView";

export default onPageLoad;

async function onPageLoad(load_common) {
  const { get_option_value, font_loaded_promise } = init_clock_options();

  set_max_width_getter(() => get_option_value("clock_size"));

  load_clock({ get_option_value });

  on_big_text_load();

  auto_remove_hash();

  await Promise.race([font_loaded_promise, sleep({ seconds: 0.4 })]);

  load_common();

  load_ads(ad_slots);

  load_product_view();

  // To avoid memory leak
  //autoReloadPage();
}
