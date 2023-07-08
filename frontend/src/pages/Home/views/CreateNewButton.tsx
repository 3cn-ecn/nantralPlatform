import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Event as EventIcon,
  PostAdd as PostAddIcon,
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import { CreatePostModal } from '#modules/post/view/CreatePostModal/CreatePostModal';
import EditEventModal from '#shared/components/FormEvent/FormEvent';
import { useTranslation } from '#shared/i18n/useTranslation';

type CreateNewButtonProps = {
  onEventCreated: () => void;
};

export function CreateNewButton({ onEventCreated }: CreateNewButtonProps) {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

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
      {postFormOpen && (
        <CreatePostModal
          onClose={() => setPostFormOpen(false)}
          onCreated={(postId) => {
            searchParams.set('post', postId.toString());
            setSearchParams(searchParams);
            setPostFormOpen(false);
          }}
        />
      )}
      <EditEventModal
        open={eventFormOpen}
        closeModal={() => setEventFormOpen(false)}
        onUpdate={onEventCreated}
      />
    </>
  );
}
