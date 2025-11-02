import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { MoreHoriz } from '@mui/icons-material';
import { MenuItem } from '@mui/material';

import { CreateGroupModal } from '#pages/GroupList/components/CreateGroupModal';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { IconMenu } from '#shared/components/IconMenu/IconMenu';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export function MoreActionButton({
  showArchive,
  setShowArchived,
  groupTypeQuery,
}: {
  showArchive: boolean;
  setShowArchived: (showArchive: boolean) => void;
  groupTypeQuery: ReturnType<typeof useGroupTypeDetails>;
}) {
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');

  const [params] = useSearchParams();
  const type = useMemo(() => params.get('type'), [params]);

  const [groupFormOpen, setGroupFormOpen] = useState(false);

  return (
    <>
      <IconMenu
        Icon={MoreHoriz}
        size={'medium'}
        disablePortal // show menu when map is fullscreen
      >
        {isSmaller && (
          <MenuItem component={Link} to={`/group?type=${type}`}>
            {t('map.viewList')}
          </MenuItem>
        )}
        <MenuItem onClick={() => setShowArchived(!showArchive)}>
          {showArchive
            ? t('map.moreButton.hideArchive')
            : t('map.moreButton.viewArchive')}
        </MenuItem>
        {type && (
          <MenuItem onClick={() => setGroupFormOpen(true)}>
            {t('map.moreButton.addGroup')}
          </MenuItem>
        )}
      </IconMenu>
      {groupFormOpen && groupTypeQuery.data?.canCreate && (
        <CreateGroupModal
          onClose={() => setGroupFormOpen(false)}
          groupType={groupTypeQuery.data}
          disablePortal // show menu when map is fullscreen
        />
      )}
    </>
  );
}
