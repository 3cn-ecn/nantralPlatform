import { useState } from 'react';

import { People as PeopleIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Event } from '#modules/event/event.type';
import { EventParticipantsModal } from '#pages/Event/EventDetails/components/EventParticipantsModal';
import { useTranslation } from '#shared/i18n/useTranslation';

type ParticipantsButtonProps = {
  event: Event;
};

export function ParticipantsButton({ event }: ParticipantsButtonProps) {
  const { t } = useTranslation();
  const [isOpenParticipantsModal, setIsOpenParticipantsModal] = useState(false);

  return (
    <>
      <Button
        startIcon={<PeopleIcon />}
        variant="outlined"
        color="secondary"
        onClick={() => setIsOpenParticipantsModal(true)}
      >
        {event.maxParticipant
          ? t('event.participants.titleWithMax', {
              number: event.numberOfParticipants,
              max: event.maxParticipant,
            })
          : t('event.participants.titleWithNumber', {
              number: event.numberOfParticipants,
            })}
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
