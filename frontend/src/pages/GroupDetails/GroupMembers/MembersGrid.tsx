import { Grid, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import MembershipCard from '#modules/group/view/MembershipCard/MembershipCard';
import { MembershipCardSkeleton } from '#modules/group/view/MembershipCard/MembershipCardSkeleton';
import { useTranslation } from '#shared/i18n/useTranslation';

interface MembersGridProps {
  memberships: Membership[];
  showSkeletonsAtEnd: boolean;
  group: Group;
}

export function MembersGrid({
  memberships,
  showSkeletonsAtEnd,
  group,
}: MembersGridProps) {
  const { t } = useTranslation();

  return (
    <Grid spacing={1} container my={2}>
      {memberships.map((member) => (
        <MembershipCard group={group} key={member.id} item={member} />
      ))}
      {memberships.length === 0 && (
        <Typography px={2}>
          {t('group.details.modal.editGroup.noMembers')}
        </Typography>
      )}
      {showSkeletonsAtEnd &&
        Array(6)
          .fill(0)
          // eslint-disable-next-line react/no-array-index-key
          .map((_, i) => <MembershipCardSkeleton key={i} />)}
    </Grid>
  );
}
