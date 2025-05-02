import { MouseEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { MoreHoriz } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { CreateGroupModal } from '#pages/GroupList/components/CreateGroupModal';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export function MoreActionButton({
  showArchive,
  setShowArchive,
  groupTypeQuery,
}: {
  showArchive: boolean;
  setShowArchive: (showArchive: boolean) => void;
  groupTypeQuery: ReturnType<typeof useGroupTypeDetails>;
}) {
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');

  const [params] = useSearchParams();
  const type = useMemo(() => params.get('type'), [params]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [groupFormOpen, setGroupFormOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="more"
        id="more-button"
        aria-controls={open ? 'more-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'more-button',
        }}
      >
        {isSmaller && (
          <MenuItem
            component={Link}
            to={`/group?type=${type}`}
            onClick={handleClose}
          >
            {t('map.viewList')}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setShowArchive(!showArchive);
            handleClose();
          }}
        >
          {showArchive
            ? t('map.moreButton.hideArchive')
            : t('map.moreButton.viewArchive')}
        </MenuItem>
        {type && (
          <MenuItem
            onClick={() => {
              setGroupFormOpen(true);
              handleClose();
            }}
          >
            {t('map.moreButton.addGroup')}
          </MenuItem>
        )}
      </Menu>
      {groupFormOpen && groupTypeQuery.data && (
        <CreateGroupModal
          onClose={() => setGroupFormOpen(false)}
          groupType={groupTypeQuery.data}
        />
      )}
    </>
  );
}
