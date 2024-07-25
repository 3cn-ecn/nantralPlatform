import { Divider, Grid, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import MembershipCard from '#modules/group/view/MembershipCard/MembershipCard';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useInfiniteMembership } from '../hooks/useInfiniteMemberships';

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
    options: { group: group.slug, from: today },
  });
  const oldMembershipsQuery = useInfiniteMembership({
    options: { group: group.slug, to: today, orderBy: '-begin_date' },
    enabled: filters.previous,
  });
  return (
    <>
      <InfiniteList query={membershipsQuery}>
        <Grid spacing={1} container my={2}>
          {membershipsQuery.data?.pages
            .flatMap((page) => page.results)
            .map((member) => (
              <MembershipCard group={group} key={member.id} item={member} />
            ))}
        </Grid>
      </InfiniteList>
      {filters.previous && (
        <>
          <Typography variant="caption" sx={{ mt: 2, ml: 1 }} color={'primary'}>
            {t('group.details.formerMembers')}
          </Typography>
          <Divider sx={{ mb: 1, backgroundColor: 'red' }} />
          <InfiniteList query={oldMembershipsQuery}>
            <Grid container spacing={1}>
              {oldMembershipsQuery.data?.pages
                .flatMap((page) => page.results)
                .map((member) => (
                  <MembershipCard group={group} key={member.id} item={member} />
                ))}
            </Grid>
          </InfiniteList>
        </>
      )}
    </>
  );
}
