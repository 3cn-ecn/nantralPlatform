import { Skeleton } from '@mui/material';

export function EventCardSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      height="22.85rem"
      sx={{ fontSize: '1rem' }}
    />
  );
}
