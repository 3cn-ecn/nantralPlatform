import { useQueries, useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';

export function useGroupTypes(pageSize: number) {
  const groupTypesQuery = useQuery({
    queryFn: getGroupTypesApi,
    queryKey: ['getGroupTypes'],
  });

  const listQueries = useQueries({
    queries:
      groupTypesQuery.data?.results.map((groupType) => ({
        queryFn: () =>
          getGroupListApi({ type: groupType.slug, pageSize: pageSize }),
        queryKey: ['getGroupList', groupType.slug],
        enabled: groupTypesQuery.isSuccess,
      })) || [],
  });

  return { listQueries, groupTypesQuery };
}
