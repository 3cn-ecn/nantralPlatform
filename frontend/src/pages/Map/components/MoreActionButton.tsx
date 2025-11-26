import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { MoreHoriz } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';

import { CreateGroupModal } from '#pages/GroupList/components/CreateGroupModal';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowArchive = () => {
    handleClose();
    setShowArchived(!showArchive);
  };
  const handleCreateGroup = () => {
    setGroupFormOpen(true);
    handleClose();
  };

  const [groupFormOpen, setGroupFormOpen] = useState(false);

  return (
    <>
      <Tooltip title={t('map.moreButton.tooltip')}>
        <IconButton onClick={handleClick} size={'medium'}>
          <MoreHoriz fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disablePortal // show menu when map is fullscreen
      >
        {isSmaller && (
          <MenuItem component={Link} to={`/group?type=${type}`}>
            {t('map.viewList')}
          </MenuItem>
        )}
        <MenuItem onClick={handleShowArchive}>
          {showArchive
            ? t('map.moreButton.hideArchive')
            : t('map.moreButton.viewArchive')}
        </MenuItem>
        {type && groupTypeQuery.data?.canCreate && (
          <MenuItem onClick={handleCreateGroup}>
            {t('map.moreButton.addGroup')}
          </MenuItem>
        )}
      </Menu>
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
