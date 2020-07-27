import { refresh_big_text_size } from "../BigText";
import { TabSettings } from "../../tab-utils/TabSettings";
import { dom_beat } from "./set_countdown";
import PRESETS from "./PRESETS";
import { set_text_position } from "../BigText";
import { preset_concept_name } from "./preset_concept_name";

export default init_clock_options;

function init_clock_options() {
  const text_container = document.getElementById("countdown-container");

  const tab_settings = new TabSettings({
    option_spec_list: get_option_list(),
    preset_spec_list: PRESETS,
    text_container,
    on_any_change,
    on_font_change,
    no_random_preset: true,
    enable_import_export: true,
    subapp_id: "countdown",
    preset_concept_name,
  });

  const get_option_value = tab_settings.get_option_value.bind(tab_settings);
  const { font_loaded_promise } = tab_settings;

  tab_settings.generate_dom();

  return { get_option_value, font_loaded_promise };

  function on_font_change() {
    refresh_big_text_size();
  }
  function on_any_change({ is_initial_run }) {
    update_options();
    if (!is_initial_run) {
      dom_beat();
      refresh_big_text_size();
    }
  }

  function update_options() {
    text_container.style.color = get_option_value("countdown_color");
    text_container.style.textShadow = get_option_value("countdown_shadow");
    set_text_position(get_option_value("countdown_position"));
  }
}

function get_option_list() {
  return [
    {
      option_id: "countdown_preset",
      option_type: "preset-input",
      // option_description: preset_concept_name,
      option_default: "christmas",
    },
    {
      option_id: "countdown_date",
      option_type: "date-input",
      option_description: "Date",
      option_default: getNextDay(),
      is_creator_option: true,
    },
    {
      option_id: "countdown_title",
      option_type: "text-input",
      option_description: "Title",
      option_default: "Until %date",
      is_creator_option: true,
    },

    {
      option_id: "countdown_position",
      option_type: "choice-input",
      option_choices: [
        "top-left",
        "top",
        "top-right",
        "center-left",
        "center",
        "center-right",
        "bottom-left",
        "bottom",
        "bottom-right",
      ],
      option_description: "Countdown position",
      option_default: "bottom",
      is_creator_option: true,
    },

    {
      option_id: "countdown_font",
      option_type: "text-font-input",
      option_description: "Font",
      option_default: "Roboto",
      is_creator_option: true,
    },
    {
      option_id: "countdown_color",
      option_type: "text-color-input",
      option_description: "Font color",
      option_default: "#2c2c2c",
      is_creator_option: true,
    },
    {
      option_id: "countdown_shadow",
      option_type: "text-shadow-input",
      option_description: "Font shadow",
      option_default: "",
      option_placeholder: "see css text-shadow",
      is_creator_option: true,
    },
    {
      option_id: "countdown_size",
      option_type: "text-input",
      option_description: "Countdown size",
      option_default: "380",
      is_creator_option: true,
    },
    {
      option_id: "countdown_background_color",
      option_type: "background-color-input",
      option_description: "Background color",
      option_default: "#ffffff",
      is_creator_option: true,
    },
    {
      option_id: "countdown_background_image",
      option_type: "background-image-input",
      option_description: "Background image",
      option_default: "",
      option_placeholder: "image url",
      is_creator_option: true,
    },
  ];
}

function getNextDay() {
  const d = new Date(new Date() /* + 60*1000*/);
  d.setHours(24, 0, 0, 0);
  return d;
}
