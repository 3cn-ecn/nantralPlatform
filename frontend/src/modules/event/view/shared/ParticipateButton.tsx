import { useReducer, useState } from 'react';

import {
  AddCircle as AddCircleIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
  LocalFireDepartment as ShotgunIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';
import { differenceInHours } from 'date-fns';

import { EventPreview } from '#modules/event/event.type';
import { useRegistrationMutation } from '#modules/event/hooks/useRegistration.mutation';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface ParticipateButtonProps {
  event: EventPreview;
  sx?: SxProps<Theme>;
}

export function ParticipateButton({ event, sx }: ParticipateButtonProps) {
  const [isParticipating, setIsParticipating] = useState(event.isParticipating);
  const [isOpenConfirmationModal, toggleConfirmationModal] = useReducer(
    (prev) => !prev,
    false
  );

  const { register, unregister, isLoading } = useRegistrationMutation(event.id);
  const { t, formatDate, formatTime } = useTranslation();

  const now = new Date();
  const isShotgun =
    !!event.maxParticipant ||
    !!event.startRegistration ||
    !!event.endRegistration;

  const isShotgunNotStarted =
    !!event.startRegistration && event.startRegistration > now;
  const isShotgunFinish =
    (!!event.maxParticipant &&
      event.numberOfParticipants >= event.maxParticipant) ||
    (!!event.endRegistration && event.endRegistration < now);

  const participate = () =>
    register({ onSuccess: () => setIsParticipating(true) });

  const quit = () =>
    unregister({
      onSuccess: () => {
        setIsParticipating(false);
        toggleConfirmationModal();
      },
    });

  const getStartIcon = () => {
    if (isShotgun) {
      return <ShotgunIcon />;
    }
    if (isParticipating) {
      return <CheckCircleIcon />;
    }
    if (!event.formUrl) {
      return <AddCircleIcon />;
    }
    return undefined;
  };

  const getEndIcon = () => {
    if (isShotgunNotStarted || isShotgunFinish) {
      return undefined;
    }
    if (event.formUrl) {
      return <OpenInNewIcon />;
    }
    if (isShotgun && isParticipating) {
      return <CheckCircleIcon />;
    }
    return undefined;
  };

  const getLabel = () => {
    if (isParticipating) {
      return t('event.participateButton.isParticipating');
    }
    if (isShotgun && isShotgunNotStarted) {
      return t('event.participateButton.willStartOn', {
        date:
          differenceInHours(event.startRegistration, now) < 20
            ? formatTime(event.startRegistration)
            : formatDate(event.startRegistration, {
                day: 'numeric',
                month: 'numeric',
              }),
      });
    }
    if (isShotgun && isShotgunFinish) {
      return t('event.participateButton.registrationEnded');
    }
    if (isShotgun) {
      return t('event.participateButton.shotgun');
    }
    if (event.formUrl) {
      return t('event.participateButton.openForm');
    }
    return t('event.participateButton.participate');
  };

  return (
    <>
      <LoadingButton
        loading={isLoading}
        disabled={isShotgunNotStarted || isShotgunFinish}
        onClick={isParticipating ? toggleConfirmationModal : participate}
        startIcon={getStartIcon()}
        endIcon={getEndIcon()}
        variant={isParticipating ? 'outlined' : 'contained'}
        sx={sx}
      >
        {getLabel()}
      </LoadingButton>
      {isOpenConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          onClose={toggleConfirmationModal}
          onValidCallback={quit}
          loading={isLoading}
        />
      )}
    </>
  );
}
