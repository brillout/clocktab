import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    You can contact Romuald, the creator of Clock Tab, at <a className="contact-address"></a>.
  </>,
  'Contact',
);
