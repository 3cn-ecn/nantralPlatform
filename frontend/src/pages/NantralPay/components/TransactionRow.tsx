import { TableCell, TableRow } from '@mui/material';

import { Transaction } from '#modules/nantralpay/types/transaction.type';

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <TableRow key={transaction.id} sx={{ textDecoration: 'none' }}>
      <TableCell>{transaction.id}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.sender}</TableCell>
      <TableCell>{transaction.receiver}</TableCell>
      <TableCell>{transaction.group}</TableCell>
      <TableCell>{transaction.amount}</TableCell>
      <TableCell>{transaction.date.toLocaleString()}</TableCell>
    </TableRow>
  );
}
