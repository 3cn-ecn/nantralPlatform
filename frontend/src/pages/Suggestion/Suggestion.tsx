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
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import FormGroup, { FieldType } from '../../legacy/utils/form';

/**
 * A function to generate the default fields fot the edit modal form.
 *
 * @param group
 * @param member
 * @returns The default list of fields
 */
function createFormFields() {
  const defaultFields: FieldType[] = [
    {
      kind: 'text',
      name: 'title',
      label: 'Titre',
      maxLength: 50,
    },
    {
      kind: 'text',
      name: 'description',
      label: 'Description',
      multiline: true,
    },
    {
      kind: 'select',
      name: 'type',
      label: 'Type',
      item: ['Bug', 'Suggestion'],
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

function EditSuggestionModal() {
  const suggestion = createBlankSuggestion();
  const formFields = createFormFields();

  const [formValues, setFormValues] = useState<Suggestion>(
    structuredClone(suggestion)
  );
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErrors, setGlobalErrors] = useState('');

  /** Function called on submit to save data */
  function onSubmit(e: FormEvent) {}

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ maxWidth: 500 }}>
        <FormGroup
          fields={formFields}
          values={formValues}
          errors={formErrors}
          setValues={setFormValues}
        />
      </Box>
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
    </form>
  );
}

export default EditSuggestionModal;
