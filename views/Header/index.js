import React from 'react';
import logoUrl from './logo.svg';
import './header.css';

export default Header;

function Header() {
  return (
    <div id='header-container' className='glass-background'>
      <div id="header-content">
        <Logo/>
        <Link href={'/world-clock'} >World Clock</Link>
        <Link href={'https://www.timer-tab.com'} target="_blank">Timer Tab</Link>
        <Link href={'/msg-tab'}>Msg Tab</Link>
        <Link href={'/countdown'}>Countdown</Link>
        <Link href={'/history'}>History</Link>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a
     id="header-logo"
     href='/'
    >
      <img src={logoUrl} />
      <b>Clock Tab</b>
    </a>
  );
}

function Link(props) {
  return (
    <a className='header-link' {...props}></a>
  );
}
