import { useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { ModalEditGroup } from '#modules/group/view/Modal/ModalEditGroup';
import { useTranslation } from '#shared/i18n/useTranslation';

export function EditButton({ group }: { group: Group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => setModalOpen(true)}
      >
        {t('group.details.edit')}
      </Button>
      {modalOpen && (
        <ModalEditGroup group={group} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
