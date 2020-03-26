import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';

export default CountdownView;

function CountdownView() {
  return <>
    <FullView>
      <BigText
        //top_content={}
        big_text={<div id="countdown-el" />}
        //bottom_line={}
      />
    </FullView>

    <MorePanel>
      <div id='options-container'></div>
    </MorePanel>
  </>;
}
