import { TableCell, TableRow } from '@mui/material';

import { Payment } from '#modules/nantralpay/types/payment.type';

interface PaymentRowProps {
  payment: Payment;
}

export function PaymentRow({ payment }: PaymentRowProps) {
  return (
    <TableRow key={payment.id} sx={{ textDecoration: 'none' }}>
      <TableCell>{payment.id}</TableCell>
      <TableCell>{payment.haPaymentID}</TableCell>
      <TableCell>{payment.haOrderId}</TableCell>
      <TableCell>{payment.status}</TableCell>
      <TableCell>{payment.amount}</TableCell>
      <TableCell>{payment.date.toLocaleString()}</TableCell>
    </TableRow>
  );
}
