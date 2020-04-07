import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';
import News from '../News';
import {SettingsView} from '../../tab-utils/TabSettings/SettingsView';
import {preset_concept_name} from './js/preset_concept_name';
import {ad_slots} from './ad_slots';
import assert from '@brillout/assert';

export default ClockView;

function ClockView() {
  return <>
    <FullView>
      <BigText id={'clock-container'}
        top_content={<Ad_ATF />}
        big_text={<TopLine />}
        //bottom_line={}
      />
    </FullView>

    <MorePanel>
      <Ad_BTF />
      <SettingsView preset_concept_name={preset_concept_name} />
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

function Ad_ATF() {
  const slots = ad_slots.filter(slot => slot.slotName.includes('ATF'));
  assert(ad_slots.length===2);
  assert(slots.length===1);
  return <AdView id="primary-ad" slot={slots[0]} />;
}
function Ad_BTF() {
  const slots = ad_slots.filter(slot => slot.slotName.includes('BTF'));
  assert(ad_slots.length===2);
  assert(slots.length===1);
  return <AdView id="secondary-ad" slot={slots[0]} />;
}

function AdView({id, slot: {slotName, slotID}}) {
  assert(slotName && slotID);
  return (
    <div id={id}>
      <div className='ad-content-wrapper'>{
        <div id={slotName}>
          <div id={slotID}/>
        </div>
      }</div>
      <a className='ad_remover' href='donate' target="_blank">Remove ad</a>
    </div>
  );
}
