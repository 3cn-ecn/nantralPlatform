import { FormEvent, useState } from 'react';

import {
  Edit as EditIcon,
  List as ListIcon,
  LocalGroceryStore as CartIcon,
  Settings,
} from '@mui/icons-material';
import { Avatar, Button, Tab, Tabs, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateEventApi,
  UpdateEventApiVariables,
} from '#modules/event/api/updateEvent.api';
import { Event, EventForm } from '#modules/event/event.type';
import { useEventFormValues } from '#modules/event/hooks/useEventFormValues';
import { EventFormDTO } from '#modules/event/infra/event.dto';
import { EditItemsView } from '#modules/nantralpay/view/EditItemsView/EditItemsView';
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

import { EventFormFields } from '../shared/EventFormFields';

interface EditEventModalContentProps {
  event: Event;
  onClose: () => void;
}

export function EditEventModalContent({
  event,
  onClose,
}: EditEventModalContentProps) {
  const { t, currentBaseLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [tab, setTab] = useState(0);

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  const [formValues, updateFormValues] = useEventFormValues({ event: event });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isLoading, isError, error } = useMutation<
    unknown,
    ApiFormError<EventFormDTO>,
    UpdateEventApiVariables
  >(updateEventApi);

  // send the form to the server
  const onSubmit = (e: FormEvent, values: EventForm) => {
    // prevent the default function of <form>
    e.preventDefault();
    // call the updatePost function
    mutate(
      { id: event.id, data: values },
      {
        onSuccess: () => {
          // if success, reset the event data in all queries
          queryClient.invalidateQueries(['events']);
          queryClient.invalidateQueries(['event', { id: event.id }]);
          queryClient.invalidateQueries(['notifications']);
          // close the modal
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
      {event.useNantralpay && (
        <div style={{ position: 'relative', maxHeight: 100 }}>
          <Tabs
            variant="scrollable"
            value={tab}
            onChange={(e, val) => setTab(val)}
            allowScrollButtonsMobile
          >
            <Tab
              label={t('event.editModal.tabs.general')}
              iconPosition="start"
              icon={<Settings />}
            />
            <Tab
              label={t('event.editModal.tabs.items')}
              iconPosition="start"
              icon={<CartIcon />}
            />
            <Tab
              label={t('event.editModal.tabs.npInfo')}
              iconPosition="start"
              icon={<ListIcon />}
            />
          </Tabs>
        </div>
      )}
      {tab == 0 && (
        <ResponsiveDialogContent>
          <form id="edit-event-form" onSubmit={(e) => onSubmit(e, formValues)}>
            <EventFormFields
              isError={isError}
              error={error}
              formValues={formValues}
              updateFormValues={updateFormValues}
              prevData={event}
              selectedLang={selectedLang}
            />
          </form>
        </ResponsiveDialogContent>
      )}
      {tab == 1 && (
        <ResponsiveDialogContent>
          <EditItemsView event={event} />
        </ResponsiveDialogContent>
      )}
      {tab == 2 && (
        <ResponsiveDialogContent>
          <div style={{ padding: '1rem' }}>
            <p>{t('event.editModal.links.notAvailable')}</p>
          </div>
        </ResponsiveDialogContent>
      )}
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-event-form"
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
