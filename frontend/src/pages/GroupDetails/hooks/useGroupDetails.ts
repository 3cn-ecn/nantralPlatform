import { useQuery } from '@tanstack/react-query';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { useAuth } from '#shared/context/Auth.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useGroupDetails(slug: string) {
  const { isAuthenticated } = useAuth();

  const groupQuery = useQuery<Group, ApiError>({
    queryFn: () => getGroupDetailsApi(slug),
    queryKey: ['group', { slug: slug }],
  });

  const eventsQuery = useQuery<Page<EventPreview>, ApiError>({
    queryFn: () => getEventListApi({ group: [slug] }),
    queryKey: ['groupEvents', { slug: slug }],
    enabled: isAuthenticated,
  });

  const membersQuery = useQuery<Page<Membership>, ApiError>({
    queryFn: () => getMembershipListApi({ group: slug, pageSize: 1 }),
    queryKey: ['members', { slug: slug, pageSize: 1 }],
    enabled: isAuthenticated,
  });

  return {
    groupDetails: groupQuery.data,
    events: eventsQuery.data,
    members: membersQuery.data,
    isLoading:
      groupQuery.isLoading ||
      (isAuthenticated && (eventsQuery.isLoading || membersQuery.isLoading)),
    isError: groupQuery.isError || eventsQuery.isError || membersQuery.isError,
    refetch: () => {
      groupQuery.refetch();
      eventsQuery.refetch();
      membersQuery.refetch();
    },
    error: groupQuery.error || eventsQuery.error || membersQuery.error,
    isSuccess:
      (groupQuery.isSuccess && !isAuthenticated) ||
      (eventsQuery.isSuccess && membersQuery.isSuccess),
  };
}
