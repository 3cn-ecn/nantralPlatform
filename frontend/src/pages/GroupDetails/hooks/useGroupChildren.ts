import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';

export function useGroupChildren({ slug }: { slug: string }) {
  const query = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getGroupListApi({ parent: slug, page: pageParam, pageSize: 50 }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next && allPages.length + 1,
    queryKey: ['children', { slug: slug }],
  });

  return query;
}
