import { useState } from 'react';

import {
  Event as EventIcon,
  PostAdd as PostAddIcon,
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import EditEventModal from '#shared/components/FormEvent/FormEvent';
import { FormPost } from '#shared/components/FormPost/FormPost';
import { useTranslation } from '#shared/i18n/useTranslation';

type CreateNewButtonProps = {
  onEventCreated: () => void;
  onPostCreated: () => void;
};

export function CreateNewButton({
  onEventCreated,
  onPostCreated,
}: CreateNewButtonProps) {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const actions = [
    {
      icon: <EventIcon />,
      name: t('event.event'),
      onClick: () => setEventFormOpen(true),
    },
    {
      icon: <PostAddIcon />,
      name: t('post.post'),
      onClick: () => setPostFormOpen(true),
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            onClick={action.onClick}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
          />
        ))}
      </SpeedDial>
      <FormPost
        open={postFormOpen}
        onClose={() => setPostFormOpen(false)}
        mode="create"
        onUpdate={onPostCreated}
      />
      <EditEventModal
        open={eventFormOpen}
        closeModal={() => setEventFormOpen(false)}
        onUpdate={onEventCreated}
      />
    </>
  );
}
