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
  useMediaQuery,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import axios from 'axios';
import { Close as CloseIcon, Info } from '@mui/icons-material';
import { EventProps, FormEventProps } from 'Props/Event';
import { GroupProps, SimpleGroupProps } from 'Props/Group';
import { useTranslation } from 'react-i18next';
import { FieldType } from 'Props/GenericTypes';
import { SimpleGroup } from 'components/Group/interfaces';
import { theme } from '../style/palette';
import FormGroup from '../../utils/form';

/**
 * Fonction permettant de générer le formulaire de création d'un événement.
 * Elle ne vérifie pas que l'utilisateur soit bien admin du groupe.
 *
 * @returns The default list of fields
 */
function getFormFields(groups: Array<SimpleGroupProps>) {
  const { t } = useTranslation('translation');

  const mainFields: FieldType[] = [
    {
      kind: 'image-autocomplete',
      name: 'group',
      label: t('form.group'),
      helpText: t('event.adminWarning'),
      required: true,
      options: groups,
      getIcon: (group: SimpleGroup) => group.icon,
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
          kind: 'datetime',
          name: 'date',
          label: 'Date et Heure de début',
          required: true,
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'end_date',
          label: 'Date et Heure de fin',
          required: true,
          disablePast: true,
        },
      ],
    },
    {
      kind: 'text',
      name: 'location',
      label: "Lieu de l'évenement",
      required: true,
    },
    {
      kind: 'richtext',
      name: 'description',
      label: 'Description',
    },
    {
      kind: 'file',
      description: t('form.imageDescription'),
      label: t('form.image'),
      name: 'image',
    },
    {
      kind: 'datetime',
      name: 'end_inscription',
      label: 'Date et Heure de fin des inscriptions',
      disablePast: true,
    },
    {
      kind: 'select',
      name: 'publicity',
      label: t('form.publicity'),
      item: [
        [t('form.public'), 'Pub'],
        [t('form.membersOnly'), 'Mem'],
      ],
      required: true,
    },
    {
      kind: 'comment',
      name: 'help_shotgun',
      text: "Si vous décidez de faire un shotgun vous pouvez au choix, soit mettre le lien d'un form, soit définir un nombre max de participants",
    },
  ];

  const shotgunFields: FieldType[] = [
    {
      kind: 'number',
      name: 'max_participant',
      label: 'Nombre max de participants',
      required: true,
      min: 0,
      step: 1,
    },
    {
      kind: 'datetime',
      name: 'begin_inscription',
      label: 'Date et Heure du Shotgun',
      disablePast: true,
    },
  ];

  const formFields: FieldType[] = [
    {
      kind: 'link',
      name: 'form_url',
      label: 'Lien du formulaire Shotgun',
      multiline: true,
    },
  ];
  return {
    mainFields: mainFields,
    shotgunFields: shotgunFields,
    formFields: formFields,
  };
}

/**
 * Create a new blank event object.
 *
 * @returns A blank event
 */
function createBlankEvent(): FormEventProps {
  const event: FormEventProps = {
    group: null,
    begin_inscription: null,
    date: null,
    description: '',
    end_date: null,
    end_inscription: null,
    image: '',
    location: '',
    max_participant: null,
    publicity: 'Pub',
    title: '',
    form_url: null,
  };
  return event;
}

