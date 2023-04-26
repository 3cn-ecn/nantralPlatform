import React, { FormEvent, useState } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { FieldType } from 'Props/GenericTypes';

import { Suggestion } from '#components/Suggestion/interfacesSuggestion';
import FormGroup from '#utils/form';

interface Profile {
  promo: number;
  filiere: string;
  cursus: string;
}

function createFormFields(): FieldType[] {
  const defaultFields: FieldType[] = [
    {
      kind: 'number',
      name: 'Année de promotion entrante',
      label: 'Promo',
      step: 1,
      min: 1919,
    },
    {
      kind: 'select',
      name: 'Filière',
      label: 'Filière',
      item: [
        ['-----------', null],
        ['Élève Ingénieur Généraliste', ''],
        ['Élève Ingénieur de Spécialité', ''],
        ['Élève en Master', ''],
        ['Doctorant', ''],
      ],
    },
    {
      kind: 'select',
      name: 'Cursus',
      label: 'Cursus',
      item: [
        ['-----------', null],
        ['Alternance', ''],
        ['Ingénieur-Architecte', ''],
        ['Architecte-Ingénieur', ''],
        ['Ingénieur-Manager', ''],
        ['Manager-Ingénieur', ''],
        ['Ingénieur-Officier', ''],
        ['Officier-Ingénieur', ''],
      ],
    },
    {
      kind: 'file',
      label: 'Upload',
      name: 'image',
      description: 'Upload une photo de profil',
    },
  ];
  return defaultFields;
}

/**
 * Create a new blank membership object.
 *
 * @param group - the group of the membership
 * @returns A blank membership
 */
function createBlankProfile(): Profile {
  const profile = {
    id: null,
    promo: null,
    filiere: '',
    cursus: '',
  };
  return profile;
}

export function EditProfilModal(props: {
  open: boolean;
  closeModal: () => void;
  saveProfile: (profile: Profile) => Promise<any>;
}) {
  const { open, closeModal, saveProfile } = props;
  const suggestion = createBlankProfile();
  const formFields = createFormFields();

  const [formValues, setFormValues] = useState<Suggestion>(
    structuredClone(suggestion)
  );
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErrors, setGlobalErrors] = useState('');

  /** Function called on submit to save data */
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    saveProfile(formValues)
      .then(() => {
        // reset all errors messages, saving loading and close modal
        setFormErrors({});
        setGlobalErrors('');
        setSaving(false);
        closeModal();
      })
      .catch((err) => {
        setSaving(false);
        if (err.response) {
          setFormErrors(err.response.data); // show errors per fields
          if (err.response.data.non_field_errors)
            // show form errors
            setGlobalErrors(err.response.data.non_field_errors);
          if (err.response.status === 500)
            setGlobalErrors('Notre serveur a crashé, désolé 😢');
        } else {
          setGlobalErrors('Erreur de réseau'); // show global error
        }
      });
  }
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
      sx={{ minWidth: 700 }}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Modification du Profil
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
          {globalErrors ? (
            <Alert severity="error" hidden={!globalErrors}>
              {globalErrors}
            </Alert>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
          <Box sx={{ minWidth: 500 }}>
            <FormGroup
              fields={formFields}
              values={formValues}
              errors={formErrors}
              setValues={setFormValues}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            variant="text"
            color="error"
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={saving}
            endIcon={
              saving && (
                <CircularProgress size="1em" sx={{ color: 'inherit' }} />
              )
            }
          >
            {saving ? 'Sauvegarde...' : 'Valider'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
