const React = require('react');
const hyperx = require('hyperx')
const hx = hyperx(function createElement (component, properties, children) {
  // Pass children as separate arguments to avoid key warnings
  return React.createElement.apply(null, [component, properties].concat(children))
}, {
  createFragment: function createFragment (children) {
    return React.createElement.apply(null, [React.Fragment, {}].concat(children))
  }
})


module.exports = FooterView;

/*
function FooterView() {
  return React.createElement('div', null, 333);
}
*/

function FooterView() {
  return hx`
    <div id="more_panel">
      <div id="more_panel_background" className='glass-background'></div>
      <div id="more_panel_jumper_wrapper">
        <div id="more_panel_jumper" className='glass-background'></div>
      </div>
      <div id='secondary-ad'>
        <div className='ad-content-wrapper'>
          <div id="CLOCKTAB_leaderboard_BTF_desktop" className="ad_desktop">
            <div id='div-gpt-ad-1584320827791-0'>
            </div>
          </div>
          <div id="CLOCKTAB_leaderboard_BTF_mobile" className="ad_mobile">
            <div id='div-gpt-ad-1584321019356-0'>
            </div>
          </div>
        </div>
        <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
      </div>
      <div id="header">
        <div id='options'></div>
        <div className='header_links'>
          <a href='https://www.timer-tab.com' target="_blank">Timer Tab</a>
          <a href='donate' target="_blank">Remove Ad</a>
        </div>
        <div id='footer' className='header_links'>
          <a href='https://github.com/brillout/clocktab' target="_blank">Source Code</a>
          <a href='donate' target="_blank">Donate</a>
          <a rel='author' href='https://brillout.com' target="_blank">Author</a>
          <a href='contact' target="_blank">Contact</a>
          <a href='privacy-policy' target="_blank">Privacy Policy</a>
        </div>
      </div>
    </div>
  `;
}
/*
function FooterView() {
  return (
    <div id="more_panel">
      <div id="more_panel_background" className='glass-background'></div>
      <div id="more_panel_jumper_wrapper">
        <div id="more_panel_jumper" className='glass-background'></div>
      </div>
      <div id='secondary-ad'>
        <div className='ad-content-wrapper'>
          <div id="CLOCKTAB_leaderboard_BTF_desktop" className="ad_desktop">
            <div id='div-gpt-ad-1584320827791-0'>
            </div>
          </div>
          <div id="CLOCKTAB_leaderboard_BTF_mobile" className="ad_mobile">
            <div id='div-gpt-ad-1584321019356-0'>
            </div>
          </div>
        </div>
        <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
      </div>
      <div id="header">
        <div id='options' style='opacity:1'></div>
        <div className='header_links'>
          <a href='https://www.timer-tab.com' target="_blank">Timer Tab</a>
          <a href='donate' target="_blank">Remove Ad</a>
        </div>
        <div id='footer' className='header_links'>
          <a href='https://github.com/brillout/clocktab' target="_blank">Source Code</a>
          <a href='donate' target="_blank">Donate</a>
          <a rel='author' href='https://brillout.com' target="_blank">Author</a>
          <a href='contact' target="_blank">Contact</a>
          <a href='privacy-policy' target="_blank">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
*/
