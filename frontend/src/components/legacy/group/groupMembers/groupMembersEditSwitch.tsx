import * as React from 'react';
import Switch from '@mui/material/Switch';

import { editModeSwitchDivStyle, editModeSwitchElementStyle } from './styles';

export function EditGroupMembersSwitch(props) {
  const { status, handle } = props;
  return (
    <div className="col" style={editModeSwitchDivStyle}>
      <Switch checked={status} onChange={handle} />
      <span style={editModeSwitchElementStyle}>Mode Edition</span>
    </div>
  );
}
