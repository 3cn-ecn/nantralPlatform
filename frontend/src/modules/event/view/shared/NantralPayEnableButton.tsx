import { useState } from 'react';

import {
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

import { EventPreview } from '#modules/event/event.type';
import { useNantralPayEnableMutation } from '#modules/event/hooks/useNantralPayEnable.mutation';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useTranslation } from '#shared/i18n/useTranslation';

interface NantralPayEnableButtonProps {
  event: EventPreview;
  sx?: SxProps<Theme>;
}

export function NantralPayEnableButton({
  event,
  sx,
}: NantralPayEnableButtonProps) {
  const [isOpenEnableConfirmationModal, setIsOpenEnableConfirmationModal] =
    useState(false);
  const [isOpenDisableConfirmationModal, setIsOpenDisableConfirmationModal] =
    useState(false);

  const { enable, disable, isLoading } = useNantralPayEnableMutation(event.id);
  const { t } = useTranslation();

  const handleClick = () => {
    if (event.nantralpayIsOpen) {
      return setIsOpenDisableConfirmationModal(true);
    }
    return setIsOpenEnableConfirmationModal(true);
  };

  const onEnableModalConfirm = () => {
    enable({
      onSuccess: () => {
        setIsOpenEnableConfirmationModal(false);
      },
    });
  };

  const onEnableModalCancel = () => {
    setIsOpenEnableConfirmationModal(false);
  };

  const onDisableModalConfirm = () => {
    disable({
      onSuccess: () => {
        setIsOpenDisableConfirmationModal(false);
      },
    });
  };

  const onDisableModalCancel = () => {
    setIsOpenDisableConfirmationModal(false);
  };

  const getStartIcon = () => {
    if (event.nantralpayIsOpen) {
      return <MoneyOffIcon />;
    }
    return <AttachMoneyIcon />;
  };

  const getLabel = () => {
    if (event.nantralpayIsOpen) {
      return t('event.nantralpayEnableButton.close');
    }
    return t('event.nantralpayEnableButton.open');
  };

  return (
    <>
      <FlexRow sx={sx}>
        <LoadingButton
          loading={isLoading}
          onClick={handleClick}
          startIcon={getStartIcon()}
          variant={event.nantralpayIsOpen ? 'contained' : 'outlined'}
          color="secondary"
          sx={{ width: '100%' }}
        >
          {getLabel()}
        </LoadingButton>
      </FlexRow>
      {isOpenEnableConfirmationModal && (
        <ConfirmationModal
          title={t('event.nantralpayEnableButton.enableModal.title')}
          body={t('event.nantralpayEnableButton.enableModal.message')}
          onCancel={onEnableModalCancel}
          onConfirm={onEnableModalConfirm}
          loading={isLoading}
        />
      )}
      {isOpenDisableConfirmationModal && (
        <ConfirmationModal
          title={t('event.nantralpayEnableButton.disableModal.title')}
          body={t('event.nantralpayEnableButton.disableModal.message')}
          onCancel={onDisableModalCancel}
          onConfirm={onDisableModalConfirm}
          loading={isLoading}
        />
      )}
    </>
  );
}
