import { useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import { EditEventModal } from '#modules/event/view/Modals/EditEventModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface EditButtonProps {
  eventId: number;
}

export function EditButton({ eventId }: EditButtonProps) {
  const { t } = useTranslation();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  return (
    <>
      <MenuItem onClick={() => setIsOpenEditModal(true)}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText>{t('event.action_menu.edit')}</ListItemText>
      </MenuItem>

      {isOpenEditModal && (
        <EditEventModal
          eventId={eventId}
          onClose={() => setIsOpenEditModal(false)}
        />
      )}
    </>
  );
}
