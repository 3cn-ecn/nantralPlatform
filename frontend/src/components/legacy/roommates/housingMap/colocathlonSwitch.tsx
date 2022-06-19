import * as React from 'react';
import Switch from '@mui/material/Switch';

import {
  colocathlonSwitchDivStyle,
  colocathlonSwitchChildStyle,
  colocathlonSwitchElementStyle,
} from './styles';
import { ColocathlonSwitchProps } from './interfaces';

export function ColocathlonSwitch(props: ColocathlonSwitchProps) {
  const { status, handle } = props;
  return (
    <div className="col" style={colocathlonSwitchDivStyle}>
      <div style={colocathlonSwitchElementStyle}>
        <Switch checked={status} onChange={handle} />
      </div>
      <span style={colocathlonSwitchChildStyle}>Mode Colocathlon</span>
    </div>
  );
}
