import { Divider, Grid, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import MembershipCard from '#modules/group/view/MembershipCard/MembershipCard';
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
  const { data: members, ref } = useInfiniteMembership({
    options: { group: group.slug, from: today },
  });
  const { data: oldMembers, ref: oldRef } = useInfiniteMembership({
    options: { group: group.slug, to: today },
    enabled: filters.previous,
  });
  return (
    <>
      <Grid spacing={1} container my={2}>
        {members?.pages
          .flatMap((page) => page.results)
          .map((member) => (
            <MembershipCard group={group} key={member.id} item={member} />
          ))}
        <div ref={ref} />
      </Grid>
      {filters.previous && (
        <>
          <Typography variant="caption" sx={{ mt: 2, ml: 1 }} color={'primary'}>
            {t('group.details.formerMembers')}
          </Typography>
          <Divider sx={{ mb: 1, backgroundColor: 'red' }} />

          <Grid container spacing={1}>
            {oldMembers?.pages
              .flatMap((page) => page.results)
              .map((member) => (
                <MembershipCard group={group} key={member.id} item={member} />
              ))}
            <div ref={oldRef} />
          </Grid>
        </>
      )}
    </>
  );
}
