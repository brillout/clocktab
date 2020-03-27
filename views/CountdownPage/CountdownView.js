import React from 'react';
import {FullView, MorePanel} from '../FullViewWrapper';
import BigText from '../BigText';

export default CountdownView;

function CountdownView() {
  return <>
    <FullView>
      <BigText id={'countdown-container'}
        //top_content={}
        big_text={<div id="countdown-text" />}
        //bottom_line={}
        bottom_max_font_size={'20px'}
      />
    </FullView>

    <MorePanel>
      <div id='options-container'></div>
    </MorePanel>
  </>;
}
