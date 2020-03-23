import React from 'react';
import './style.css';
import romuald_alps from "./romuald_alps.png";

export default DonateView;

function DonateView() {
  return <>
    <img id="rom-face" src={romuald_alps} />

    <h1>
    Hello,
    </h1>

    <p>
    I'm Romuald, the creator of Clock Tab.
    </p>

    <p>
    For the longest time, I refused to put ads on Clock Tab. I don't like ads.
    </p>

    <p>
    But I want to improve Clock Tab.
    More themes, improved theme customization, faster load speed, and many more ideas!
    Ads and donations allow me to maintain and improve Clock Tab.
    </p>

    <p>
    If you donate, I will give you a hidden code to remove ads.
    </p>

    <p>
    In order to donate, make a PayPal wire to my PayPal email:
    </p>
    <p style={{paddingLeft: 20}}>
      <b id='paypal-email'></b>
    </p>

    <p>
    Any amount you are capable of donating is welcome.
    You can PayPal me only 0.01$ if you are short on money, it's totally fine.
    </p>

    <p>
    You will receive an automatic email containing the ad removal code instantly after your PayPal wire.
    </p>

    <p>
    I'm looking forward to a bright Clock Tab future :-).
    </p>

    <p>
    Yours sincerely,
    </p>

    <p>
    Romuald<br/>
    <a target='_blank' className="contact-address"></a>
    </p>
  </>;
}
