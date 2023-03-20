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
import { Close as CloseIcon} from '@mui/icons-material';
import FormGroup, { FieldType } from '../../utils/form';
import { Event, Group } from '../../Props';

/**
 * Fonction permettant de générer le formulaire de création d'un événement.
 * Elle ne vérifie pas que l'utilisateur soit bien admin du groupe.
 *
 * @returns The default list of fields
 */
function createFormFields(): FieldType[] {
  const defaultFields: FieldType[] = [
    {
      kind: 'autocomplete',
      name: 'group',
      label: 'Groupe',
      maxLength: 50,
      helpText: 'Attention vous devez être admin pour créer un événement',
      required: true,
      endPoint: '/api/group/group/',
      getOptionLabel: (m) => m?.name || '',
    },
    {
      kind: 'text',
      name: 'title',
      label: "Titre de l'événement",
      required: true,
    },
    {
      kind: 'group',
      fields: [
        {
          kind: 'date and hour',
          name: 'begin_date',
          label: 'Date et Heure de début',
          required: true,
          disablePast: true,
        },
        {
          kind: 'date and hour',
          name: 'end_date',
          label: 'Date et Heure de fin',
          required: true,
          disablePast: true,
        },
      ],
    },
    {
      kind: 'text',
      name: 'place',
      label: "Lieu de l'évenement",
      required: true,
    },
    {
      kind: 'text',
      name: 'description',
      label: 'Description',
      required: true,
      multiline: true,
      row: 3,
    },
    {
      kind: 'date and hour',
      name: 'end_inscription',
      label: 'Date et Heure de fin des inscriptions',
      disablePast: true,
    },
    {
      kind: 'select',
      name: 'type_evenement',
      label: "Type de l'événement",
      item: [
        ['réservé aux membres', 'Mem'],
        ['visible par tout le monde', 'Pub'],
      ],
      required: true,
    },
    {
      kind: 'text explanatory',
      name: 'help_shotgun',
      text: "\n Si vous décidez de faire un shotgun vous pouvez au choix, soit mettre le lien d'un form, soit définir un nombre max de participants \n",
    },
    {
      kind: 'date and hour',
      name: 'shotgun_date',
      label: 'Date et Heure du Shotgun',
      disablePast: true,
    },
    {
      kind: 'text',
      name: 'lien_shotgun',
      label: 'Lien du formulaire Shotgun',
      multiline: true,
    },
    {
      kind: 'number',
      name: 'Max_participants',
      label: 'Nombre max de participants',
      min: 0,
      step: 1,
    },
  ];
  return defaultFields;
}

/**
 * Create a new blank event object.
 *
 * @returns A blank event
 */
function createBlankEvent(): Event {
  const event = {
    group: '',
    begin_inscription: '',
    color: '',
    date: '',
    description: '',
    end_date: '',
    end_inscription: '',
    get_absolute_url: '',
    group_slug: '',
    id: null,
    image: '',
    location: '',
    max_participant: null,
    number_of_participants: null,
    publication_date: '',
    publicity: '',
    slug: '',
    ticketing: '',
    title: '',
    begin_date: '',
  };
  return event;
}

function EditEventModal(props: {
  open: boolean;
  event?: Event;
  group?: Group;
  saveEvent: (member: Event) => Promise<any>;
  closeModal: () => void;
  openDeleteModal?: () => void;
}) {
  const { open, group, saveEvent, closeModal} = props;
  const event = props.event || createBlankEvent(group);
  const formFields = createFormFields();

  const [formValues, setFormValues] = useState<Event>(structuredClone(event));
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErrors, setGlobalErrors] = useState('');

  /** Function called on submit to save data */
  function onSubmit(e: FormEvent) {
    e.preventDefault(); // prevent default action from browser
    setSaving(true); // show loading
    saveEvent(formValues) // save data
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
          console.log('Il y a une erreur');
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
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Ajouter un événement
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
          {globalErrors !== '' && (
            <Alert severity="error">{globalErrors}</Alert>
          )}
          <Box>
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

export default EditEventModal;
