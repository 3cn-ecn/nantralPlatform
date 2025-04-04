import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  getItemListApi,
  ItemListQueryParams,
} from '#modules/nantralpay/api/getItemList.api';
import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useItemListQuery(
  queryParams: Omit<ItemListQueryParams, 'page'>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<ItemPreview>, ApiError>({
    queryKey: ['items', queryParams, { page }],
    queryFn: () =>
      getItemListApi({
        page: page,
        ...queryParams,
      }),
  });

  return {
    ...query,
    page,
    setPage,
  };
}
