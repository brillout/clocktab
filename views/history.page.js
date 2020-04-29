import React from "react";
import { getPageConfig } from "../tab-utils/views/PageWrapper";

export default getPageConfig(HistoryView, "History", { noHeader: true });

function HistoryView() {
  return (
    <>
      <h1>A brief History of Time</h1>

      <h2>Curiosity, symbolic and strategic moves.</h2>

      <p>
        <b>The first adoption</b> of a standard time was on December 1, 1847, in
        Great Britain by railway companies using GMT kept by portable
        chronometers. The first of these companies to adopt standard time was
        the Great Western Railway (GWR) in November 1840. This quickly became
        known as Railway Time.
      </p>

      <p>
        The <b>first person</b> known to conceive a world time zone system was
        the Italian mathematician Quirico Filopanti. He introduced the idea in
        1858 in his book Miranda! He proposed 24 time zones, which he called
        "longitudinal days", the first centered on the meridian of Rome.
      </p>

      <p>
        From 1940 to 1947, <b>UK</b> was not under its usual Greenwich Mean Time
        (UTC + 0). When British daylight saving time ended in 1940, the clocks
        were not put back an hour, so they remained at UTC+1 and the following
        spring the clocks were put again an hour ahead at UTC+2. The change
        meant that Britain stayed outside of its normal time zone during the{" "}
        <b>World War II</b>, with up to two hours of extra daylight at the end
        of the day. The government strategy was to support the war effort saving
        fuel and giving workers extra time to go home before the blackout began.
      </p>

      <p>
        In 2007, <b>Venezuela's</b> president Hugo Chavez shifted the entire
        country back 30 minutes.
      </p>

      <p>
        Historically <b>France</b> used to be on Paris time, nine minutes ahead
        of GMT. But the country is now GMT+1.
      </p>

      <p>
        On Aug. 15, 2015, <b>North Korean</b> leader Kim Jong Un decided to put
        clocks back half an hour to establish their own time zone, “Pyongyang
        time” differentiating from South Korea. About three years later, the
        change has been reversed as a sign of reconciliation and collaboration.
      </p>

      <h2>When we change our clocks – Europe vs U.S.A.</h2>

      <p>
        Most of the <b>United States</b> starts Daylight Saving Time at 2:00
        a.m. on the second Sunday of March and returns to Standard Time on the
        first Sunday of November. In the United States, each time zone changes
        at a different time.
      </p>

      <p>
        In the <b>European Union</b>, daylight saving time (summer time) starts
        and ends at 01:00 a.m. Universal Time (GMT). It starts on the last
        Sunday of March and ends on the last Sunday of October. In the EU, all
        time zones change at the same time.
      </p>

      <h2>Main Timezones</h2>

      <p>
        <b>UTC</b> (or GMT) is the "<b>Universal Coordinated Time</b>", which
        corresponds to the Greenwich Time zone. At this point meridian 0 has
        been placed. When the sun is exactly at the peak of the meridian line or
        longitudinal zenith, it is 12 o'clock. The old acronym GMT, which means
        "Greenwich mean time", has given way to UTC. The new system is based on
        atomic clocks and no longer on celestial phenomena.
      </p>

      <p>
        <b>CET</b> is the “<b>Central Europe time</b>”. It is set one hour ahead
        of the coordinated universal time (UTC+1) when standard time is in
        effect. All European countries abandon it in the summer, switching to
        the UTC+2 time zone called Central European Summer Time.
      </p>

      <p>
        <b>EST</b> is the “<b>Eastern Standard Time</b>”. It is the time zone of
        the east coast of the United States and Canada, corresponding to UTC-5.
        In the summer it becomes EDT (Eastern Daylight Time) or UTC-4.
      </p>

      <p>
        <b>PST</b> is the “<b>Pacific Standard Time</b>”. It is the time zone of
        the west coast of the United States and Canada, which in the summer
        becomes Pacific Daylight Time (PDT).
      </p>
    </>
  );
}
