import { Button, ButtonProps, CircularProgress } from '@mui/material';

type LoadingButtonProps = ButtonProps & { loading: boolean };

export function LoadingButton({
  loading = false,
  disabled,
  color,
  endIcon,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      color={color}
      endIcon={
        loading ? <CircularProgress color={color} size="1em" /> : endIcon
      }
    />
  );
}
