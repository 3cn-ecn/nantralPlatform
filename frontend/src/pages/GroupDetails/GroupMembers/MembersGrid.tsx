import { Grid, Typography } from '@mui/material';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import MembershipCard from '#modules/group/view/MembershipCard/MembershipCard';
import { MembershipCardSkeleton } from '#modules/group/view/MembershipCard/MembershipCardSkeleton';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

export function MembersGrid({
  query,
  group,
}: {
  query: UseInfiniteQueryResult<Page<Membership>>;
  group?: Group;
}) {
  const { t } = useTranslation();
  return (
    <InfiniteList query={query}>
      <Grid spacing={1} container my={2}>
        {query.data?.pages
          .flatMap((page) => page.results)
          .map((member) => (
            <MembershipCard group={group} key={member.id} item={member} />
          ))}
        {query.data?.pages[0].count === 0 && (
          <Typography px={2}>
            {t('group.details.modal.editGroup.noMembers')}
          </Typography>
        )}
        {(query.isLoading || query.isFetchingNextPage) &&
          Array(6)
            .fill(0)
            // eslint-disable-next-line react/no-array-index-key
            .map((_, i) => <MembershipCardSkeleton key={i} />)}
      </Grid>
    </InfiniteList>
  );
}
