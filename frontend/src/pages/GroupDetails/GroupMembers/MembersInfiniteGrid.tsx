import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Divider, Typography } from '@mui/material';
import { UseInfiniteQueryResult, useQuery } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';

import { User } from '#modules/account/user.types';
import { getGroupHistoryApi } from '#modules/group/api/getGroupHistory.api';
import { Group } from '#modules/group/types/group.types';
import { GroupHistory } from '#modules/group/types/groupHistory.type';
import { Membership } from '#modules/group/types/membership.types';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Page } from '#shared/infra/pagination';
import { getScholarYear } from '#shared/utils/dateUtils';

import { useInfiniteMembership } from '../hooks/useInfiniteMemberships';
import { MembersGrid } from './MembersGrid';

interface InfiniteMembershipGridProps {
  filters: { previous: boolean; groupType?: string };
  group?: Group;
  user?: User;
}

export function MembersInfiniteGrid({
  filters,
  group,
  user,
}: InfiniteMembershipGridProps) {
  const today = new Date(new Date().toDateString());
  const [searchParams] = useSearchParams();
  const versionId = useMemo(() => searchParams.get('version'), [searchParams]);
  const versionQuery = useQuery<GroupHistory | undefined>({
    queryKey: ['version', versionId, group?.slug],
    queryFn: () => {
      if (!group || versionId === null) {
        return new Promise(() => undefined);
      }
      return getGroupHistoryApi(group?.slug, Number(versionId));
    },
  });

  const membershipsQuery = useInfiniteMembership({
    options: {
      group: group && group.slug,
      user: user && user.id,
      from: versionQuery.data?.historyDate || today,
      to: versionQuery.data?.nextHistoryDate,
      pageSize: 6 * 5,
      groupType: filters.groupType,
    },
  });

  const oldMembershipsQuery = useInfiniteMembership({
    options: {
      group: group && group.slug,
      user: user && user.id,
      before: versionQuery.data ? undefined : today,
      orderBy: '-begin_date',
      pageSize: 6 * 5,
      groupType: filters.groupType,
    },
    enabled: filters.previous,
  });

  const oldMembershipsGroupedByYear = Object.entries(
    groupBy(getDataList(oldMembershipsQuery), (membership) =>
      getScholarYear(membership.beginDate),
    ),
  );

  return (
    <>
      {(!filters.previous || !versionQuery.data) && (
        <InfiniteList query={membershipsQuery}>
          <MembersGrid
            memberships={getDataList(membershipsQuery)}
            showSkeletonsAtEnd={getShowSkeleton(membershipsQuery)}
            group={group}
          />
        </InfiniteList>
      )}
      {filters.previous && (
        <InfiniteList query={oldMembershipsQuery}>
          {oldMembershipsGroupedByYear.map(
            ([scholarYear, memberships], index) => (
              <>
                <Typography
                  variant="caption"
                  sx={{ mt: 2, ml: 1 }}
                  color={'primary'}
                >
                  {scholarYear}
                </Typography>
                <Divider sx={{ mb: 1, borderColor: 'primary.main' }} />
                <MembersGrid
                  memberships={memberships}
                  showSkeletonsAtEnd={
                    getShowSkeleton(oldMembershipsQuery) &&
                    index === oldMembershipsGroupedByYear.length - 1
                  }
                  group={group}
                />
              </>
            ),
          )}
        </InfiniteList>
      )}
    </>
  );
}

function getDataList(
  query: UseInfiniteQueryResult<Page<Membership>>,
): Membership[] {
  return query.data?.pages.flatMap((page) => page.results) ?? [];
}

function getShowSkeleton(
  query: UseInfiniteQueryResult<Page<Membership>>,
): boolean {
  return query.isLoading || query.isFetchingNextPage;
}
