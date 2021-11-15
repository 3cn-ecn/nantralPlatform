import * as React from "react";
import Switch from "react-switch";

export function EditGroupMembersSwitch(props) {
  const { status, handle } = props;
  return (
    <div className="col" style={null}>
      <div style={null}>
        <Switch
          checked={status}
          onChange={handle}
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>
      <span style={null}>Mode Edition</span>
    </div>
  );
}
