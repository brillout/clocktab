import "./css/clock.css";
import ClockView from "./ClockView";
import onPageLoad from "./onPageLoad";
import { config } from "../../tab-utils/views/FullViewWrapper";

export default config({
  route: "/",
  view: ClockView,

  title: "Clock Tab",

  head: [
    '<meta name="keywords" content="time, clock, tab">',
    "<meta name='description' content='Displays the current Time. Featuring \"Time Icon\" and customizable Themes. Made by the Creator of Timer Tab.'>",
  ],
  onPageLoad,
});
