import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { CapitalizeFirstLetter } from '../../utils/formatText';

export function UnsuscribeModal(props: {
  open: boolean;
  onClose: (boolean) => any;
}) {
  const { open, onClose } = props;
  const { t } = useTranslation('translation'); // translation module

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {CapitalizeFirstLetter(t('button.joinButton.unsuscribe'))} ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t('button.joinButton.title')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose(false)}>
          {t('button.cancel')}
        </Button>
        <Button onClick={() => onClose(true)} autoFocus variant="contained">
          {t('button.joinButton.unsuscribe')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
