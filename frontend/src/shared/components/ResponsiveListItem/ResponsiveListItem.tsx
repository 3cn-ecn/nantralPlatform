import { ReactNode, useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonBaseProps,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

import { useBreakpoint } from '#shared/hooks/useBreakpoint';

interface ResponsiveListItemProps {
  actions: {
    label: string;
    onClick: () => void;
    icon: ReactNode;
  }[];
}

/**
 * A custom List item that support adding one or more actions.
 * It will display the actions as IconButtons on desktop and
 * in a collapsible sublist on mobile.
 *
 * Warning: on the mobile version, a visual indicator is added after the children
 *
 * @param actions the actions to display for this list item (label, icon and onClick handler)
 * @param children the content of the list item (same as regular ListItem)
 * @param listItemProps other props to pass to the ListItem component (e.g. selected, disabled, etc.).
 * Note that only the ListItemButtonBaseProps are supported, as the ListItemButton is used for the mobile version of the component.
 */
export function ResponsiveListItem({
  actions,
  children,
  ...listItemProps
}: ResponsiveListItemProps & ListItemButtonBaseProps) {
  const isMobile = useBreakpoint('md').isSmaller;
  const [open, setOpen] = useState(false);
  if (isMobile) {
    return (
      <>
        <ListItemButton {...listItemProps} onClick={() => setOpen(!open)}>
          {children}
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {actions.map((action) => (
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={action.onClick}
                key={action.label}
              >
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText primary={action.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  } else {
    return (
      <ListItem
        secondaryAction={
          <>
            {actions.map((action) => (
              <Tooltip title={action.label} key={action.label}>
                <IconButton onClick={action.onClick}>{action.icon}</IconButton>
              </Tooltip>
            ))}
          </>
        }
        {...listItemProps}
      >
        {children}
      </ListItem>
    );
  }
}
