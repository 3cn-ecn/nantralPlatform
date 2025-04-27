import { Transaction } from '../types/transaction.type';
import { TransactionDTO } from './transaction.dto';

export function adaptTransactionSale(transactionDto: TransactionDTO): string {
  return transactionDto.qr_code;
}

export function adaptTransaction(transactionDto: TransactionDTO): Transaction {
  return {
    id: transactionDto.id ?? 0,
    qrCode: transactionDto.qr_code ?? '',
    amount: transactionDto.amount ?? 0,
    date: new Date(transactionDto.date),
    sender: transactionDto.sender ?? '',
    receiver: transactionDto.receiver ?? '',
    description: transactionDto.description ?? '',
    group: transactionDto.group ?? '',
  };
}
