import React from "react";
import {
  FullViewLayout,
  FullView,
  MorePanel,
  LeftSide,
  RightSide,
} from "../../tab-utils/views/FullViewWrapper";
import BigText from "../BigText";
import { SettingsView } from "../../tab-utils/TabSettings/SettingsView";
import { preset_concept_name } from "./js/preset_concept_name";
import { adSlots } from "./adSlots";
import { Ad_btf_2, Ad_left } from "../../tab-utils/ads/views";

export default ClockView;

function ClockView() {
  return (
    <FullViewLayout>
      <LeftSide>
        <Ad_left ad_slots={adSlots} />
      </LeftSide>

      <RightSide className="grow-more-panel">
        <FullView>
          <BigText
            id={"clock-container"}
            //content_on_top={<Ad_ATF ad_slots={adSlots} />}
            top_line_content={<TopLine />}
          />
        </FullView>

        <MorePanel>
          <Ad_btf_2 ad_slots={adSlots} />
          <SettingsView preset_concept_name={preset_concept_name} />
        </MorePanel>
      </RightSide>
    </FullViewLayout>
  );
}

function TopLine() {
  return (
    <table style={{ margin: "auto" }}>
      <tr>
        <td id="time_text"></td>
        <td>
          <table>
            <tr>
              <td id="char1"></td>
            </tr>
            <tr>
              <td id="digit1"></td>
            </tr>
          </table>
        </td>
        <td>
          <table>
            <tr>
              <td id="char2"></td>
            </tr>
            <tr>
              <td id="digit2"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
}
