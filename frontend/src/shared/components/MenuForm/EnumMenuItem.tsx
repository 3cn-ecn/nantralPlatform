import { ReactNode } from 'react';

import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

import { SelectableMenuItem } from '#shared/components/MenuForm/SelectableMenuItem';

export interface EnumMenuItemProps extends MenuItemProps {
  handleChange: (val: string) => void;
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  items: string[];
}

export function EnumMenuItem({
  value,
  handleChange,
  label,
  icon,
  items,
  ...props
}: EnumMenuItemProps) {
  return (
    <>
      <MenuItem {...props} disabled>
        {icon !== undefined && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
      </MenuItem>
      {items.map((item) => (
        <SelectableMenuItem
          key={item}
          label={item}
          selected={item === value}
          handleChange={() => handleChange(item)}
          {...props}
        />
      ))}
    </>
  );
}
