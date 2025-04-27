import { QrCode } from '@mui/icons-material';
import { IconButton, TableCell, TableRow } from '@mui/material';

import { Order } from '#modules/nantralpay/types/order.type';

interface OrderRowProps {
  order: Order;
}

export function OrderRow({ order }: OrderRowProps) {
  return (
    <TableRow sx={{ textDecoration: 'none' }}>
      <TableCell>{order.amount}</TableCell>
      <TableCell>{order.date.toLocaleString()}</TableCell>
      <TableCell>{order.receiver}</TableCell>
      <TableCell>{order.description}</TableCell>
      <TableCell>{order.status}</TableCell>
      <TableCell>
        {!order.scanned && (
          <IconButton>
            <QrCode />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}
