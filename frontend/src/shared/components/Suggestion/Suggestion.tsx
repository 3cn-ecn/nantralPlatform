import { FormEvent, useState } from 'react';

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

import { useTranslation } from '#shared/i18n/useTranslation';

// import FormGroup, { FieldType } from '#shared/utils/form';

// import { Suggestion } from './interfacesSuggestion';

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

/**
 * Create a new blank membership object.
 *
 * @param group - the group of the membership
 * @returns A blank membership
 */
function createBlankSuggestion(): Suggestion {
  const suggestion = {
    id: 1,
    name: '',
    description: '',
    type: '',
  };
  return suggestion;
}

function EditSuggestionModal(props: {
  open: boolean;
  closeModal: () => void;
  saveSuggestion: (suggestion: Suggestion) => Promise<any>;
}) {
  const { t } = useTranslation();
  function createFormFields() {
    const defaultFields: FieldType[] = [
      {
        kind: 'text',
        name: 'title',
        label: t('suggestion_menu.title'),
        required: true,
      },
      {
        kind: 'text',
        name: 'description',
        label: t('suggestion_menu.description'),
        multiline: true,
        rows: 10,
        required: true,
      },
      {
        kind: 'select',
        name: 'type',
        label: t('suggestion_menu.type'),
        item: [
          ['Bug', 'bug'],
          ['Suggestion', 'suggestion'],
        ],
        required: true,
      },
    ];
    return defaultFields;
  }

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
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ minWidth: 0 }} component="span">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {t('suggestion_menu.header')}
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
          <Box sx={{ maxWidth: 500 }}>
            {/* <FormGroup
              fields={formFields}
              values={formValues}
              errors={formErrors}
              setValues={setFormValues}
            /> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            variant="text"
            color="error"
            disabled={saving}
          >
            {t('suggestion_menu.cancel')}
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
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              )
            }
          >
            {saving ? 'Sauvegarde...' : t('suggestion_menu.confirm')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditSuggestionModal;
