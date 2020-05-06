import React from "react";
import UseCases from "./UseCases";
import {
  FullViewLayout,
  FullView,
  MorePanel,
  RightSide,
} from "../../tab-utils/views/FullViewWrapper";

export {MsgView};

function MsgView () {
  return (
    <FullViewLayout>
      <RightSide>
      <FullView id="msg-container">
        <div id="hint">Type something...</div>
        <div id="text-container">
          <div id="text" spellCheck="false">
            &nbsp;
          </div>
        </div>
      </FullView>
      <MorePanel>
        <UseCases />
      </MorePanel>
      </RightSide>
    </FullViewLayout>
  );
}
