import './countdown.css';
import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';
import News from '../News';
import PresetBlocks from '../TabOptions/PresetBlocks';
import {preset_concept_name} from './preset_concept_name';

export default CountdownView;

function CountdownView() {
  return <>
    <FullView>
      <BigText id={'countdown-container'}
        //top_content={}
        big_text={<Counter />}
        //bottom_line={}
        bottom_max_font_size={'20px'}
      />
    </FullView>

    <MorePanel>
      <PresetBlocks preset_concept_name={preset_concept_name} />
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
