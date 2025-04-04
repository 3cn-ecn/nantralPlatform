import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptPayment } from '../infra/payment.adapter';
import { PaymentDTO } from '../infra/payment.dto';

export async function getPaymentListApi() {
  const { data } = await axios
    .get<PageDTO<PaymentDTO>>('/api/nantralpay/payment/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptPayment);
}
