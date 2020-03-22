import React from 'react';
import logoUrl from './logo.svg';
import './header.css';

export default Header;

function Header() {
  return (
    <div id='header-container' className='glass-background'>
      <div id="header-content">
        <Logo/>
        <Link txt={'World Clock'} href={'/world-clock'} />
        <Link txt={'Timer Tab'} href={'https://www.timer-tab.com'} />
        <Link txt={'Msg Tab'} href={'/msg-tab'} />
        <Link txt={'New Year'} href={'/new-year-countdown'} />
        <Link txt={'History'} href={'/history'} />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a
     id="header-logo"
     href='/'
     className="big-text"
    >
      <img src={logoUrl} />
      <b>Clock Tab</b>
    </a>
  );
}

function Link({href, txt}) {
  return (
    <a className='header-link' href={href}>{txt}</a>
  );
}
