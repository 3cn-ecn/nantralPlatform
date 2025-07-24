import { Divider, Typography } from '@mui/material';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { groupBy, map } from 'lodash-es';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Page } from '#shared/infra/pagination';
import { getScholarYear } from '#shared/utils/dateUtils';

import { useInfiniteMembership } from '../hooks/useInfiniteMemberships';
import { MembersGrid } from './MembersGrid';

interface InfiniteMembershipGridProps {
  filters: { previous: boolean };
  group: Group;
}

export function MembersInfiniteGrid({
  filters,
  group,
}: InfiniteMembershipGridProps) {
  const today = new Date(new Date().toDateString());

  const membershipsQuery = useInfiniteMembership({
    options: { group: group.slug, from: today, pageSize: 6 * 5 },
  });

  const oldMembershipsQuery = useInfiniteMembership({
    options: {
      group: group.slug,
      to: today,
      orderBy: '-begin_date',
      pageSize: 6 * 5,
    },
    enabled: filters.previous,
  });

  const oldMembershipsGroupedByYear = groupBy(
    getDataList(oldMembershipsQuery),
    (membership) => getScholarYear(membership.beginDate),
  );

  return (
    <>
      <InfiniteList query={membershipsQuery}>
        <MembersGrid
          memberships={getDataList(membershipsQuery)}
          showSkeletonsAtEnd={getShowSkeleton(membershipsQuery)}
          group={group}
        />
      </InfiniteList>
      {filters.previous && (
        <InfiniteList query={oldMembershipsQuery}>
          {map(oldMembershipsGroupedByYear, (memberships, scholarYear) => (
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
                showSkeletonsAtEnd={getShowSkeleton(oldMembershipsQuery)}
                group={group}
              />
            </>
          ))}
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
