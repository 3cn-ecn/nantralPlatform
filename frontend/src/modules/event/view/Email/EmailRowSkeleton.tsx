import { Skeleton, TableCell, TableRow, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';

export function EmailRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <FlexRow gap={1} flexWrap={'wrap'}>
          <Typography variant={'h4'}>
            <Skeleton variant={'text'} />
          </Typography>
          <Skeleton variant={'rounded'} width={120} height={32} />
          <Skeleton variant={'rounded'} width={80} height={32} />
          <Skeleton variant={'rounded'} width={100} height={32} />
        </FlexRow>
      </TableCell>
    </TableRow>
  );
}
