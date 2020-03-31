import React from 'react';

export default News;

function News({preset_concept_name, ...props}) {
  return <div {...props}>
    <div className="more_panel_block_title">
      !! News !!
    </div>
    <ul>
      <li>Countdown &mdash; check out the brand new Countdown Tab.</li>
      {/*
      <li>{preset_concept_name} super-powered &mdash; you can now create, save, and share {preset_concept_name}s!</li>
      */}
      <li>Themes super-powered &mdash; you can now create, save, and share Themes.</li>
      <li>World Clock &mdash; to create multiple Clocks and convert timezones.</li>
      <li>Msg Tab &mdash; Communication-over-Screen, especially useful in education.</li>
    </ul>
    These features are new; if you encounter any issue then <a href="/bug-repair">let me know</a>.
  </div>;
}
