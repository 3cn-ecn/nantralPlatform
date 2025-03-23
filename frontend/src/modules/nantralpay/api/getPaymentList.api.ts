import axios from 'axios';

import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptPayment } from '../infra/payment.adapter';
import { PaymentDTO } from '../infra/payment.dto';

export async function getPaymentListApi() {
  const { data } = await axios.get<PageDTO<PaymentDTO>>(
    '/api/nantralpay/payment/',
  );

  return adaptPage(data, adaptPayment);
}
