import React from 'react';
import Header from '../Header';

export default ClockView;

function ClockView() {
  return <>
    <Header/>

    <div id="zoom-container" className="pretty_scroll_area__hide_scroll_element">
      <div id='layout_container'>

        <div id="layout_ad">
        <div>
          <div id="primary-ad">
            <div className='ad-content-wrapper'>
              <div id="CLOCKTAB_leaderboard_ATF_desktop" className="ad_desktop">
                <div id='div-gpt-ad-1582657330353-0'></div>
              </div>
              <div id="CLOCKTAB_leaderboard_ATF_mobile" className="ad_mobile">
                <div id='div-gpt-ad-1582659017480-0'></div>
              </div>
            </div>
            <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
          </div>
        </div>
        </div>

        <div id="layout_clock">
          <table id='timeTable'>
            <tr><td id='timeRow'>
              <table>
              <tr>
                <td id='time'></td>
                <td><table><tr><td id='char1' ></td></tr><tr><td id='digit1'></td></tr></table></td>
                <td><table><tr><td id='char2' ></td></tr><tr><td id='digit2'></td></tr></table></td>
              </tr>
              </table>
            </td></tr>
            <tr><td id='date'></td></tr>
          </table>
        </div>

        <div id="layout_equilibrator"></div>
      </div>
    </div>

    <div id="screen-buttons-wrapper">
      <div className="screen-button glass-background" id="manual-fullscreen">Fullscreen</div>
      <div className="screen-button glass-background" id="manual-scroll">Scroll</div>
      <div className="screen-button glass-background" id="auto-scroll"></div>
    </div>
  </>;
}
