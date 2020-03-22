import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    To suggest a feature, write an email to
    {' '}
    <a
      data-subject="Feature Suggestion"
      data-body="Hi Romuald, I'd like to suggest following new feature:"
      className="contact-address"
      target="_blank"
    />
    .

    <p>
    If you have a GitHub account, you can also
    {' '}
    <a href="https://github.com/brillout/clocktab/issues/new" target="_blank">
      create a GitHub ticket
    </a>
    {' '}
    on Clock Tab's repository.
    </p>
  </>,
  'Feature Suggestion',
);
