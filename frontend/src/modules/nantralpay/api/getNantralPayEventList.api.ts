import axios from 'axios';

import { adaptNantralPayEvent } from '#modules/nantralpay/infra/nantralpayEvent.adapter';
import { NantralPayEventDTO } from '#modules/nantralpay/infra/nantralpayEvent.dto';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

export interface GetEventListApiParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  search?: string | null;
}

export async function getNantralPayEventListApi(
  options: GetEventListApiParams,
) {
  const { data } = await axios
    .get<PageDTO<NantralPayEventDTO>>('/api/nantralpay/event/', {
      params: {
        page: options.page,
        page_size: options.pageSize,
        ordering: options.orderBy,
        search: options.search,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptNantralPayEvent);
}
