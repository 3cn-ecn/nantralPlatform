import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import './CheckboxButton.scss';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

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
  onChangeValue: (value: boolean) => void;
  value: boolean;
}) {
  const { id, label, icon, onChangeValue, value } = props;

  return (
    <ListItemButton
      disableRipple
      className="checkbox"
      onClick={() => onChangeValue(!value)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
      <Checkbox style={{ margin: 0 }} size="small" checked={!!value} />
    </ListItemButton>
  );
}

export default CheckboxButton;
