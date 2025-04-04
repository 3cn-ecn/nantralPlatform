import axios from 'axios';

import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptTransaction } from '../infra/transaction.adapter';
import { TransactionDTO } from '../infra/transaction.dto';

export async function getTransactionListApi() {
  const { data } = await axios.get<PageDTO<TransactionDTO>>(
    '/api/nantralpay/transaction/',
  );

  return adaptPage(data, adaptTransaction);
}
