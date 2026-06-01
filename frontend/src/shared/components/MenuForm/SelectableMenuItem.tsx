import { Check } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

interface SelectableMenuItemProps extends MenuItemProps {
  label: string;
  handleChange: (val: boolean) => void;
}

export function SelectableMenuItem({
  selected,
  label,
  handleChange,
  ...props
}: SelectableMenuItemProps) {
  return (
    <MenuItem
      selected={selected}
      {...props}
      onClick={() => handleChange(!selected)}
    >
      {selected && (
        <ListItemIcon>
          <Check />
        </ListItemIcon>
      )}
      <ListItemText inset={!selected}>{label}</ListItemText>
      {props.children}
    </MenuItem>
  );
}
