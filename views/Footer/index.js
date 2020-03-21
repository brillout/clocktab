import React from 'react';
import './footer.css';

export default Footer;

function Footer() {
  return (
    <Container>
      <Section>
        <Header>Community</Header>
        <Link href="/contact">Discussions & questions</Link>
        <Link href="/contact">Help & Support</Link>
        {/*
        Help
        <Link href="https://github.com/lsos/lsos">GitHub</Link>
        Report an Issue
        Support
        Questions
        <Link href="/contact">Send Feedback</Link>
        <Link href="/contact">Start discussion</Link>
        <Link href="/contact">Help</Link>
        <Link href="/contact">Ask Question</Link>
        */}
      </Section>

      <Section>
        <Header>Resources</Header>
        <Link href="/faq">What is the Lsos</Link>
        <Link href="/docs#for-companies">Docs for Companies</Link>
        <Link href="/docs#for-projects">Docs for Projects</Link>
        <Link href="/state">Roadmap</Link>
        <Link href="/faq">FAQ</Link>

        {/*
        How it works
        Is it a good thing?

        <Link href="/docs#lsos-fee">Lsos Fee</Link>
        <Link href="/docs#lsos-renumeration">Lsos Renumeration</Link>
        */}
      </Section>

      <Section>
        <Header>Lsos</Header>

        <Link href="/about">About</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/state">Monetary Transactions</Link>
        <Link href="/contact">Contact</Link>
      </Section>

      <Section>
        <Header>Legal & conduct</Header>

        <Link href="/conduct">Code of Conduct</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/privacy">Privacy Policy</Link>
        {/*
        Terms of Service (Disclaimer? https://e-bot7.de/en/disclaimer/)
        Privacy (Policy)
        */}
        <Link href="/imprint">Imprint</Link>
      </Section>
    </Container>
  );
}

/* More:

 - Press (Press kit: https://www.netlify.com/press/)
 - Testimonials (Customer Stories: https://www.netlify.com/customers/)
 - Blog
 - Twitter
 - Legal notices (https://help.netflix.com/legal/notices)
 - Cookie Preferences (https://www.netflix.com/de-en/)
 - Copies of all open source licenses (https://help.netflix.com/legal/notices - https://help.nflxext.com/legal/netflix_open_source_notices_20190711.pdf)
 - Use footer as navigator like https://www.airbnb.com/
 - Sitemap

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

/*
      <div>
        <a href='https://www.timer-tab.com' target="_blank">Timer Tab</a>
        <a href='donate' target="_blank">Remove Ad</a>
        <a href='https://github.com/brillout/clocktab' target="_blank">Source Code</a>
        <a href='donate' target="_blank">Donate</a>
        <a rel='author' href='https://brillout.com' target="_blank">Author</a>
        <a href='contact' target="_blank">Contact</a>
        <a href='privacy-policy' target="_blank">Privacy Policy</a>
      </div>
      */
