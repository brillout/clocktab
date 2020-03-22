import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    Clock Tab's source code is on GitHub and the best way
    to contribute is to participate in the development of Clock Tab's source code.

    If you know how to program code,
    then head over to <a href="https://github.com/brillout/clocktab" target="_blank">Clock Tab's GitHub</a>.

    If don't know how to programm
    but you want to learn how to code,
    then write an email to Romuald at <a data-subject="I'd like to contribute" className="contact-address"></a>.
  </>,
  'Contribute',
);
