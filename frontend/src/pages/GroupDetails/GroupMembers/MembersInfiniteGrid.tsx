import { Divider, Typography } from '@mui/material';
import { groupBy } from 'lodash-es';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { Student } from '#modules/student/student.types';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Page } from '#shared/infra/pagination';
import { getScholarYear } from '#shared/utils/dateUtils';

import { useInfiniteMembership } from '../hooks/useInfiniteMemberships';
import { MembersGrid } from './MembersGrid';

interface InfiniteMembershipGridProps {
  filters: { previous: boolean; groupType?: string };
  group?: Group;
  student?: Student;
}

export function MembersInfiniteGrid({
  filters,
  group,
  student,
}: InfiniteMembershipGridProps) {
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
    groupBy(getDataList(oldMembershipsQuery.data?.pages), (membership) =>
      getScholarYear(membership.beginDate),
    ),
  );

  return (
    <>
      <InfiniteList query={membershipsQuery}>
        <MembersGrid
          memberships={getDataList(membershipsQuery.data?.pages)}
          showSkeletonsAtEnd={membershipsQuery.isPending}
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
                    oldMembershipsQuery.isPending &&
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

function getDataList(pages: Page<Membership>[] | undefined): Membership[] {
  return pages?.flatMap((page) => page.results) ?? [];
}
