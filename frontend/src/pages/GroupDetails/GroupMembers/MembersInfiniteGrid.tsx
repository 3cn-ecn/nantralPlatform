import { Divider, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
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
          <FlexRow sx={{ my: 2 }} alignItems={'center'}>
            <Divider sx={{ backgroundColor: 'red', flex: 1 }} />
            <Typography variant="caption" sx={{ mx: 2 }} color={'primary'}>
              {t('group.details.formerMembers')}
            </Typography>
            <Divider sx={{ backgroundColor: 'red', flex: 1 }} />
          </FlexRow>
          <MembersGrid query={oldMembershipsQuery} group={group} />
        </>
      )}
    </>
  );
}
