import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';

import { User } from '#modules/account/user.types';
import { useGroupTypes } from '#pages/Group/hooks/useGroupTypes';
import { MembersInfiniteGrid } from '#pages/GroupDetails/GroupMembers/MembersInfiniteGrid';
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
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          mt: 2,
          pb: 1,
          overflow: 'scroll',
          scrollbarWidth: 'none',
        }}
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
      </Stack>
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
