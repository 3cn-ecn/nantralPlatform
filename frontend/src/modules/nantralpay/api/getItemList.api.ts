import axios from 'axios';

import { adaptItemPreview } from '#modules/nantralpay/infra/item.adapter';
import { ItemDTO } from '#modules/nantralpay/infra/item.dto';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

export interface GetItemListApiParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

export async function getItemListApi(options: GetItemListApiParams) {
  const { data } = await axios
    .get<PageDTO<ItemDTO>>('/api/nantralpay/item/', {
      params: {
        page: options.page,
        page_size: options.pageSize,
        ordering: options.orderBy,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptItemPreview);
}
