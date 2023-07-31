import { useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { EditEventModal } from '#modules/event/view/Modals/EditEventModal';
import { useTranslation } from '#shared/i18n/useTranslation';

type EditButtonProps = {
  eventId: number;
};

export function EditButton({ eventId }: EditButtonProps) {
  const { t } = useTranslation();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  return (
    <>
      <Button
        startIcon={<EditIcon />}
        variant="outlined"
        color="secondary"
        onClick={() => setIsOpenEditModal(true)}
      >
        {t('event.action_menu.edit')}
      </Button>

      {isOpenEditModal && (
        <EditEventModal
          eventId={eventId}
          onClose={() => setIsOpenEditModal(false)}
        />
      )}
    </>
  );
}
