import { DialogContent, DialogContentProps } from '@mui/material';

type ResponsiveDialogContentProps = DialogContentProps;

export function ResponsiveDialogContent({
  dividers = true,
  children,
  sx,
  ...props
}: ResponsiveDialogContentProps) {
  return (
    <DialogContent
      dividers={dividers}
      sx={{ display: 'flex', flexDirection: 'column', ...sx }}
      {...props}
    >
      {children}
    </DialogContent>
  );
}
