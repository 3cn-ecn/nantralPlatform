import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptOrder } from '../infra/order.adapter';
import { OrderDTO } from '../infra/order.dto';

export async function getOrderListApi() {
  const { data } = await axios
    .get<PageDTO<OrderDTO>>('/api/nantralpay/order/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptOrder);
}
