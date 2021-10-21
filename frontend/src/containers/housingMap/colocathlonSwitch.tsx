import * as React from "react";
import Switch from "react-switch";

import { colocathlonSwitchStyle, colocathlonSwitchChildStyle } from "./styles";

export function ColocathlonSwitch(props) {
  const { status, handle } = props;
  return (
    <div className="col" style={colocathlonSwitchStyle}>
      <div style={colocathlonSwitchChildStyle}>
        <Switch
          checked={status}
          onChange={handle}
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>
      <span style={colocathlonSwitchChildStyle}>Mode Colocathlon</span>
    </div>
  );
}
