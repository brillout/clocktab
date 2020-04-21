import {
  FullView,
  MorePanel,
  config,
} from "../../tab-utils/views/FullViewWrapper";
import onPageLoad from "./onPageLoad";
import CountdownView from "./CountdownView";

export default config({
  route: "/countdown",
  title: "Countdown",
  view: CountdownView,
  onPageLoad,
});
