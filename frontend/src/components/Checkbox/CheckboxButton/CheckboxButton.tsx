import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import './CheckboxButton.scss';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function CheckboxButton(props: { label: string; icon: any }) {
  const { label, icon } = props;
  const [checkValue, setCheckValue] = React.useState(false);
  return (
    <ListItemButton
      disableRipple
      id="checkbox"
      onClick={() => setCheckValue(!checkValue)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
      <Checkbox style={{ margin: 0 }} size="small" checked={checkValue} />
    </ListItemButton>
  );
}

export default CheckboxButton;
