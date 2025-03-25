import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { ModalAddItem } from '#modules/nantralpay/view/shared/Modal/ModalAddItem';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AddItemButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setModalOpen(true)}
      >
        {t('group.details.editGroup.add')}
      </Button>
      {modalOpen && <ModalAddItem onClose={() => setModalOpen(false)} />}
    </>
  );
}
