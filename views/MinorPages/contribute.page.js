import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    <p>
    The best way to contribute is to <a href="/donate">donate</a>.
    </p>

    <p>
    Or, if you know how to program, you can contribute by participating in Clock Tab's development, see
    {" "}
    <a href="https://github.com/brillout/clocktab" target="_blank">Clock Tab's GitHub</a>.
    </p>
  </>,
  'Contribute',
);
