import React from 'react';

export default RoadmapView;

function RoadmapView() {
  return <>
    <ul>
      <li>Make Clock Tab more robust. (Less bugs, more resilient, and please <a href="/bug-repair">report any bug</a> you may find!)</li>
      <li>Make Clock Tab work offline.</li>
      <li>Remove memory leak. (Clock Tab can sometimes consumes a lot of CPU and RAM.)</li>
      <li>Detect and adapt to browser dark theme mode.</li>
      <li>Improve theme customization.</li>
      <li>More themes.</li>
      <li>Beautiful analog clock.</li>
      <li>Option to move position of Clock, e.g. in the top left corner.</li>
      <li>Option to set  YouTube live stream as background.</li>
      <li>Make Clock Tab load faster.</li>
    </ul>

    <p>
    You have wish? <a href="/feature-suggestion">Suggest a feature</a>!
    </p>
  </>;
}
