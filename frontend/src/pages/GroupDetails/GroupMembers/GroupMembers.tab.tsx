import { useState } from 'react';

import { History } from '@mui/icons-material';
import { Chip } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';

import { MembersInfiniteGrid } from './MembersInfiniteGrid';

interface GroupMembersProps {
  group: Group;
}
export function GroupMembers({ group }: GroupMembersProps) {
  const [filters, setFilters] = useState({ previous: false });

  return (
    <>
      <FlexRow alignItems={'center'} justifyContent={'space-between'}>
        <Chip
          icon={<History />}
          label={'anciens membres'}
          variant={filters.previous ? 'filled' : 'outlined'}
          color={filters.previous ? 'secondary' : 'default'}
          onClick={() =>
            setFilters({ ...filters, previous: !filters.previous })
          }
        />
      </FlexRow>
      <MembersInfiniteGrid group={group} filters={filters} />
    </>
  );
}
