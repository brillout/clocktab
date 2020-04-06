import './countdown.css';
import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';
import News from '../News';
import {SettingsView} from '../TabOptions/SettingsView';
import {preset_concept_name} from './preset_concept_name';

export default CountdownView;

function CountdownView() {
  return <>
    <FullView>
      <BigText id={'countdown-container'}
        //top_content={}
        big_text={<Counter />}
        //bottom_line={}
      />
    </FullView>

    <MorePanel>
      <SettingsView preset_concept_name={preset_concept_name} is_countdown_page={true}/>
      <News className="more_panel_block" preset_concept_name={preset_concept_name}/>
    </MorePanel>
  </>;
}

function Counter() {
  return (
    <div>
      <div id="top-text" />
      <div id="center-text" />
    </div>
  );
}
