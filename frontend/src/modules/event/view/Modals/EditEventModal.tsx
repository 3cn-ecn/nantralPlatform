import { CircularProgress } from '@mui/material';

import { useEventDetailsQuery } from '#modules/event/hooks/useEventDetails.query';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';

import { EditEventModalContent } from './EditEventModalContent';

interface EditEventModalProps {
  eventId: number;
  onClose: () => void;
}

export function EditEventModal({ eventId, onClose }: EditEventModalProps) {
  const eventQuery = useEventDetailsQuery(eventId);

  if (eventQuery.isPending) {
    return (
      <ResponsiveDialog onClose={onClose}>
        <ResponsiveDialogHeader onClose={onClose}></ResponsiveDialogHeader>
        <FlexRow
          justifyContent="center"
          alignItems="center"
          sx={{ p: 9, pt: 0, height: '100%' }}
        >
          <CircularProgress />
        </FlexRow>
      </ResponsiveDialog>
    );
  }

  if (eventQuery.isError) {
    return (
      <ResponsiveDialog onClose={onClose}>
        <ResponsiveDialogHeader onClose={onClose}></ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <ErrorPageContent
            status={eventQuery.error.status}
            errorMessage={eventQuery.error.message}
            retryFn={eventQuery.refetch}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  const event = eventQuery.data;

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <EditEventModalContent event={event} onClose={onClose} />
    </ResponsiveDialog>
  );
}
