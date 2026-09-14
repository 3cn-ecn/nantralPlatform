import { FormEvent, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEventApi } from '#modules/event/api/createEvent.api';
import { Event, EventForm } from '#modules/event/event.type';
import { useEventFormValues } from '#modules/event/hooks/useEventFormValues';
import { EventFormDTO } from '#modules/event/infra/event.dto';
import { Group } from '#modules/group/types/group.types';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EventFormFields } from '../shared/EventFormFields';

interface CreateEventModalProps {
  onClose: () => void;
  onCreated?: (id?: number) => void;
  group?: Group;
}

export function CreateEventModal({
  onClose,
  onCreated = onClose,
  group,
}: CreateEventModalProps) {
  const { t, currentBaseLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  // the values currently in our form
  const [formValues, updateFormValues] = useEventFormValues({
    group: group,
  });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isPending, isError, error } = useMutation<
    Event,
    ApiFormError<EventFormDTO>,
    EventForm
  >({ mutationFn: createEventApi });

  // send the form to the server
  const onSubmit = (e: FormEvent, values: EventForm) => {
    // prevent the default function of <form>
    e.preventDefault();
    // call the updatePost function
    mutate(values, {
      onSuccess: (data) => {
        // if success, reset the event data in all queries
        queryClient.invalidateQueries({
          queryKey: ['events'],
        });
        queryClient.invalidateQueries({
          queryKey: ['notifications'],
        });
        // close the modal
        onCreated(data.id);
      },
    });
  };

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <ResponsiveDialogHeader
        onClose={onClose}
        helpUrl="https://docs.nantral-platform.fr/user/posts-events/create-event"
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <EditIcon />
          </Avatar>
        }
      >
        {t('event.createModal.title')}
        <Spacer flex={1} />
        <LanguageSelector
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="create-event-form" onSubmit={(e) => onSubmit(e, formValues)}>
          <EventFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            selectedLang={selectedLang}
            prevData={{ group: group }}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="create-event-form"
          type="submit"
          loading={isPending}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
