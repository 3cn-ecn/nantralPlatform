import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import './CheckboxButton.scss';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function CheckboxButton(props: {
  id: string;
  label: string;
  icon: any;
  getChecked: any;
}) {
  const { id, label, icon, getChecked } = props;
  const [checkValue, setCheckValue] = React.useState(false);

  const handleChange = () => {
    setCheckValue(!checkValue);
    getChecked(id, !checkValue);
  };

  return (
    <ListItemButton disableRipple className="checkbox" onClick={handleChange}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
      <Checkbox style={{ margin: 0 }} size="small" checked={checkValue} />
    </ListItemButton>
  );
}

export default CheckboxButton;
