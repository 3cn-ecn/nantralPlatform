import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';

import { User } from '#modules/account/user.types';
import { useGroupTypes } from '#pages/Group/hooks/useGroupTypes';
import { MembersInfiniteGrid } from '#pages/GroupDetails/GroupMembers/MembersInfiniteGrid';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { CheckboxField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function StudentGroupsSection({ user }: { user: User }) {
  const { groupTypesQuery } = useGroupTypes(1);
  const { t } = useTranslation();
  const [type, setType] = useState<string | undefined>(undefined);
  const [showFormerGroups, setShowFormerGroups] = useState(false);

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
          variant={type === undefined ? 'filled' : 'outlined'}
          label={'All'}
          onClick={() => setType(undefined)}
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
      {!groupTypesQuery.data?.results.find((item) => type == item.slug)
        ?.noMembershipDates && (
        <CheckboxField
          label={
            showFormerGroups
              ? t('student.detail.hideFormerGroups')
              : t('student.detail.showFormerGroups')
          }
          value={showFormerGroups}
          checkboxProps={{
            icon: <Visibility />,
            checkedIcon: <VisibilityOff />,
          }}
          handleChange={(val) => setShowFormerGroups(val)}
        />
      )}

      <MembersInfiniteGrid
        filters={{ previous: showFormerGroups, groupType: type }}
        user={user}
      />
    </>
  );
}