function EditEventModal(props: {
  open: boolean;
  event?: EventProps;
  group?: GroupProps;
  mode?: 'create' | 'edit';
  saveEvent: (member: EventProps) => Promise<any>;
  closeModal: () => void;
}) {
  const { open, group, saveEvent, closeModal, event, mode } = props;
  const eventDisplayed = event || createBlankEvent();
  const { t } = useTranslation('translation');
  const [adminGroup, setAdminGroup] = React.useState<Array<GroupProps>>([]);
  const [formValues, setFormValues] = useState<FormEventProps>(
    structuredClone(eventDisplayed)
  );
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErrors, setGlobalErrors] = useState('');
  const [shotgunMode, setShotgunMode] = React.useState<
    'normal' | 'shotgun' | 'form'
  >('normal');
  const fields = getFormFields(adminGroup);

  React.useEffect(() => {
    axios
      .get('/api/group/group/', { params: { admin: true, simple: true } })
      .then((res) => setAdminGroup(res.data.results))
      .catch((err) => console.error(err));
  }, []);
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  /** Function called on submit to save data */
  function createForm(): FormData {
    const formData = new FormData();
    if (formValues.image && typeof formValues.image !== 'string')
      formData.append('image', formValues.image, formValues.image.name);
    if (formValues.group && mode === 'create')
      formData.append('group', formValues.group.toString());
    if (event?.group && mode === 'edit')
      formData.append('group', event.group.toString());
    formData.append('publicity', formValues.publicity);
    formData.append('title', formValues.title || '');
    console.log(formValues.description);
    formData.append('description', formValues.description || '<p></p>');
    if (formValues.date) formData.append('date', formValues.date.toISOString());
    if (formValues.end_date)
      formData.append('end_date', formValues.end_date.toISOString());
    formData.append(
      'end_inscription',
      formValues.end_inscription ? formValues.end_inscription.toISOString() : ''
    );
    formData.append('location', formValues.location);
    // Form
    formData.append(
      'form_url',
      shotgunMode === 'form' ? formValues.form_url : ' '
    );
    // Shotgun
    formData.append(
      'max_participant',
      shotgunMode === 'shotgun' && formValues.max_participant
        ? formValues.max_participant.toString()
        : ''
    );
    formData.append(
      'begin_inscription',
      shotgunMode === 'shotgun' && formValues.begin_inscription
        ? formValues.begin_inscription.toISOString()
        : ''
    );
    return formData;
  }

  function createEvent() {
    if (saving) return;
    setSaving(true); // show loading
    const formData = createForm(); // format date
    axios
      .post(`/api/event/`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
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
          // snakeToCamelCase(err.response.data, {});
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
    <form onSubmit={createEvent}>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={closeModal}
        scroll="paper"
        fullWidth
        fullScreen={fullScreen}
        maxWidth="md"
        sx={{ margin: 0 }}
      >
        <DialogTitle id="scroll-dialog-title">
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
                color: (themes) => themes.palette.grey[500],
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
          <FormGroup
            fields={fields.mainFields}
            values={formValues}
            errors={formErrors}
            setValues={setFormValues}
          />
          <Paper sx={{ padding: 2 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Inscription
                <IconButton>
                  <Info />
                </IconButton>
              </Typography>
              <ToggleButtonGroup
                value={shotgunMode}
                exclusive
                onChange={(_, value) => {
                  if (value) setShotgunMode(value);
                }}
                aria-label="text alignment"
                color="primary"
                sx={{ wordBreak: 'break-all' }}
              >
                <ToggleButton value="normal">Inscription libre</ToggleButton>
                <ToggleButton value="shotgun">Shotgun</ToggleButton>
                <ToggleButton value="form">Form</ToggleButton>
              </ToggleButtonGroup>
            </div>
            {shotgunMode === 'shotgun' && (
              <FormGroup
                fields={fields.shotgunFields}
                values={formValues}
                errors={formErrors}
                setValues={setFormValues}
              />
            )}
            {shotgunMode === 'form' && (
              <FormGroup
                fields={fields.formFields}
                values={formValues}
                errors={formErrors}
                setValues={setFormValues}
              />
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            variant="text"
            color="inherit"
            disabled={saving}
          >
            Annuler
          </Button>
          {mode === 'create' ? (
            <Button
              type="submit"
              onClick={() => createEvent()}
              variant="contained"
              color="info"
              disabled={saving}
              endIcon={
                saving && (
                  <CircularProgress size="1em" sx={{ color: 'inherit' }} />
                )
              }
            >
              {saving ? t('form.saving') : t('form.createEvent')}
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={() => createEvent()}
              variant="contained"
              color="info"
              disabled={saving}
              endIcon={
                saving && (
                  <CircularProgress size="1em" sx={{ color: 'inherit' }} />
                )
              }
            >
              {saving ? t('form.saving') : t('form.editEvent')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </form>
  );
}

EditEventModal.defaultProps = {
  group: null,
  event: null,
  mode: 'create',
};

export default EditEventModal;
