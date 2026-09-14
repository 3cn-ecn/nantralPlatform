import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { UserPreview } from '#modules/account/user.types';
import { getSportEventNonParticipantListApi } from '#modules/event/api/getSportEventNonParticipantList.api';
import { getSportEventParticipantListApi } from '#modules/event/api/getSportEventParticipantList.api';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export type SportEventPeopleKind = 'participants' | 'nonParticipants';

type UseSportEventPeopleListOptions = Pick<
  UseInfiniteQueryOptions<Page<UserPreview>, ApiError>,
  'enabled'
>;

export function useSportEventPeopleList(
  sportEventId: number,
  kind: SportEventPeopleKind,
  options: UseSportEventPeopleListOptions = {},
) {
  const queryFn =
    kind === 'participants'
      ? getSportEventParticipantListApi
      : getSportEventNonParticipantListApi;

  return useInfiniteQuery<Page<UserPreview>, ApiError>({
    queryKey: ['sport-event-people', sportEventId, kind],
    queryFn: ({ pageParam = 1 }) =>
      queryFn(sportEventId, {
        page: pageParam,
        pageSize: 50,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    ...options,
  });
}
