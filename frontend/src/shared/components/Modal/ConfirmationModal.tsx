import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { upperFirst } from 'lodash-es';

import { useTranslation } from '#shared/i18n/useTranslation';

export function ConfirmationModal(props: {
  open: boolean;
  title: string;
  content: string;
  onClose: (boolean) => any;
}) {
  const { open, onClose, title, content } = props;
  const { t } = useTranslation(); // translation module

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {upperFirst(title)} ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose(false)}>
          {t('button.cancel')}
        </Button>
        <Button onClick={() => onClose(true)} autoFocus variant="contained">
          {t('button.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
