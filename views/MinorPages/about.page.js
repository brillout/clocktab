import React from 'react';
import {getPageConfig} from '../PageWrapper';

export default getPageConfig(
  () => <>
    <p>
    Over a decade ago,
    the emergence of new technologies enabled to development of rich interactive desktop-like apps on the web.
    </p>

    <p>
    Enthusiastic about the new capabilities of the web and in need for an online clock and an online timer,
    Romuald started developing Clock Tab and Timer Tab.
    </p>

    <p>
    Romuald enjoys designing web apps and open source libraries with a care for simplicity.
    </p>

    <p>
    More about Romuald can be found on his homepage, <a target="_blank" href="https://brillout.com/">brillout.com</a>.
    </p>
  </>,
  'About',
);
