import { Skeleton, TableCell, TableRow } from '@mui/material';

export function PaymentRowSkeleton() {
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
