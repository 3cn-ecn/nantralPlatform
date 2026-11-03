import { ReactNode } from 'react';

import {
  Close as CloseIcon,
  HelpOutlined as HelpOutlinedIcon,
} from '@mui/icons-material';
import { DialogTitle, IconButton, Stack, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

interface ResponsiveDialogHeaderProps {
  onClose: () => void;
  children?: ReactNode | string;
  leftIcon?: ReactNode;
  helpUrl?: string;
}

export function ResponsiveDialogHeader({
  onClose,
  leftIcon,
  children,
  helpUrl,
}: ResponsiveDialogHeaderProps) {
  const { t } = useTranslation();

  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flex: 1, pr: 1 }}
      >
        {leftIcon}
        {children}
      </Stack>
      {!!helpUrl && (
        <Tooltip title={t('modal.helpButton.label')}>
          <IconButton href={helpUrl} target="_blank" rel="noopener">
            <HelpOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={t('modal.closeButton.label')}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </DialogTitle>
  );
}
