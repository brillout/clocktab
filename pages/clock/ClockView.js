import React from 'react';
import Header from '../Header';

export default ClockView;

function ClockView() {
  return <>
    <div id="top_content">
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
      <div className="screen-button glass-background" id="manual-scroll">Center</div>
      <div className="screen-button glass-background" id="auto-scroll"></div>
    </div>
    </div>

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
        <div id='options'></div>
      </div>
    </div>
  </>;
}
