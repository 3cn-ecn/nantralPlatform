import { useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { ModalEditGroup } from '#modules/group/view/Modal/ModalEditGroup';
import { useTranslation } from '#shared/i18n/useTranslation';

export function EditButton({ group }: { group: Group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        onClick={() => setModalOpen(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <EditIcon sx={{ mr: 1 }} />
        {t('group.details.edit')}
      </Fab>
      {modalOpen && (
        <ModalEditGroup group={group} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
