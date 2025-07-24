import { Divider, Typography } from '@mui/material';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

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
  const { t } = useTranslation();

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
          <Typography variant="caption" sx={{ mt: 2, ml: 1 }} color={'primary'}>
            {t('group.details.formerMembers')}
          </Typography>
          <Divider sx={{ mb: 1, backgroundColor: 'red' }} />
          <MembersGrid
            memberships={getDataList(oldMembershipsQuery)}
            showSkeletonsAtEnd={getShowSkeleton(oldMembershipsQuery)}
            group={group}
          />
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
