import {
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

export function EmailRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Typography variant={'h6'}>
            <Skeleton variant={'text'} width={150} />
          </Typography>
          <Skeleton variant={'rounded'} width={120} height={32} />
          <Skeleton variant={'rounded'} width={80} height={32} />
          <Skeleton variant={'rounded'} width={100} height={32} />
        </Stack>
      </TableCell>
      <TableCell>
        <Skeleton variant={'circular'} width={40} height={40} />
      </TableCell>
    </TableRow>
  );
}
