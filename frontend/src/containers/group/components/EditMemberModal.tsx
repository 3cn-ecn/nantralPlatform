import React, { FormEvent, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Avatar from './Avatar';
import FormGroup, { FieldType } from '../../utils/form';
import { Membership, Group } from '../interfaces';

/**
 * A function to generate the default fields fot the edit modal form.
 *
 * @param group 
 * @param member 
 * @returns The default list of fields
 */
function createFormFields(group: Group, member: Membership): FieldType[] {
  const defaultFields: FieldType[] = [
    { kind: 'text', name: 'summary', label: 'Résumé', maxLength: 50, helpText: 'Entrez le résumé du membre' },
    { kind: 'text', name: 'description', label: 'Description', multiline: true },
  ];
  if (!group.group_type.is_year_group) {
    defaultFields.push({
      kind: 'group',
      fields: [
        { kind: 'date', name: 'begin_date', label: 'Date de début', required: true },
        { kind: 'date', name: 'end_date', label: 'Date de fin', required: true }
      ]
    });
  };
  if (group.is_admin) {
    defaultFields.push({
      kind: 'boolean',
      name: 'admin',
      label: 'Admin',
      helpText: 'Un admin peut modifier le groupe et ses membres.'
    });
  };
  if (member.id === null) {
    defaultFields.splice(0, 0, {
      kind: 'autocomplete',
      label: 'Utilisateur',
      name: 'student',
      endPoint: '/api/student/student',
      getOptionLabel: ((m) => m?.name || '')
    });
  }
  return defaultFields;
}

/**
 * Create a new blank membership object.
 *
 * @param group - the group of the membership
 * @returns A blank membership
 */
function createBlankMember(group: Group): Membership {
  const date = new Date();
  const today = date.toISOString().split('T')[0];
  date.setFullYear(date.getFullYear() + 1);
  const oneYearLater = date.toISOString().split('T')[0];
  const member = {
    id: null,
    student: null,
    group: group.id as any,
    summary: '',
    description: '',
    begin_date: today,
    end_date: oneYearLater,
    admin: false,
    order: 0
  };
  return member;
}

function EditMemberModal(props: {
  open: boolean;
  member?: Membership;
  group: Group,
  saveMembership: (member: Membership) => Promise<any>;
  closeModal: () => void;
  openDeleteModal?: () => void;
}) {
  const { open, group, saveMembership, closeModal, openDeleteModal } = props;
  const member = props.member || createBlankMember(group);
  const formFields = createFormFields(group, member);

  const [ formValues, setFormValues ] = useState<Membership>(structuredClone(member));
  const [ formErrors, setFormErrors ] = useState({});
  const [ saving, setSaving ] = useState(false);
  const [ globalErrors, setGlobalErrors ] = useState('');

  /** Function called on submit to save data */
  function onSubmit(e: FormEvent) {
    e.preventDefault();  // prevent default action from browser
    setSaving(true);  // show loading
    saveMembership(formValues)  // save data
    .then(() => { setSaving(false); closeModal(); })  // close modal
    .catch((err) => {
      setSaving(false);
      if (err.response) {
        setFormErrors(err.response.data);  // show errors per fields
        if (err.response.data.non_field_errors)  // show form errors
          setGlobalErrors(err.response.data.non_field_errors);
        if (err.response.status === 500)
          setGlobalErrors('Notre serveur a crashé, désolé 😢')
      } else {
        setGlobalErrors('Erreur de réseau');  // show global error
      }
    });
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
    >
      <form onSubmit={onSubmit} >
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
              onClick={closeModal}
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
          <Alert severity='error' hidden={!globalErrors}>{globalErrors}</Alert>
          <Box>
            <FormGroup
              fields={formFields}
              values={formValues}
              errors={formErrors}
              setValues={setFormValues}
            />
          </Box>
          <Button
            hidden={!openDeleteModal}
            onClick={openDeleteModal}
            variant='outlined'
            color='error'
            disabled={saving}
            sx={{ mr: 'auto', mt: 2 }}
          >
            Supprimer
          </Button>
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
