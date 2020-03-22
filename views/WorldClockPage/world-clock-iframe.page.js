import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    <iframe src="/world-clock-content/"/>
  </>,
  'World Clock',
);
