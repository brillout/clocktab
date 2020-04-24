import { refresh_big_text_size, set_bottom_line } from "../../BigText";
import { track_dom_heart_beat_error } from "../../../tab-utils/views/common/tracker";
import { change_icon } from "../../utils/change_icon";
import {
  get_hours,
  get_minutes,
  get_seconds,
  get_day,
  get_month,
  get_date,
  get_week,
  time_icon,
} from "../../utils/date_utils";

export default load_clock;

export { dom_beat };
function dom_beat(...args) {
  if (!domBeat) return;
  return domBeat(...args);
}
var domBeat;

function load_clock({ get_option_value }) {
  const time_text_el = document.getElementById("time_text");
  const digit1 = document.getElementById("digit1");
  const digit2 = document.getElementById("digit2");

  /* TIME */
  domBeat;
  var spark;
  (function () {
    let lastMinutes, lastTitle, lastDay, lastTime;
    domBeat = function (force: boolean = false) {
      var d = new Date();

      const is_twelve_hour_format = get_option_value(
        "clock_twelve_hour_format"
      );

      var title =
        get_hours(d, is_twelve_hour_format) +
        ":" +
        get_minutes(d) +
        (get_option_value("clock_tab_display_seconds")
          ? ":" + get_seconds(d)
          : "");
      if (lastTitle === undefined || lastTitle !== title || force) {
        lastTitle = title;
        document.title = title;
      }

      var minutes = get_minutes(new Date());
      if (!lastMinutes || lastMinutes !== minutes || force) {
        lastMinutes = minutes;
        change_icon(
          time_icon(
            undefined,
            get_option_value("clock_tab_icon_color"),
            is_twelve_hour_format
          )
        );
      }

      {
        let refreshSize: boolean = false;

        document.body["classList"][d.getHours() < 12 ? "remove" : "add"](
          "isPm"
        );

        var seconds = get_seconds(d);

        digit1.innerHTML = seconds[0];
        digit2.innerHTML = seconds[1];
        //screenshot
        //digit1.innerHTML=0;
        //digit2.innerHTML=0;

        var newTime =
          get_hours(d, is_twelve_hour_format) + ":" + get_minutes(d);
        //var newTime = "&nbsp; 01:37 PM &nbsp;";
        if (lastTime === undefined || lastTime !== newTime || force) {
          lastTime = newTime;
          time_text_el.innerHTML = newTime;
          //screenshot
          //time_text_el.innerHTML = '01:37';
          refreshSize = true;
        }

        var day = d.getDay();
        if (!lastDay || lastDay !== day || force) {
          lastDay = day;
          const date_text = get_option_value("clock_display_date")
            ? get_day(d) +
              " - " +
              get_month(d) +
              " " +
              get_date(d) +
              (get_option_value("clock_display_week")
                ? " - Week " + get_week(d)
                : "")
            : "";
          set_bottom_line(date_text);
          refreshSize = true;
        }
        if (refreshSize) refresh_big_text_size();
      }
    };

    spark = function () {
      (function repeater() {
        track_dom_heart_beat_error(() => {
          domBeat();
        });
        window.setTimeout(repeater, 1000);
      })();
    };
  })();

  spark();
}
