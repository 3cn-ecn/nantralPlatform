import { Skeleton, TableCell, TableRow } from '@mui/material';

export function OrderRowSkeleton() {
  return (
    <TableRow>
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
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton></Skeleton>
      </TableCell>
    </TableRow>
  );
}
