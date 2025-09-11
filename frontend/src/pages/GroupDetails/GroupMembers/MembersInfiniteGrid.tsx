import { Divider, Typography } from '@mui/material';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { Student } from '#modules/student/student.types';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Page } from '#shared/infra/pagination';
import { getScholarYear } from '#shared/utils/dateUtils';

import { useInfiniteMembership } from '../hooks/useInfiniteMemberships';
import { MembersGrid } from './MembersGrid';

interface InfiniteMembershipGridProps<IsGroup extends boolean, G, S> {
  filters: { previous: boolean; groupType?: string };
  group?: G extends IsGroup ? Group : never;
  student?: S extends IsGroup ? never : Student;
}

export function MembersInfiniteGrid<IsGroup extends boolean, G, S>({
  filters,
  group,
  student,
}: InfiniteMembershipGridProps<IsGroup, G, S>) {
  const today = new Date(new Date().toDateString());

  const membershipsQuery = useInfiniteMembership({
    options: {
      group: group && group.slug,
      student: student && student.id,
      from: today,
      pageSize: 6 * 5,
      groupType: filters.groupType,
    },
  });

  const oldMembershipsQuery = useInfiniteMembership({
    options: {
      group: group && group.slug,
      student: student && student.id,
      to: today,
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
      <InfiniteList query={membershipsQuery}>
        <MembersGrid
          memberships={getDataList(membershipsQuery)}
          showSkeletonsAtEnd={getShowSkeleton(membershipsQuery)}
          group={group}
        />
      </InfiniteList>
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
