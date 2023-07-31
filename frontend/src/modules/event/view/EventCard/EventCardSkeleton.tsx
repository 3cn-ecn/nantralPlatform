import { Skeleton, useTheme } from '@mui/material';

export function EventCardSkeleton() {
  const theme = useTheme();

  return <Skeleton variant="rounded" height={theme.spacing(36)} />;
}
