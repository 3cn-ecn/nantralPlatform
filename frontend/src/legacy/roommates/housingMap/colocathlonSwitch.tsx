import Switch from '@mui/material/Switch';

import { ColocathlonSwitchProps } from './interfaces';
import {
  colocathlonSwitchChildStyle,
  colocathlonSwitchDivStyle,
  colocathlonSwitchElementStyle,
} from './styles';

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
