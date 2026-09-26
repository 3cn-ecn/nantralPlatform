import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface DeleteRecurrentSportEventModalProps {
  onCancel: () => void;
  /** @param single whether to delete only this occurrence */
  onConfirm: (single: boolean) => void;
  loading?: boolean;
}

export function DeleteRecurrentSportEventModal({
  onCancel,
  onConfirm,
  loading = false,
}: Readonly<DeleteRecurrentSportEventModalProps>) {
  const { t } = useTranslation();
  // remember which button was clicked to only show a loader on this one
  const [single, setSingle] = useState<boolean | null>(null);

  const confirm = (value: boolean) => {
    setSingle(value);
    onConfirm(value);
  };

  return (
    <Dialog
      open
      onClose={() => onCancel()}
      aria-labelledby="delete-recurrent-sport-event-title"
    >
      <DialogTitle id="delete-recurrent-sport-event-title">
        {t('sport.deleteModal.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('sport.deleteModal.recurrentBody')}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={() => onCancel()} variant="text">
          {t('button.cancel')}
        </Button>
        <Spacer flex={1} />
        <LoadingButton
          loading={loading && single === true}
          disabled={loading}
          onClick={() => confirm(true)}
          variant="outlined"
          color="error"
        >
          {t('sport.deleteModal.single')}
        </LoadingButton>
        <LoadingButton
          loading={loading && single === false}
          disabled={loading}
          onClick={() => confirm(false)}
          variant="contained"
          color="error"
        >
          {t('sport.deleteModal.following')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
