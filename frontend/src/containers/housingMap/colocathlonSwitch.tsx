import * as React from "react";
import Switch from "react-switch";

import {
  colocathlonSwitchDivStyle,
  colocathlonSwitchChildStyle,
  colocathlonSwitchElementStyle,
} from "./styles";

export function ColocathlonSwitch(props) {
  const { status, handle } = props;
  return (
    <div className="col" style={colocathlonSwitchDivStyle}>
      <div style={colocathlonSwitchElementStyle}>
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
