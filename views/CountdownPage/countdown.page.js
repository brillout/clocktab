import React from 'react';
import {FullView, MorePanel, config} from '../FullViewWrapper';

export default config({
  route: '/countdown',
  title: 'Countdown',
  view: () => <>
    <FullView id='msg-container'>
      <div id="countdown-el" />
    </FullView>
    <MorePanel>
      <div>euqwhei</div>
    </MorePanel>
  </>,
  onPageLoad,
});

function onPageLoad(loadWrapper) {
  loadWrapper();
  const dom_el = document.querySelector('#countdown-el');
  const countdown_date = new Date('2021');
  start_countdown({dom_el, countdown_date});
}

function start_countdown({dom_el, countdown_date}) {
  hear_beat(() => {
    const now = new Date();
    let time_left = format_time_left(countdown_date - now);
    dom_el.textContent = time_left;
  });
}

function format_time_left(time_left__miliseconds) {
  let rest = time_left__miliseconds

  const milliseconds = rest % 1000 | 0;
  rest = rest / 1000;

  const seconds = rest % 60 | 0;
  rest = rest / 60;

  const minutes = rest % 60 | 0;
  rest = rest / 60;

  const hours = rest % 24 | 0;
  rest = rest / 24;

  const days = rest | 0;

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

function hear_beat(pulse) {
  beat();

  function beat() {
    pulse();
    setTimeout(beat, 300);
  }
}
