import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  CircularProgress
} from '@mui/material';
import { Membership } from '../interfaces';

/** A modal to confirm the deletion of a member. */
function ArchiveMemberModal(props: {
  closeModal: () => void;
  saveMembership: (member: Membership, reload?: boolean) => Promise<void>;
  open: boolean;
  member: Membership;
}) {
  const { closeModal, saveMembership, open, member } = props;
  const [ saving, setSaving ] = useState(false);
  const [ globalErrors, setGlobalErrors ] = useState('');
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  /** Function called on submit to save data */
  function onSave() {
    setSaving(true);  // show loading
    member.end_date = yesterday.toISOString().split('T')[0];
    saveMembership(member, true)  // save data
    .then(() => {
      // reset all errors messages, saving loading and close modal
      setGlobalErrors('');
      setSaving(false);
      closeModal();
    })
    .catch(() => {
      setSaving(false);
      setGlobalErrors('Une erreur s\'est produite.');
    });
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
    >
      <DialogTitle>
        Archiver le membre ?
      </DialogTitle>
      <DialogContent>
        <Alert severity='error' hidden={!globalErrors} sx={{mb: 1 }}>{globalErrors}</Alert>
        <DialogContentText>
          Archiver le membre modifiera la date de fin de son adhésion
          au {yesterday.toLocaleDateString()}.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button
            onClick={closeModal}
            variant='text'
            color='error'
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            onClick={onSave}
            variant='contained'
            color='error'
            disabled={saving}
            endIcon={saving ? <CircularProgress size='1em' sx={{ color: 'inherit' }}/> : <></>}
          >
            { saving ? 'Enregistrement...' : 'Archiver' }
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ArchiveMemberModal;
