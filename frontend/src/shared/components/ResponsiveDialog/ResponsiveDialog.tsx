import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
