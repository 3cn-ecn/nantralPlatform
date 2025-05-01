import { useState } from 'react';

import { People as PeopleIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Event } from '#modules/event/event.type';
import { EventParticipantsModal } from '#pages/EventDetails/components/EventParticipantsModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface ParticipantsButtonProps {
  event: Event;
}

export function ParticipantsButton({ event }: ParticipantsButtonProps) {
  const { t } = useTranslation();
  const [isOpenParticipantsModal, setIsOpenParticipantsModal] = useState(false);

  const getButtonText = () => {
    if (event.maxParticipant) {
      return t('event.participants.titleWithMax', {
        number: event.numberOfParticipants,
        max: event.maxParticipant,
      });
    }

    // Hide the number of participants if it is too low
    // to avoid the "I don't want to be the first one" feeling
    if (event.numberOfParticipants < 5) {
      return t('event.participants.title');
    }

    return t('event.participants.titleWithNumber', {
      count: event.numberOfParticipants,
    });
  };

  return (
    <>
      <Button
        startIcon={<PeopleIcon />}
        variant="outlined"
        color="secondary"
        onClick={() => setIsOpenParticipantsModal(true)}
      >
        {getButtonText()}
      </Button>

      {isOpenParticipantsModal && (
        <EventParticipantsModal
          event={event}
          onClose={() => {
            setIsOpenParticipantsModal(false);
          }}
        />
      )}
    </>
  );
}
