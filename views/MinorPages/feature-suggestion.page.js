import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    To suggest a feature, write an email at{' '}
    <a
      data-subject="Feature Suggestion"
      data-body="Hi Romuald, I'd like to suggest following new feature:\n\n"
      className="contact-address"
      target="_blank"
    />
    .
  </>,
  'Feature Suggestion',
);
