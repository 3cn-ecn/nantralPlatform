import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Add as AddIcon } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';

import { CreateEventModal } from '#modules/event/view/Modals/CreateEventModal';
import { useTranslation } from '#shared/i18n/useTranslation';

export function CreateNewEventButton() {
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Tooltip title={t('event.createNewEvent')}>
        <Fab
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setEventFormOpen(true)}
          color="primary"
        >
          <AddIcon />
        </Fab>
      </Tooltip>
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
