import axios from 'axios';

import { adaptItemPreview } from '#modules/nantralpay/infra/item.adapter';
import { ItemDTO } from '#modules/nantralpay/infra/item.dto';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

export interface ItemListQueryParams {
  event: number;
  page?: number;
  pageSize?: number;
}

export async function getItemListApi(params: ItemListQueryParams) {
  const { data } = await axios
    .get<PageDTO<ItemDTO>>('/api/nantralpay/item/', {
      params: {
        page: params.page,
        page_size: params.pageSize,
        event: params.event,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptItemPreview);
}
