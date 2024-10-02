import { ReactNode, useState } from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import { IconButton, Menu, Tooltip } from '@mui/material';

interface IconMenuProps {
  Icon: SvgIconComponent;
  size: 'small' | 'medium' | 'large';
  tooltip?: string;
  children: ReactNode;
}

export function IconMenu({ Icon, size, tooltip, children }: IconMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleClick} size={size}>
          <Icon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {children}
      </Menu>
    </>
  );
}
