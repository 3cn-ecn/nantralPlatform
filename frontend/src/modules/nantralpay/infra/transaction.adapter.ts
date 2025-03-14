import { TransactionDTO } from './transaction.dto';

export function adaptTransaction(transactionDto: TransactionDTO): string {
  return transactionDto.qr_code;
}
