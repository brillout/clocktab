import React from 'react';
import logoUrl from './logo.png';
import './header.css';

export default Header;

function Header() {
  return (
    <Container>
      <Logo/>
      <MenuItem><a href="/time-converter">World Clock</a></MenuItem>
      <MenuItem><a href="/timer">Timer</a></MenuItem>
      <MenuItem><a href="/pomodoro">Pomodoro</a></MenuItem>
      <MenuItem><a href="/new-year-countdown">New Year</a></MenuItem>
    </Container>
  );
}

function Logo() {
  return (
    <a
     id="logo"
     href='/'
     style={{
       whiteSpace: 'nowrap',
       marginRight: 45,
     }}
    >
      <img
       height={39}
       src={logoUrl}
       style={{verticalAlign: 'middle', display: 'inline-block'}}
      />
      <b style={{verticalAlign: 'middle', paddingLeft: 10, fontSize: '1.55em'}}>Clock Tab</b>
    </a>
  );
}

function Container({children}) {
  return (
    <div
      style={{
        height: 60,
        marginBottom: 32,
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function MenuItem({children}) {
  return (
    <div style={{marginLeft: 15, display: 'inline-block'}}>
      {children}
    </div>
  );
}
