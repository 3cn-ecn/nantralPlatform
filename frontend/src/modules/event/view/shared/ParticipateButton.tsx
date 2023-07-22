import { useState } from 'react';

import {
  AddCircle as AddCircleIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
  LocalFireDepartment as ShotgunIcon,
} from '@mui/icons-material';
import { ButtonProps, SxProps, Theme } from '@mui/material';
import { differenceInHours } from 'date-fns';

import { EventPreview } from '#modules/event/event.type';
import { useRegistrationMutation } from '#modules/event/hooks/useRegistration.mutation';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface ParticipateButtonProps {
  event: EventPreview;
  sx?: SxProps<Theme>;
  participatingVariant?: ButtonProps['variant'];
}

export function ParticipateButton({
  event,
  sx,
  participatingVariant = 'outlined',
}: ParticipateButtonProps) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

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

  const handleClick = () => {
    if (event.isParticipating) {
      return setIsOpenConfirmationModal(true);
    }
    return register({});
  };

  const onUnregisterModalConfirm = () => {
    unregister({
      onSuccess: () => {
        setIsOpenConfirmationModal(false);
      },
    });
  };

  const onUnregisterModalCancel = () => {
    setIsOpenConfirmationModal(false);
  };

  const getStartIcon = () => {
    if (isShotgun) {
      return <ShotgunIcon />;
    }
    if (event.isParticipating) {
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
    if (isShotgun && event.isParticipating) {
      return <CheckCircleIcon />;
    }
    return undefined;
  };

  const getLabel = () => {
    if (event.isParticipating) {
      return t('event.participateButton.isParticipating');
    }
    if (isShotgun && isShotgunNotStarted && event.startRegistration) {
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
        onClick={!event.formUrl ? handleClick : undefined}
        startIcon={getStartIcon()}
        endIcon={getEndIcon()}
        variant={event.isParticipating ? participatingVariant : 'contained'}
        sx={sx}
        {...(event.formUrl
          ? {
              href: event.formUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          : {})}
      >
        {getLabel()}
      </LoadingButton>
      {isOpenConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          onCancel={onUnregisterModalCancel}
          onConfirm={onUnregisterModalConfirm}
          loading={isLoading}
        />
      )}
    </>
  );
}
