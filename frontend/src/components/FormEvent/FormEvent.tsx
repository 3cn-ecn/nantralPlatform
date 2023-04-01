import * as React from 'react';
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
import { GroupProps, SimpleGroupProps } from 'Props/Group';
import { useTranslation } from 'react-i18next';
import { FieldType } from 'Props/GenericTypes';
import { SimpleGroup } from 'components/Group/interfaces';
import { EventProps, FormEventProps } from '../../Props/Event';
import { theme } from '../style/palette';
import FormGroup from '../../utils/form';
import { snakeToCamelCase } from '../../utils/camel';
import { ConfirmationModal } from '../Modal/ConfirmationModal';

/**
 * Fonction permettant de générer le formulaire de création d'un événement.
 * Elle ne vérifie pas que l'utilisateur soit bien admin du groupe.
 *
 * @returns The default list of fields
 */
function getFormFields(
  groups: Array<SimpleGroupProps>,
  t: (name: string) => string,
  mode: 'edit' | 'create'
) {
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
      disabled: mode === 'edit',
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
          name: 'beginDate',
          label: 'Date et Heure de début',
          required: true,
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'endDate',
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
      name: 'endInscription',
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
      name: 'maxParticipant',
      label: 'Nombre max de participants',
      required: true,
      min: 0,
      step: 1,
    },
    {
      kind: 'datetime',
      name: 'beginInscription',
      label: 'Date et Heure du Shotgun',
      disablePast: true,
    },
  ];

  const formFields: FieldType[] = [
    {
      kind: 'link',
      name: 'formUrl',
      label: 'Lien du formulaire Shotgun',
      multiline: true,
    },
    {
      kind: 'datetime',
      name: 'beginInscription',
      label: "Date heure d'ouverture des inscriptions",
      disablePast: true,
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
function createBlankEvent(): EventProps {
  const event: EventProps = {
    group: null,
    beginInscription: null,
    beginDate: null,
    description: '',
    endDate: null,
    endInscription: null,
    image: '',
    location: '',
    maxParticipant: null,
    publicity: 'Pub',
    title: '',
    formUrl: null,
  };
  return event;
}

function EditEventModal(props: {
  open: boolean;
  event?: EventProps;
  mode?: 'create' | 'edit';
  closeModal: () => void;
}) {
  const { open, closeModal, event, mode } = props;
  const eventDisplayed = event || createBlankEvent();
  const { t } = useTranslation('translation');
  const [adminGroup, setAdminGroup] = React.useState<Array<GroupProps>>([]);
  const [formValues, setFormValues] = React.useState<FormEventProps>(
    structuredClone(eventDisplayed)
  );
  const [formErrors, setFormErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [globalErrors, setGlobalErrors] = React.useState('');
  const [confirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);
  const [shotgunMode, setShotgunMode] = React.useState<
    'normal' | 'shotgun' | 'form'
  >('normal');
  React.useEffect(() => {
    if (formValues.formUrl) setShotgunMode('form');
    else if (formValues.maxParticipant) setShotgunMode('shotgun');
  }, [event]);
  const fields = getFormFields(adminGroup, t, mode);
  React.useEffect(() => {
    axios
      .get('/api/group/group/', {
        params: { simple: true, limit: 20 },
      })
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
    if (formValues.beginDate)
      formData.append('date', formValues.beginDate.toISOString());
    if (formValues.endDate)
      formData.append('end_date', formValues.endDate.toISOString());
    formData.append(
      'end_inscription',
      formValues.endInscription ? formValues.endInscription.toISOString() : ''
    );
    formData.append('location', formValues.location);
    // Form
    formData.append(
      'form_url',
      shotgunMode === 'form' ? formValues.formUrl : ' '
    );
    // Shotgun
    formData.append(
      'max_participant',
      shotgunMode === 'shotgun' && formValues.maxParticipant
        ? formValues.maxParticipant.toString()
        : ''
    );
    formData.append(
      'begin_inscription',
      shotgunMode !== 'normal' && formValues.beginInscription
        ? formValues.beginInscription.toISOString()
        : ''
    );
    return formData;
  }

  const handleClick = () => {
    if (mode === 'edit') {
      console.log('hey');
      editEvent();
    } else {
      createEvent();
    }
  };
  console.log(event);

  function createEvent() {
    if (saving) return;
    setSaving(true); // show loading
    const formData = createForm(); // format data
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
          setFormErrors(err.response.data); // show errors per fields
          snakeToCamelCase(err.response.data, {});
          console.log(err.response.data);
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
  function editEvent() {
    if (saving) return;
    setSaving(true); // show loading
    const formData = createForm(); // format data
    axios
      .put(`/api/event/${event.id}/`, formData, {
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
  function deleteEvent() {
    if (saving) return;
    setSaving(true); // show loading
    axios
      .delete(`/api/event/${event.id}/`)
      .then(() => {
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
    <>
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
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
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
            {mode === 'edit' && (
              <Button
                onClick={() => setConfirmationOpen(true)}
                variant="outlined"
                color="error"
                disabled={saving}
              >
                {t('form.deleteEvent')}
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              variant="text"
              color="inherit"
              disabled={saving}
            >
              {t('form.cancel')}
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
                onClick={() => editEvent()}
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
      <ConfirmationModal
        title={t('form.deleteEvent')}
        content={t('form.deleteEventConfirmation')}
        onClose={(value) => {
          if (value) deleteEvent();
          setConfirmationOpen(false);
        }}
        open={confirmationOpen}
      />
    </>
  );
}

EditEventModal.defaultProps = {
  event: null,
  mode: 'create',
};

export default EditEventModal;