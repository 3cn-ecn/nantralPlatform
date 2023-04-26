import React from 'react';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import './CheckboxButton.scss';

/**
 * Function to display a button with a checkbox
 * @param props id: id of the component, label: title of the button,
 *              icon: icon displayed on the left of the label,
 *              getChecked: function used to get value of the checkbox back to parent component
 * @returns a checkbox button
 */
function CheckboxButton(props: {
  id: string;
  label: string;
  icon: any;
  getChecked: any;
}) {
  const { id, label, icon, getChecked } = props;
  const [checkValue, setCheckValue] = React.useState(false); // true if the checkbox is checked

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
