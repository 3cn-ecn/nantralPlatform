import { FormEvent, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSportEventApi } from '#modules/event/api/createSportEvent.api';
import { useSportEventFormValues } from '#modules/event/hooks/useSportEventFormValues';
import { SportEventFormDTO } from '#modules/event/infra/sportevent.dto';
import { SportEvent, SportEventForm } from '#modules/event/sportevent.type';
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

import { SportEventFormFields } from '../shared/SportEventFormFields';

interface CreateSportEventModalProps {
  onClose: () => void;
  onCreated?: (id?: number) => void;
  group?: Group;
}

export function CreateSportEventModal({
  onClose,
  onCreated = onClose,
  group,
}: Readonly<CreateSportEventModalProps>) {
  const { t, currentBaseLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  // the values currently in our form
  const [formValues, updateFormValues] = useSportEventFormValues({
    group: group,
  });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isLoading, isError, error } = useMutation<
    SportEvent,
    ApiFormError<SportEventFormDTO>,
    SportEventForm
  >(createSportEventApi);

  // send the form to the server
  const onSubmit = (e: FormEvent, values: SportEventForm) => {
    // prevent the default function of <form>
    e.preventDefault();
    // call the updatePost function
    mutate(values, {
      onSuccess: (data) => {
        // if success, reset the sport event data in all queries
        queryClient.invalidateQueries(['sport-events']);
        queryClient.invalidateQueries(['notifications']);
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
        <form
          id="create-sport-event-form"
          onSubmit={(e) => onSubmit(e, formValues)}
        >
          <SportEventFormFields
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
          form="create-sport-event-form"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
