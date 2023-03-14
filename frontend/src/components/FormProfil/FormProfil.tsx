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
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FormGroup, { FieldType } from '../../utils/form';

/**
 * A function to generate the default fields fot the edit modal form.
 *
 * @param group
 * @param member
 * @returns The default list of fields
 */

interface Suggestion {
  title: string;
  description: string;
  type: string;
}
function createFormFields() {
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
        '-----------',
        'Élève Ingénieur Généraliste',
        'Élève Ingénieur de Spécialité',
        'Élève en Master',
        'Doctorant',
      ],
    },
    {
      kind: 'select',
      name: 'Cursus',
      label: 'Cursus',
      item: [
        '-----------',
        'Alternance',
        'Ingénieur-Architecte',
        'Architecte-Ingénieur',
        'Ingénieur-Manager',
        'Manager-Ingénieur',
        'Ingénieur-Officier',
        'Officier-Ingénieur',
      ],
    },
    {
      kind: 'picture',
      title: 'Upload',
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
function createBlankSuggestion(): Suggestion {
  const suggestion = {
    id: null,
    name: '',
    description: '',
    type: '',
  };
  return suggestion;
}

export function EditProfilModal(props: {
  open: boolean;
  closeModal: () => void;
  saveSuggestion: (suggestion: Suggestion) => Promise<any>;
}) {
  const { open, closeModal, saveSuggestion } = props;
  const suggestion = createBlankSuggestion();
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
    console.log(formValues);
    saveSuggestion(formValues)
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
          <Alert severity="error" hidden={!globalErrors}>
            {globalErrors}
          </Alert>
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
              saving ? (
                <CircularProgress size="1em" sx={{ color: 'inherit' }} />
              ) : (
                <></>
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
