import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    <h1>Contact</h1>
    <a className="contact-address"></a>
  </>,
  'Contact',
);
