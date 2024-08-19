import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';

export function useGroupTypes(pageSize: number) {
  const queryClient = useQueryClient();

  async function getGroupTypesAndCache() {
    const groupTypes = await getGroupTypesApi();
    groupTypes.results.forEach((type) =>
      queryClient.setQueryData(['groupType', type.slug], type),
    );
    return groupTypes;
  }

  const groupTypesQuery = useQuery({
    queryFn: getGroupTypesAndCache,
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
