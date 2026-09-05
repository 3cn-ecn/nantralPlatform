import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';

export function useGroupChildren({ slug }: { slug: string }) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getGroupListApi({ parent: slug, page: pageParam, pageSize: 50 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['children', { slug: slug }],
  });

  return query;
}
