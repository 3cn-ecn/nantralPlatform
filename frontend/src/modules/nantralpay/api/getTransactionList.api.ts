import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptTransaction } from '../infra/transaction.adapter';
import { TransactionDTO } from '../infra/transaction.dto';

export async function getTransactionListApi() {
  const { data } = await axios
    .get<PageDTO<TransactionDTO>>('/api/nantralpay/transaction/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptTransaction);
}
