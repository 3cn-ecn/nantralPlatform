import { Check } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

interface SelectableMenuItemProps extends MenuItemProps {
  label: string;
  helperText?: string;
  handleChange: (val: boolean) => void;
}

export function SelectableMenuItem({
  selected,
  label,
  helperText,
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
      <ListItemText inset={!selected} primary={label} secondary={helperText} />
      {props.children}
    </MenuItem>
  );
}
