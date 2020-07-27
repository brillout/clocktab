import { dom_beat } from "./load_clock";
import { refresh_big_text_size } from "../../BigText";
import PRESETS from "./PRESETS";
import { TabSettings } from "../../../tab-utils/TabSettings";
import { set_text_position } from "../../BigText";
import { preset_concept_name } from "./preset_concept_name";
import { is_dark_mode } from "../../../tab-utils/utils/system-preferences";

export default init_clock_options;

function init_clock_options() {
  const text_container = document.getElementById("clock-container");

  const tab_settings = new TabSettings({
    option_spec_list: get_option_list(),
    preset_spec_list: PRESETS,
    text_container,
    on_any_change,
    on_font_change,
    enable_import_export: true,
    subapp_id: "clock",
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
      dom_beat(true);
      refresh_big_text_size();
    }
  }

  function update_options() {
    text_container.style.color = get_option_value("clock_color");
    text_container.style.textShadow = get_option_value("clock_shadow");
    {
      const show_seconds = get_option_value("clock_display_seconds");
      document.body["classList"][show_seconds ? "remove" : "add"]("noSeconds");
    }

    {
      const show_pm = get_option_value("clock_display_period");
      const twelve_hour = get_option_value("clock_twelve_hour_format");
      document.body["classList"][show_pm && twelve_hour ? "remove" : "add"](
        "noPeriod"
      );
    }
    set_text_position(get_option_value("clock_position"));
  }
}

function get_option_list() {
  return [
    {
      option_id: "clock_theme",
      option_type: "preset-input",
      // option_description: preset_concept_name,
      option_default: "steel",
    },
    {
      option_id: "clock_background_image",
      option_type: "background-image-input",
      option_description: "Background image",
      option_default: "",
      option_placeholder: "image url",
      is_creator_option: true,
    },
    {
      option_id: "clock_background_color",
      option_type: "background-color-input",
      option_description: "Background color",
      option_default: "#ffffff",
      is_creator_option: true,
    },
    {
      option_id: "clock_font",
      option_type: "text-font-input",
      option_description: "Clock font",
      option_default: "Josefin Slab",
      is_creator_option: true,
    },
    {
      option_id: "clock_shadow",
      option_type: "text-shadow-input",
      option_description: "Font shadow",
      option_default: "",
      option_placeholder: "see css text-shadow",
      input_width: "110px",
      is_creator_option: true,
    },
    {
      option_id: "clock_color",
      option_type: "text-color-input",
      option_description: "Clock color",
      option_default: "#2c2c2c",
      is_creator_option: true,
    },
    {
      option_id: "clock_size",
      option_type: "text-input",
      option_description: "Clock size",
      option_default: "580",
      input_width: "40px",
      is_creator_option: true,
    },
    {
      option_id: "clock_position",
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
      option_description: "Clock position",
      option_default: "center",
      is_creator_option: true,
    },
    {
      option_id: "clock_twelve_hour_format",
      option_type: "boolean-input",
      option_description: "12-hour",
      option_default: get_default_12_hour(),
    },
    {
      option_id: "clock_display_period",
      option_type: "boolean-input",
      option_description: "am/pm",
      option_default: true,
      option_dependency: "clock_twelve_hour_format",
    },
    {
      option_id: "clock_display_seconds",
      option_type: "boolean-input",
      option_description: "Seconds",
      option_default: true,
    },
    {
      option_id: "clock_display_date",
      option_type: "boolean-input",
      option_description: "Date",
      option_default: true,
    },
    {
      option_id: "clock_display_week",
      option_type: "boolean-input",
      option_description: "Week",
      option_default: false,
      option_dependency: "clock_display_date",
    },
    {
      option_id: "clock_tab_display_seconds",
      option_type: "boolean-input",
      option_description: "Tab title seconds",
      option_default: false,
    },
    {
      option_id: "clock_tab_icon_color",
      option_type: "color-input",
      option_description: "Tab icon color",
      option_default: get_default_tab_icon_color(),
    },
  ];
}

function get_default_tab_icon_color() {
  return is_dark_mode() ? "#ffffff" : "#373a4a";
}

function get_default_12_hour() {
  return (
    /(AM)|(PM)/.test(new Date().toLocaleTimeString()) ||
    window.navigator.language === "en-US"
  );
}
