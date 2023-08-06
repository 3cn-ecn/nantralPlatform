import { Skeleton } from '@mui/material';

export function CalendarEventBlockSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        maxWidth: '95%',
        mb: 0.25,
        boxShadow: 1,
      }}
    />
  );
}
