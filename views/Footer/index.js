import React from 'react';
import './footer.css';

export default Footer;

function Footer() {
  return (
    <Container>
      <Section>
        <Header>Support & features</Header>

        <Link href="/bug-repair">Bug Repair</Link>
        <Link href="/feature-suggestion">Suggest a Feature</Link>
        <Link href="/support">Get help & support</Link>
      </Section>

      <Section>
        <Header>Get Involved</Header>

        <Link href="/donate">Donate</Link>
        <Link href="/contribute">Contribute</Link>
      </Section>

      <Section>
        <Header>Clock Tab</Header>

        <Link href="/roadmap">Roadmap</Link>
        <Link href="https://github.com/brillout/clocktab">Source Code</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/about">About</Link>
      </Section>

      <Section>
        <Header>Legal & conduct</Header>

        <Link href="/conduct">Code of Conduct</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </Section>
    </Container>
  );
}
/*
        <Link href="/new-features">New Features</Link>
        <Link href="/donate">Remove Ads</Link>
        <Link href="/discussion">Discussions & questions</Link>
        <Link href="/timer-tab">Timer Tab</Link>
        <Link href="/author">Author</Link>
*/

function Container({children}) {
  return (
    <div id="footer_container">
      {children}
    </div>
  );
}

function Section({children}) {
  return <div className="footer_section">{children}</div>
}

function Header({children}) {
  return (
    <h4
      className="footer-section-title"
      style={{
        marginBottom: 7,
        fontWeight: '300',
      }}
    >
      {children}
    </h4>
  );
}

function Link({href, children}) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {children}
    </a>
  );
};

