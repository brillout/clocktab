import React from 'react';

export default PresetBlocks;

function PresetBlocks({preset_concept_name}) {
  return <>
    <div className="more_panel_block">
      <div className="more_panel_block_title">
        {preset_concept_name}
      </div>
      <div id='creator-content' />
    </div>
    <div id='save-container' className="more_panel_block">
      <div className="more_panel_block_title">
        Save
      </div>
      <div id='save-content' />
    </div>
    <div className="more_panel_block">
      <div className="more_panel_block_title">
        Options
      </div>
      <div id='options-content' />
    </div>
    <div id='share-container' className="more_panel_block">
      <div className="more_panel_block_title">
        Share
      </div>
      <div id='share-preamble'>
        You can create and share {preset_concept_name}s;
        customize an existing {preset_concept_name}, save it under a new name, then use its share link.
      </div>
      <div id='share-content'>
        Share Link:
      </div>
    </div>
  </>;
}
