import {set_bottom_line} from '../BigText';

export {start_countdown};
export {dom_beat};


let countdown_text_el;
function get_dom_elements() {
  if( countdown_text_el) {
    return;
  }
  countdown_text_el = document.querySelector('#countdown-text');
}

let get_option_value;
function start_countdown({get_option_value: _get_option_value}) {
  get_option_value = _get_option_value;
  ignite_beat();
}

function dom_beat() {
  get_dom_elements();

  const countdown_date = new Date(get_option_value('countdown_date'));

  let countdown_title = get_option_value('countdown_title');
  countdown_title = countdown_title.replace('%date', new Date().toLocaleDateString());
  set_bottom_line(countdown_title);

  const now = new Date();
  let time_left = format_time_left(countdown_date - now);
  countdown_text_el.textContent = time_left;
}

function format_time_left(time_left__miliseconds) {
  let rest = time_left__miliseconds

  const milliseconds = rest % 1000;
  rest = (rest / 1000) | 0;

  const seconds = rest % 60;
  rest = (rest / 60) | 0;

  const minutes = rest % 60;
  rest = (rest / 60) | 0;

  const hours = rest % 24;
  rest = (rest / 24) | 0;

  const days = rest;

  let time_left = '';
  [
    [days,'d'],
    [hours, 'h'],
    [minutes, 'm'],
    [seconds, 's'],
 // [milliseconds, 'ms'],
  ]
  .forEach(([val, suffix]) => {
    if( !time_left && !val ) return;

    if( time_left ) time_left+=' ';
    time_left += val + suffix;
  });

  return time_left;
}

function ignite_beat(pulse) {
  pulse();

  function pulse() {
    dom_beat();
    setTimeout(pulse, 300);
  }
}

