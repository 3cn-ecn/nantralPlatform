import { ReactNode } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
import { DialogTitle, IconButton, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { FlexRow } from '../FlexBox/FlexBox';

type ResponsiveDialogHeaderProps = {
  onClose: () => void;
  children?: ReactNode | string;
  leftIcon?: ReactNode;
};

export function ResponsiveDialogHeader({
  onClose,
  leftIcon,
  children,
}: ResponsiveDialogHeaderProps) {
  const { t } = useTranslation();

  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <FlexRow alignItems="center" gap={2} flex={1}>
        {leftIcon}
        {children}
      </FlexRow>
      <Tooltip title={t('modal.closeButton.label')}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </DialogTitle>
  );
}
