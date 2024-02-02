import { ComponentProps, ReactNode } from 'react';

import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemTypeMap,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type UserMenuItemComponent = OverridableComponent<
  MenuItemTypeMap<
    { label: string; icon?: ReactNode; rightIcon?: ReactNode },
    'li'
  >
>;

export const UserMenuItem: UserMenuItemComponent = ({
  label,
  icon,
  rightIcon,
  ...props
}: ComponentProps<UserMenuItemComponent>) => {
  return (
    <MenuItem {...props}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{label}</ListItemText>
      {rightIcon}
    </MenuItem>
  );
};
