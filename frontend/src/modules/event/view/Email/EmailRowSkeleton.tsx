import { Skeleton, TableCell, TableRow, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';

export function EmailRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <FlexRow gap={1} flexWrap={'wrap'}>
          <Typography variant={'h6'}>
            <Skeleton variant={'text'} width={150} />
          </Typography>
          <Skeleton variant={'rounded'} width={120} height={32} />
          <Skeleton variant={'rounded'} width={80} height={32} />
          <Skeleton variant={'rounded'} width={100} height={32} />
        </FlexRow>
      </TableCell>
      <TableCell>
        <Skeleton variant={'circular'} width={40} height={40} />
      </TableCell>
    </TableRow>
  );
}
