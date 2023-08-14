import { Button, ButtonProps, CircularProgress } from '@mui/material';

type LoadingButtonProps = ButtonProps & { loading: boolean };

export function LoadingButton({
  loading = false,
  disabled,
  color,
  startIcon,
  endIcon,
  ...props
}: LoadingButtonProps) {
  const loadingIcon = <CircularProgress color={color} size="1em" />;

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      color={color}
      startIcon={loading && startIcon ? loadingIcon : startIcon}
      endIcon={loading && !startIcon ? loadingIcon : endIcon}
    />
  );
}
