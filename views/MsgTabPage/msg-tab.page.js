import "./lib.js";
import "./msg-tab.css";
import init_msg_tab from "./init_msg_tab";
import { MsgView } from "./MsgView";
import { config } from "../../tab-utils/views/FullViewWrapper";

export default config({
  route: "/msg-tab",
  title: "Msg Tab",
  view: MsgView,
  onPageLoad: (load_common) => {
    load_common();
    const text = window.document.getElementById("text");
    text.setAttribute("contentEditable", "true");
    init_msg_tab({ text });
  },
});
