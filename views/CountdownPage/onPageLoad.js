import { sleep } from "../../tab-utils/sleep";
import { on_big_text_load, set_max_width_getter } from "../BigText";
import init_countdown_options from "./init_countdown_options";
import { start_countdown } from "./set_countdown";

export default onPageLoad;

async function onPageLoad(load_common) {
  const { get_option_value, font_loaded_promise } = init_countdown_options();

  set_max_width_getter(() => get_option_value("countdown_size"));

  start_countdown({ get_option_value });

  on_big_text_load();

  await Promise.race([font_loaded_promise, sleep({ seconds: 0.4 })]);

  load_common();
}
