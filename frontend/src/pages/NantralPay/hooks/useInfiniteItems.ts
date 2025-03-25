import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getItemListApi,
  GetItemListApiParams,
} from '#modules/nantralpay/api/getItemList.api';

export function useInfiniteItems({
  options,
  enabled = true,
}: {
  options: GetItemListApiParams;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getItemListApi({ ...options, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['items', options],
    enabled: enabled,
  });

  return query;
}
