import React from 'react';

import { DialogContent, DialogContentProps } from '@mui/material';

type ResponsiveDialogContentProps = DialogContentProps;

export function ResponsiveDialogContent({
  dividers = true,
  children,
  ...props
}: ResponsiveDialogContentProps) {
  return (
    <DialogContent dividers={dividers} {...props}>
      {children}
    </DialogContent>
  );
}
