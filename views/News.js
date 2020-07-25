import React from "react";

export default News;

function News({ preset_concept_name }) {
  return (
    <div className="more_panel_block">
      <div className="more_panel_block_title">News</div>
      <Date>July, 25th</Date>
      <ul>
        <li>New Themes: LCD, LCD Green, Modern.</li>
      </ul>
      <Date>April, 29th</Date>
      <ul>
        <li>Lower GPU footprint.</li>
      </ul>
      <Date>April, 21th</Date>
      <ul>
        <li>Bigger clock size for smaller browser window sizes.</li>
      </ul>
      <Date>April, 11th</Date>
      <ul>
        <li>New clock layout algorithm for a more robust layout.</li>
        <li>Lower CPU and RAM memory footprint.</li>
      </ul>
      <Date>March, 31th</Date>
      <ul>
        <li>Countdown &mdash; check out the brand new Countdown Tab.</li>
        {/*
      <li>{preset_concept_name} super-powered &mdash; you can now create, save, and share {preset_concept_name}s!</li>
      */}
        <li>
          Themes super-powered &mdash; you can now create, save, and share
          Themes.
        </li>
        <li>
          World Clock &mdash; to create multiple Clocks and convert timezones.
        </li>
        <li>Msg Tab &mdash; Communication-over-Screen, useful in education.</li>
      </ul>
      If you encounter any issue with these new features then{" "}
      <a href="/repair">let me know</a>.
    </div>
  );
}

function Date({ children }) {
  return <div style={{ marginTop: 11, marginBottom: -11 }}>{children}</div>;
}
