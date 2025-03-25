import { Grid, Skeleton } from '@mui/material';

export function ItemCardSkeleton() {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Skeleton variant="rounded" height={60} />
    </Grid>
  );
}
