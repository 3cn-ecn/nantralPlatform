import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Event as EventIcon,
  PostAdd as PostAddIcon,
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import { CreateEventModal } from '#modules/event/view/Modals/CreateEventModal';
import { CreatePostModal } from '#modules/post/view/CreatePostModal/CreatePostModal';
import { useTranslation } from '#shared/i18n/useTranslation';

export function CreateNewButton() {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
      {eventFormOpen && (
        <CreateEventModal
          onClose={() => setEventFormOpen(false)}
          onCreated={(id) => {
            navigate(`/event/${id}`);
            setEventFormOpen(false);
          }}
        />
      )}
    </>
  );
}
