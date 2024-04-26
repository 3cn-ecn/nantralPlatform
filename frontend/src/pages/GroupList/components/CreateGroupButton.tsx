import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateGroupModal } from './CreateGroupModal';

export function CreateGroupButton({ groupType }: { groupType: string }) {
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Tooltip title={t('event.createNewEvent')}>
        <Fab
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setGroupFormOpen(true)}
          color="primary"
        >
          <Add />
        </Fab>
      </Tooltip>
      {groupFormOpen && (
        <CreateGroupModal
          onClose={() => setGroupFormOpen(false)}
          groupType={groupType}
        />
      )}
    </>
  );
}
