import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Avatar from './Avatar';
import FormGroup from '../../utils/form';
import { Membership, Group } from '../interfaces';

function EditMemberModal(props: {
  onClose: () => void;
  onValid: (data?: Membership) => void;
  open: boolean;
  member?: Membership;
  group: Group,
}) {
  const { onClose, onValid, open, group } = props;
  let { member } = props;

  // fields for the form
  const fields: Parameters<typeof FormGroup>[0]['fields'] = [
    { kind: 'text', name: 'summary', label: 'Résumé', maxLength: 20, helpText: 'Entrez le résumé du membre' },
    { kind: 'text', name: 'description', label: 'Description', multiline: true },
  ];
  if (!group.group_type.is_year_group) {
    fields.push({
      kind: 'group',
      fields: [
        { kind: 'date', name: 'begin_date', label: 'Date de début', required: true },
        { kind: 'date', name: 'end_date', label: 'Date de fin', required: true }
      ]
    });
  };
  if (group.is_admin) {
    fields.push({
      kind: 'boolean',
      name: 'admin',
      label: 'Admin',
      helpText: 'Un admin peut modifier le groupe et ses membres.'
    });
  };
  if (!member) {
    fields.splice(0, 0, {
      kind: 'text',
      label: 'Utilisateur',
      name: 'student',
    });
    member = {
      student: null,
      summary: null,
      description: null,
      begin_date: Date(),
      end_date: new Date((new Date()).getFullYear()+1, (new Date).getMonth(), (new Date).getDate()),
      admin: false,
    } as any;
  }

  const [ formValues, setFormValues ] = useState<Membership>(structuredClone(member));
  const [ saving, setSaving ] = useState(false);

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        setSaving(true);
        onValid(formValues);
      }}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar title={member?.student?.full_name || 'Ajouter un membre'} children={<EditIcon />} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {member?.student?.full_name || 'Ajouter un membre'}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                marginLeft: 'auto',
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <FormGroup
            fields={fields}
            values={formValues}
            setValues={setFormValues}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onValid()}
            variant='text'
            color='error'
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            disabled={saving}
            endIcon={saving ? <CircularProgress size='1em' sx={{ color: 'inherit' }}/> : <></>}
          >
            { saving ? 'Sauvegarde...' : 'Valider' }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditMemberModal;
