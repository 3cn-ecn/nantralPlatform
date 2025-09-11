import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';

export function useGroupTypes(pageSize: number, isMap?: boolean) {
  const queryClient = useQueryClient();

  async function getGroupTypesAndCache() {
    const groupTypes = await getGroupTypesApi(isMap);
    groupTypes.results.forEach((type) =>
      queryClient.setQueryData(['groupType', type.slug, isMap], type),
    );
    return groupTypes;
  }

  const groupTypesQuery = useQuery({
    queryFn: getGroupTypesAndCache,
    queryKey: ['getGroupTypes', isMap],
  });

  const listQueries = useQueries({
    queries:
      groupTypesQuery.data?.results.map((groupType) => ({
        queryFn: () =>
          getGroupListApi({ type: groupType.slug, pageSize: pageSize }),
        queryKey: [
          'getGroupList',
          { slug: groupType.slug, pageSize: pageSize },
        ],
        enabled: groupTypesQuery.isSuccess,
      })) || [],
  });

  return { listQueries, groupTypesQuery };
}
