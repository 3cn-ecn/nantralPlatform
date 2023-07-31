import { Dialog, DialogProps } from '@mui/material';

import { useBreakpoint } from '#shared/utils/useBreakpoint';

type ResponsiveDialogProps = Omit<DialogProps, 'fullScreen' | 'open'> & {
  open?: boolean;
};

export function ResponsiveDialog({
  open = true,
  scroll = 'paper',
  fullWidth = true,
  maxWidth = 'md',
  children,
  ...props
}: ResponsiveDialogProps) {
  const fullScreen = useBreakpoint('md').isSmaller;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      scroll={scroll}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      {...props}
    >
      {children}
    </Dialog>
  );
}
