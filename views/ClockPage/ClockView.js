import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';
import News from '../News';
import PresetBlocks from '../TabOptions/PresetBlocks';
import {preset_concept_name} from './js/preset_concept_name';

export default ClockView;

function ClockView() {
  return <>
    <FullView>
      <BigText id={'clock-container'}
        top_content={<PrimaryAd />}
        big_text={<TopLine />}
        //bottom_line={}
      />
    </FullView>

    <MorePanel>
      <div id='secondary-ad'>
        <div className='ad-content-wrapper'>
          <div id="CLOCKTAB_leaderboard_BTF_desktop" className="ad_desktop">
            <div id='div-gpt-ad-1584752895476-0'>
            </div>
          </div>
          <div id="CLOCKTAB_leaderboard_BTF_mobile" className="ad_mobile">
            <div id='div-gpt-ad-1584752944641-0'>
            </div>
          </div>
        </div>
        <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
      </div>

      <PresetBlocks preset_concept_name={preset_concept_name} />
      <News className="more_panel_block" preset_concept_name={preset_concept_name}/>
    </MorePanel>
  </>;
}

function TopLine() {
  return (
    <table>
      <tr>
        <td id='time_text'></td>
        <td><table><tr><td id='char1' ></td></tr><tr><td id='digit1'></td></tr></table></td>
        <td><table><tr><td id='char2' ></td></tr><tr><td id='digit2'></td></tr></table></td>
      </tr>
    </table>
  );
}

function PrimaryAd() {
  return (
    <div>
      <div id="primary-ad">
        <div className='ad-content-wrapper'>
          <div id="CLOCKTAB_leaderboard_ATF_desktop" className="ad_desktop">
            <div id='div-gpt-ad-1584752619085-0'></div>
          </div>
          <div id="CLOCKTAB_leaderboard_ATF_mobile" className="ad_mobile">
            <div id='div-gpt-ad-1584752804386-0'></div>
          </div>
        </div>
        <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
      </div>
    </div>
  );
}
