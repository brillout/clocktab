import React from 'react';
import {getPageConfig} from '../PageWrapper';
import WorldClockView from './WorldClockView';

export default getPageConfig(
  WorldClockView,
  'World Clock',
  {
    noHeader: true,
    description: "World Clock. Featuring timezone converter.",
    head: [
      '<meta name="google" content="notranslate" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',

      '<link href="https://fonts.googleapis.com/css?family=Open+Sans" type="text/css" rel="stylesheet" >',
      '<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" type="text/css" rel="stylesheet" />',
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">',

      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>',
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>',
    ],
    onPageLoad: () => {
      window['ttzc'] = new worldclock.WorldClock(lstrings);
    },
    route: '/world-clock-2',
  },
);
