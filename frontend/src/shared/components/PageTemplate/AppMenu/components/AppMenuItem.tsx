import { NavLink } from 'react-router-dom';

import {
  Icon,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface AppMenuItemProps {
  label: string;
  path: string;
  iconPath?: string;
  isOnBackend?: boolean;
  closeMenu: () => void;
}

export function AppMenuItem({
  label,
  path,
  iconPath = '/static/img/icons/cropped/link.svg',
  isOnBackend,
  closeMenu,
}: AppMenuItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={path}
        reloadDocument={isOnBackend}
        onClick={closeMenu}
        sx={{
          '&.active': {
            color: 'primary.main',
            '& span': { fontWeight: 500 },
          },
        }}
      >
        <ListItemIcon>
          <Icon component="img" src={iconPath} alt="" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
