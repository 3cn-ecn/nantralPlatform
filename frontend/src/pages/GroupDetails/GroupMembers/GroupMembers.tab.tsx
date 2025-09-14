import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { Group } from '#modules/group/types/group.types';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { CheckboxField } from '#shared/components/FormFields';
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
      <FlexRow alignItems={'center'} justifyContent={'space-between'}>
        <CheckboxField
          value={filters.previous}
          disabled={group.groupType.noMembershipDates}
          handleChange={(val) => setFilters({ ...filters, previous: val })}
          label={
            filters.previous
              ? t('group.details.hideFormerMembers')
              : t('group.details.showFormerMembers')
          }
          checkboxProps={{
            icon: <Visibility />,
            checkedIcon: <VisibilityOff />,
          }}
        />
        <FlexAuto gap={2}>
          <JoinButton group={group} />
        </FlexAuto>
      </FlexRow>
      <MembersInfiniteGrid group={group} filters={filters} />
    </>
  );
}
