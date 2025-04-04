import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Event } from '#modules/event/event.type';
import { ModalAddItem } from '#modules/nantralpay/view/Modal/ModalAddItem';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AddItemButton({ event }: { event: Event }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setModalOpen(true)}
      >
        {t('nantralpay.editEvent.add')}
      </Button>
      {modalOpen && (
        <ModalAddItem onClose={() => setModalOpen(false)} event={event} />
      )}
    </>
  );
}
