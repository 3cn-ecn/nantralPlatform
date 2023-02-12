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
import { Membership, Group } from '../interfaces';

/** A modal to confirm the deletion of a member. */
function DeleteMemberModal(props: {
  closeModal: () => void;
  deleteMembership: (member: Membership) => Promise<void>;
  open: boolean;
  member: Membership;
}) {
  const { closeModal, deleteMembership, open, member } = props;
  const [ saving, setSaving ] = useState(false);
  const [ globalErrors, setGlobalErrors ] = useState('');

  /** Function called on submit to save data */
  function onDelete() {
    setSaving(true);  // show loading
    deleteMembership(member)  // save data
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
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Supprimer le membre ?
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity='error' hidden={!globalErrors} sx={{mb: 1 }}>{globalErrors}</Alert>
        <DialogContentText>
          Voulez-vous vraiment supprimer {member.student.full_name} des
          membres de {member.group.name} ?
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
            onClick={onDelete}
            variant='contained'
            color='error'
            disabled={saving}
            endIcon={saving ? <CircularProgress size='1em' sx={{ color: 'inherit' }}/> : <></>}
          >
            { saving ? 'Suppression...' : 'Supprimer' }
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteMemberModal;
