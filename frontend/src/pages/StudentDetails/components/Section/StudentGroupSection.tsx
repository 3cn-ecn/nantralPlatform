import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Chip, Divider, Typography } from '@mui/material';
import { roundToNearestMinutes } from 'date-fns';

import { Student } from '#modules/student/student.types';
import { useGroupTypes } from '#pages/Group/hooks/useGroupTypes';
import { MembersGrid } from '#pages/GroupDetails/GroupMembers/MembersGrid';
import { useInfiniteMembership } from '#pages/GroupDetails/hooks/useInfiniteMemberships';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { CheckboxField } from '#shared/components/FormFields';

export function StudentGroupsSection({ student }: { student: Student }) {
  const { groupTypesQuery } = useGroupTypes(1);
  const today = roundToNearestMinutes(new Date());
  const [type, setType] = useState<string>('all');
  const [showFormerGroups, setShowFormerGroups] = useState(false);
  const membershipQuery = useInfiniteMembership({
    options: {
      student: student?.id,
      from: today,
      groupType: type === 'all' ? undefined : type,
    },
  });

  const formerMembershipQuery = useInfiniteMembership({
    options: {
      student: student?.id,
      to: today,
      groupType: type === 'all' ? undefined : type,
    },
    enabled: showFormerGroups,
  });

  return (
    <>
      <Typography variant="h2">Groupes</Typography>
      <FlexRow
        alignItems="center"
        gap={1}
        mt={2}
        pb={1}
        overflow={'scroll'}
        sx={{ scrollbarWidth: 'none' }}
      >
        <Chip
          variant={type === 'all' ? 'filled' : 'outlined'}
          label={'All'}
          onClick={() => setType('all')}
        />
        {groupTypesQuery.data?.results.map((groupType) => (
          <Chip
            variant={groupType.slug === type ? 'filled' : 'outlined'}
            key={groupType.slug}
            label={groupType.name}
            onClick={() => setType(groupType.slug)}
          />
        ))}
      </FlexRow>
      <CheckboxField
        label={showFormerGroups ? 'Hide former groups' : 'Show former groups'}
        value={showFormerGroups}
        checkboxProps={{ icon: <Visibility />, checkedIcon: <VisibilityOff /> }}
        handleChange={(val) => setShowFormerGroups(val)}
      />
      <MembersGrid query={membershipQuery} />
      {!groupTypesQuery.data?.results.find((item) => type == item.slug)
        ?.noMembershipDates &&
        showFormerGroups && (
          <>
            <FlexRow alignItems="center">
              <Divider sx={{ flex: 1, backgroundColor: 'red' }} />
              <Typography sx={{ mx: 2, color: 'red' }}>
                Former groups
              </Typography>
              <Divider sx={{ flex: 1, backgroundColor: 'red' }} />
            </FlexRow>
            <MembersGrid query={formerMembershipQuery} />
          </>
        )}
    </>
  );
}
