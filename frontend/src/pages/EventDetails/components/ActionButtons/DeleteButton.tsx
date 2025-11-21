import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Delete as DeleteIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteEventApi } from '#modules/event/api/deleteEvent.api';
import { Event } from '#modules/event/event.type';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface DeleteButtonProps {
  event: Event;
}

export function DeleteButton({ event }: DeleteButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, mutate: deleteEvent } = useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      setIsOpenDeleteModal(false);
      queryClient.invalidateQueries(['events']).then(() => navigate('/event'));
    },
  });

  return (
    <>
      <MenuItem onClick={() => setIsOpenDeleteModal(true)}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText>{t('event.action_menu.delete')}</ListItemText>
      </MenuItem>

      {isOpenDeleteModal && (
        <ConfirmationModal
          title={t('event.action_menu.deleteModal.title')}
          body={t('event.action_menu.deleteModal.body', {
            title: event.title,
          })}
          onCancel={() => setIsOpenDeleteModal(false)}
          onConfirm={() => deleteEvent(event.id)}
          loading={isLoading}
        />
      )}
    </>
  );
}
