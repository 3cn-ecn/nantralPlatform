import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import {
  MoreVert as MoreVertIcon,
  SvgIconComponent,
} from '@mui/icons-material';
import { IconButton, Menu } from '@mui/material';

type MoreActionsButtonProps = {
  Icon?: SvgIconComponent;
  menuIsOpen: boolean;
  setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
  menuPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  children: ReactNode;
};

export function MoreActionsButton({
  Icon = MoreVertIcon,
  menuIsOpen,
  setMenuIsOpen,
  menuPosition = 'bottom-right',
  children,
}: MoreActionsButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuIsOpen(true);
  };

  const [yPos, xPos] = menuPosition.split('-') as [
    'top' | 'bottom',
    'left' | 'right'
  ];

  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={menuIsOpen ? 'true' : undefined}
        onClick={handleOpenMenu}
      >
        <Icon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
        anchorOrigin={{
          vertical: yPos,
          horizontal: xPos === 'left' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: yPos === 'top' ? 'bottom' : 'top',
          horizontal: xPos === 'left' ? 'right' : 'left',
        }}
      >
        {children}
      </Menu>
    </>
  );
}
