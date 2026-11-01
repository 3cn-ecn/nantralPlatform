import { useEffect, useState } from 'react';

import {
  AddCircle as AddCircleIcon,
  CheckCircle as CheckCircleIcon,
  LocalFireDepartment as ShotgunIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';
import { differenceInHours } from 'date-fns';

import { EventPreview } from '#modules/event/event.type';
import { useRegistrationMutation } from '#modules/event/hooks/useRegistration.mutation';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useTranslation } from '#shared/i18n/useTranslation';

import './ParticipateButton.scss';

interface ParticipateButtonProps {
  event: EventPreview;
  sx?: SxProps<Theme>;
}

export function ParticipateButton({ event, sx }: ParticipateButtonProps) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const { register, unregister, isPending } = useRegistrationMutation(event.id);
  const { t, formatDate, formatTime } = useTranslation();

  const now = new Date();

  const [, setTick] = useState(0); // just to force the re-render

  useEffect(() => {
    const now = new Date();
    let nextUpdate: number | null = null;

    // If the shotgun has not yet started
    if (event.startRegistration && event.startRegistration > now) {
      nextUpdate = event.startRegistration.getTime() - now.getTime();
    }
    // If the shotgun is finished but you want to re-render at the end
    else if (event.endRegistration && event.endRegistration > now) {
      nextUpdate = event.endRegistration.getTime() - now.getTime();
    }

    if (nextUpdate !== null) {
      const timer = setTimeout(() => setTick((t) => t + 1), nextUpdate);
      return () => clearTimeout(timer);
    }
  }, [event.startRegistration, event.endRegistration]);

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

  const isDisabled =
    (isShotgunNotStarted || isShotgunFinish || event.endDate < now) &&
    !event.isParticipating;

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
    if (event.isParticipating) {
      return <CheckCircleIcon />;
    }
    if (isShotgun) {
      return <ShotgunIcon />;
    }
    if (!event.formUrl) {
      return <AddCircleIcon />;
    }
    return undefined;
  };

  const getEndIcon = () => {
    if (isShotgun && event.isParticipating) {
      return <ShotgunIcon />;
    }
    if (isShotgunNotStarted || isShotgunFinish) {
      return undefined;
    }
    if (event.formUrl) {
      return <OpenInNewIcon />;
    }
    return undefined;
  };

  const getLabel = () => {
    if (event.isParticipating) {
      return t('event.participateButton.isParticipating');
    }
    if (isShotgun && isShotgunNotStarted && event.startRegistration) {
      if (differenceInHours(event.startRegistration, now) < 20) {
        return t('event.participateButton.willStartAtHour', {
          time: formatTime(event.startRegistration),
        });
      }
      return t('event.participateButton.willStartOnDate', {
        date: formatDate(event.startRegistration, {
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
      <FlexRow
        className={
          isShotgun && !isDisabled && !isPending && !event.formUrl
            ? 'button-shotgun-style'
            : undefined
        }
        sx={sx}
      >
        <LoadingButton
          loading={isPending}
          disabled={isDisabled}
          onClick={!event.formUrl ? handleClick : undefined}
          startIcon={getStartIcon()}
          endIcon={getEndIcon()}
          variant={event.isParticipating ? 'outlined' : 'contained'}
          color={event.formUrl ? 'info' : 'primary'}
          sx={{ width: '100%' }}
          {...(event.formUrl
            ? {
                href: event.formUrl,
                target: '_blank',
                rel: 'noopener',
              }
            : {})}
        >
          {getLabel()}
        </LoadingButton>
      </FlexRow>
      {isOpenConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          onCancel={onUnregisterModalCancel}
          onConfirm={onUnregisterModalConfirm}
          loading={isPending}
        />
      )}
    </>
  );
}
