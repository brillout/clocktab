import React from "react";
import {
  FullViewLayout,
  FullView,
  MorePanel,
  LeftSide,
  RightSide,
} from "../../tab-utils/views/FullViewWrapper";
import BigText from "../BigText";
import News from "../News";
import { SettingsView } from "../../tab-utils/TabSettings/SettingsView";
import { preset_concept_name } from "./js/preset_concept_name";
import { ad_slots } from "./ad_slots";
import { Ad_BTF, Ad_ATF, Ad_left } from "../../tab-utils/load_ad";
import { ProductsView } from "../../tab-utils/ads/Products/ProductsView";

export default ClockView;

function ClockView() {
  return (
    <FullViewLayout>
      <LeftSide style={{ backgroundColor: "#3e3e3e" }}>
        <Ad_left ad_slots={ad_slots} />
      </LeftSide>

      <RightSide>
        <FullView>
          <BigText
            id={"clock-container"}
            content_on_top={<Ad_ATF ad_slots={ad_slots} />}
            top_line_content={<TopLine />}
          />
        </FullView>

        <MorePanel>
          <Ad_BTF ad_slots={ad_slots} />
          <SettingsView preset_concept_name={preset_concept_name} />
          <ProductsView />
          <News preset_concept_name={preset_concept_name} />
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
