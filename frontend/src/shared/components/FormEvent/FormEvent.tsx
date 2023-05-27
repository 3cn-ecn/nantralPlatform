import React from 'react';
import { useQuery } from 'react-query';

import {
  Close as CloseIcon,
  Delete,
  People as FreeIcon,
  Link as LinkIcon,
  LocalFireDepartment as ShotgunIcon,
} from '@mui/icons-material';
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
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { createEvent, deleteEvent, editEvent } from '#api/event';
import { getGroups } from '#api/group';
import { Event } from '#modules/event/event.type';
import { SimpleGroup } from '#shared/components/Group/interfaces';
import { useTranslation } from '#shared/i18n/useTranslation';
import { convertFromPythonData } from '#shared/utils/convertData';
import FormGroup from '#shared/utils/form';
import { FormEventProps } from '#types/Event';
import { FieldType } from '#types/GenericTypes';
import { SimpleGroupProps } from '#types/Group';

import { ConfirmationModal } from '../Modal/ConfirmationModal';
import './FormEvent.scss';

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
      label: t('form.eventTitle'),
      required: true,
    },
    {
      kind: 'group',
      fields: [
        {
          kind: 'datetime',
          name: 'startDate',
          label: t('form.startDatetime'),
          required: true,
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'endDate',
          label: t('form.endDatetime'),
          required: true,
          disablePast: true,
        },
      ],
    },
    {
      kind: 'text',
      name: 'location',
      label: t('form.place'),
    },
    {
      kind: 'richtext',
      name: 'description',
      label: t('form.description'),
    },
    {
      kind: 'file',
      description: t('form.imageDescription'),
      label: t('form.image'),
      name: 'image',
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

  const normalFields: FieldType[] = [
    {
      kind: 'group',
      fields: [
        {
          kind: 'datetime',
          name: 'startRegistration',
          label: "Date heure d'ouverture des inscriptions",
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'endRegistration',
          label: 'Date et Heure de fin des inscriptions',
          disablePast: true,
        },
      ],
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
      kind: 'group',
      fields: [
        {
          kind: 'datetime',
          name: 'startRegistration',
          label: 'Date et Heure du Shotgun',
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'endRegistration',
          label: 'Date et Heure de fin des inscriptions',
          disablePast: true,
        },
      ],
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
      kind: 'group',
      fields: [
        {
          kind: 'datetime',
          name: 'startRegistration',
          label: "Date heure d'ouverture des inscriptions",
          disablePast: true,
        },
        {
          kind: 'datetime',
          name: 'endRegistration',
          label: 'Date et Heure de fin des inscriptions',
          disablePast: true,
        },
      ],
    },
  ];
  return {
    mainFields: mainFields,
    shotgunFields: shotgunFields,
    formFields: formFields,
    normalFields: normalFields,
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
    startRegistration: null,
    startDate: null,
    description: '',
    endDate: null,
    endRegistration: null,
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
  event?: Event;
  mode?: 'create' | 'edit';
  closeModal: () => void;
  onUpdate?: (event: FormEventProps) => void;
  onDelete?: () => void;
}) {
  const { open, closeModal, event, mode, onUpdate, onDelete } = props;
  const eventDisplayed = event || createBlankEvent();
  const { t } = useTranslation();
  const [formValues, setFormValues] = React.useState<FormEventProps>({
    ...structuredClone(eventDisplayed),
    group: event?.group.id,
  });
  const [formErrors, setFormErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [globalErrors, setGlobalErrors] = React.useState('');
  const [confirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);
  const [registrationMode, setRegistrationMode] = React.useState<
    'normal' | 'shotgun' | 'form'
  >('normal');
  React.useEffect(() => {
    if (event?.formUrl) setRegistrationMode('form');
    else if (event?.maxParticipant) setRegistrationMode('shotgun');
    else setRegistrationMode('normal');
  }, [event]);

  const { data: adminGroup } = useQuery<SimpleGroupProps[], string>({
    queryKey: 'admin-group',
    queryFn: () => getGroups({ admin: true, limit: 20, simple: true }),
  });

  const theme = useTheme();

  const fields = getFormFields(adminGroup, t, mode);

  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));

  function handleCreate() {
    if (saving) return;
    setSaving(true); // show loading
    createEvent(formValues, registrationMode)
      .then((res: FormEventProps) => {
        // reset all errors messages, saving loading and close modal
        setFormErrors({});
        setGlobalErrors('');
        setSaving(false);
        onUpdate(res);
        closeModal();
      })
      .catch((err) => {
        setSaving(false);
        if (err.response) {
          setFormErrors(err.response.data); // show errors per fields
          convertFromPythonData(err.response.data);
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
  function handleEdit() {
    if (saving) return;
    setSaving(true); // show loading
    editEvent(event.id, formValues, registrationMode)
      .then((res: FormEventProps) => {
        // reset all errors messages, saving loading and close modal
        setFormErrors({});
        setGlobalErrors('');
        onUpdate(res);
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
  function handleDelete() {
    if (saving) return;
    setSaving(true); // show loading
    deleteEvent(event.id)
      .then(() => {
        setSaving(false);
        closeModal();
        onDelete();
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
      <form onSubmit={handleCreate}>
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
                  columnGap: '1ex',
                  justifyContent: 'space-between',
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
                </Typography>
                <Select
                  value={registrationMode}
                  onChange={(evt) =>
                    setRegistrationMode(
                      evt.target.value as 'normal' | 'shotgun' | 'form'
                    )
                  }
                  id="shotgun-type"
                  sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}
                >
                  <MenuItem sx={{ columnGap: 1 }} value="normal">
                    <FreeIcon />
                    {t('form.freeRegistration')}
                  </MenuItem>
                  <MenuItem sx={{ columnGap: 1 }} value="shotgun">
                    <ShotgunIcon />
                    Shotgun
                  </MenuItem>
                  <MenuItem sx={{ columnGap: 1 }} value="form">
                    <LinkIcon />
                    {t('form.externalLink')}
                  </MenuItem>
                </Select>
              </div>
              {registrationMode === 'shotgun' && (
                <FormGroup
                  fields={fields.shotgunFields}
                  values={formValues}
                  errors={formErrors}
                  setValues={setFormValues}
                />
              )}
              {registrationMode === 'form' && (
                <FormGroup
                  fields={fields.formFields}
                  values={formValues}
                  errors={formErrors}
                  setValues={setFormValues}
                />
              )}
              {registrationMode === 'normal' && (
                <FormGroup
                  fields={fields.normalFields}
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
                startIcon={<Delete />}
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
                onClick={() => handleCreate()}
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
                onClick={() => handleEdit()}
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
          if (value) handleDelete();
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
  onUpdate: () => null,
  onDelete: () => null,
};

export default EditEventModal;
