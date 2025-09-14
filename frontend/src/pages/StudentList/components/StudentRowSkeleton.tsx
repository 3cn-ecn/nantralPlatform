import { Skeleton, TableCell, TableRow } from '@mui/material';

import { AVATAR_SIZES } from '#shared/components/Avatar/Avatar';

export function StudentRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton
          variant="circular"
          width={AVATAR_SIZES.m}
          height={AVATAR_SIZES.m}
        ></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
    </TableRow>
  );
}
