import { useState } from 'react';

import { History } from '@mui/icons-material';
import { Chip, Stack } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { useTranslation } from '#shared/i18n/useTranslation';

import { JoinButton } from '../components/Buttons/JoinButton';
import { MembersInfiniteGrid } from './MembersInfiniteGrid';

interface GroupMembersProps {
  group: Group;
}
export function GroupMembers({ group }: GroupMembersProps) {
  const [filters, setFilters] = useState({ previous: false });
  const { t } = useTranslation();
  return (
    <>
      <Stack
        direction="column"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Chip
          icon={<History />}
          disabled={group.groupType.noMembershipDates}
          label={t('group.details.formerMembers')}
          variant={filters.previous ? 'filled' : 'outlined'}
          color={filters.previous ? 'secondary' : 'default'}
          onClick={() =>
            setFilters({ ...filters, previous: !filters.previous })
          }
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <JoinButton group={group} />
        </Stack>
      </Stack>
      <MembersInfiniteGrid group={group} filters={filters} />
    </>
  );
}
