import * as React from "react";
import Switch from "react-switch";

import { editModeSwitchDivStyle, editModeSwitchElementStyle } from "./styles";

export function EditGroupMembersSwitch(props) {
  const { status, handle } = props;
  return (
    <div className="col" style={editModeSwitchDivStyle}>
      <Switch
        checked={status}
        onChange={handle}
        uncheckedIcon={false}
        checkedIcon={false}
      />
      <span style={editModeSwitchElementStyle}>Mode Edition</span>
    </div>
  );
}
