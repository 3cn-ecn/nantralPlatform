import { Divider, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { useTranslation } from '#shared/i18n/useTranslation';

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
      <MembersGrid query={membershipsQuery} group={group} />
      {filters.previous && (
        <>
          <Typography variant="caption" sx={{ mt: 2, ml: 1 }} color={'primary'}>
            {t('group.details.formerMembers')}
          </Typography>
          <Divider sx={{ mb: 1, backgroundColor: 'red' }} />
          <MembersGrid query={oldMembershipsQuery} group={group} />
        </>
      )}
    </>
  );
}
