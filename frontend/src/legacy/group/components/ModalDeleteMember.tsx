import { useState } from 'react';

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Membership } from '../interfaces';

/** A modal to confirm the deletion of a member. */
function DeleteMemberModal(props: {
  closeModal: () => void;
  deleteMembership: (member: Membership) => Promise<void>;
  open: boolean;
  member: Membership;
}) {
  const { closeModal, deleteMembership, open, member } = props;
  const [saving, setSaving] = useState(false);
  const [globalErrors, setGlobalErrors] = useState('');

  /** Function called on submit to save data */
  function onDelete() {
    setSaving(true); // show loading
    deleteMembership(member) // save data
      .catch(() => {
        setSaving(false);
        setGlobalErrors("Une erreur s'est produite.");
      });
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
    >
      <DialogTitle>Supprimer le membre ?</DialogTitle>
      <DialogContent>
        <Alert severity="error" hidden={!globalErrors} sx={{ mb: 1 }}>
          {globalErrors}
        </Alert>
        <DialogContentText>
          Voulez-vous vraiment supprimer {member.user.name} des membres de{' '}
          {member.group.name} ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} variant="text" disabled={saving}>
          Annuler
        </Button>
        <Button
          onClick={onDelete}
          variant="contained"
          disabled={saving}
          endIcon={
            saving ? (
              <CircularProgress size="1em" sx={{ color: 'inherit' }} />
            ) : (
              <></>
            )
          }
        >
          {saving ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteMemberModal;
