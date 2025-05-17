import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptOrder } from '../infra/order.adapter';
import { OrderDTO } from '../infra/order.dto';

interface OrderParams {
  page?: number;
  pageSize?: number;
}

export async function getOrderListApi(options: OrderParams) {
  const { data } = await axios
    .get<PageDTO<OrderDTO>>('/api/nantralpay/order/', {
      params: {
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptOrder);
}
