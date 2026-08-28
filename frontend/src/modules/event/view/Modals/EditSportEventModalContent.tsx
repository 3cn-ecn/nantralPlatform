import { FormEvent, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  UpdateSportEventApiVariables,
  updateSportEventApi,
} from '#modules/event/api/updateSportEvent.api';
import { useSportEventFormValues } from '#modules/event/hooks/useSportEventFormValues';
import { SportEventFormDTO } from '#modules/event/infra/sportevent.dto';
import { SportEvent, SportEventForm } from '#modules/event/sportevent.type';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { SportEventFormFields } from '../shared/SportEventFormFields';

interface EditSportEventModalContentProps {
  sportEvent: SportEvent;
  onClose: () => void;
}

export function EditSportEventModalContent({
  sportEvent,
  onClose,
}: Readonly<EditSportEventModalContentProps>) {
  const { t, currentBaseLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  const [formValues, updateFormValues] = useSportEventFormValues({
    event: sportEvent,
  });

  const { mutate, isLoading, isError, error } = useMutation<
    unknown,
    ApiFormError<SportEventFormDTO>,
    UpdateSportEventApiVariables
  >(updateSportEventApi);

  const onSubmit = (e: FormEvent, values: SportEventForm) => {
    e.preventDefault();
    mutate(
      { id: sportEvent.id, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['sport-events']);
          queryClient.invalidateQueries(['sport-event', { id: sportEvent.id }]);
          queryClient.invalidateQueries(['notifications']);
          onClose();
        },
      },
    );
  };

  return (
    <>
      <ResponsiveDialogHeader
        onClose={onClose}
        helpUrl="https://docs.nantral-platform.fr/user/posts-events/create-event"
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <EditIcon />
          </Avatar>
        }
      >
        {t('event.editModal.title')}
        <Spacer flex={1} />
        <LanguageSelector
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form
          id="edit-sport-event-form"
          onSubmit={(e) => onSubmit(e, formValues)}
        >
          <SportEventFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            prevData={sportEvent}
            selectedLang={selectedLang}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-sport-event-form"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </>
  );
}
