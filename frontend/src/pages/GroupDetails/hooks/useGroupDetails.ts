import { useQuery } from '@tanstack/react-query';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { Group } from '#modules/group/types/group.types';
import { useAuth } from '#shared/context/Auth.context';
import { ApiError } from '#shared/infra/errors';

export function useGroupDetails(slug?: string) {
  const { isAuthenticated } = useAuth();
  const {
    data: groupDetails,
    isLoading,
    isError,
    refetch,
    error,
    isSuccess,
  } = useQuery<Group, ApiError>({
    queryFn: () => getGroupDetailsApi(slug || ''),
    queryKey: ['group', { slug: slug }, isAuthenticated],
  });
  const { data: events } = useQuery({
    queryFn: () => getEventListApi({ group: [slug || ''] }),
    queryKey: ['groupEvents', { slug: slug }, isAuthenticated],
  });

  const { data: members } = useQuery({
    queryFn: () => getMembershipListApi({ group: slug }),
    queryKey: ['members', { slug: slug }, isAuthenticated],
  });

  return {
    groupDetails,
    events,
    members,
    isLoading,
    isError,
    refetch,
    error,
    isSuccess,
  };
}
