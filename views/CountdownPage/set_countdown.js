import { refresh_big_text_size, set_bottom_line } from "../BigText";

export { start_countdown };
export { dom_beat };

let get_option_value;
function start_countdown({ get_option_value: _get_option_value }) {
  get_option_value = _get_option_value;
  ignite_beat();
}

function dom_beat() {
  const top_text = document.querySelector("#top-text");
  const center_text = document.querySelector("#center-text");

  const countdown_date = new Date(get_option_value("countdown_date"));

  let countdown_title = get_option_value("countdown_title");
  countdown_title = countdown_title.replace(
    "%date",
    new Date().toLocaleDateString()
  );

  const now = new Date();
  const { time_major, time_minor } = format(countdown_date - now);

  update_tab_title({ time_major, countdown_title });

  center_text.textContent = time_major;
  top_text.textContent = countdown_title;
  set_bottom_line(time_minor);
  refresh_big_text_size();
}

function update_tab_title({ time_major, countdown_title }) {
  let title = time_major;
  if (countdown_title) {
    title += " - " + countdown_title + " - Countdown";
  }
  document.title = title;
}

function format(time_left__miliseconds) {
  let rest = time_left__miliseconds;

  const milliseconds = rest % 1000;
  rest = (rest / 1000) | 0;

  const seconds = pad(rest % 60);
  rest = (rest / 60) | 0;

  const minutes = rest % 60;
  rest = (rest / 60) | 0;

  const hours = rest % 24;
  rest = (rest / 24) | 0;

  const days = rest % 30;
  rest = (rest / 30) | 0;

  const months = rest % 12;
  rest = (rest / 12) | 0;

  const years = rest;

  /*
  const decades = rest;

  const centuries = rest;

  const centuries = rest;

  const millennia
  */

  let time_major = "";
  let time_minor = "";
  [
    [years, "y", "year"],
    [months, "mo", "month"],
    [days, "d", "day"],
    [hours, "h", "hour"],
    [minutes, "m", "minute"],
    [seconds, "s", ""],
    // [milliseconds, 'ms'],
  ]
    .filter(([val]) => val)
    .forEach(([val, suffix, suffix_long], key) => {
      if (key === 0) {
        time_major = val;
        if (suffix_long) {
          time_major += " " + suffix_long + (val != 1 ? "s" : "");
        }
        return;
      }

      if (time_minor) time_minor += " ";
      time_minor += val + suffix;
    });

  return { time_major, time_minor };
}

function pad(i) {
  return (0 <= i && i <= 9 ? "0" : "") + i;
}

function ignite_beat(pulse) {
  pulse();

  function pulse() {
    dom_beat();
    setTimeout(pulse, 1001);
  }
}
