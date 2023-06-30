import React, { ReactNode } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
import { DialogTitle, IconButton } from '@mui/material';

import { FlexBox } from '../FlexBox/FlexBox';

type ResponsiveDialogHeaderProps = {
  onClose: () => void;
  children: ReactNode | string;
  leftIcon?: ReactNode;
};

export function ResponsiveDialogHeader({
  onClose,
  leftIcon,
  children,
}: ResponsiveDialogHeaderProps) {
  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <FlexBox alignItems="center" gap={2} flex={1}>
        {leftIcon}
        {children}
      </FlexBox>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
