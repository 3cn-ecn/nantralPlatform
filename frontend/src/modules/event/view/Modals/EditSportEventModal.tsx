import { CircularProgress, Stack } from '@mui/material';

import { useSportEventDetailsQuery } from '#modules/event/hooks/useSportEventDetails.query';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';

import { EditSportEventModalContent } from './EditSportEventModalContent';

interface EditSportEventModalProps {
  sportEventId: number;
  onClose: () => void;
}

export function EditSportEventModal({
  sportEventId,
  onClose,
}: Readonly<EditSportEventModalProps>) {
  const sportEventQuery = useSportEventDetailsQuery(sportEventId);

  if (sportEventQuery.isPending) {
    return (
      <ResponsiveDialog onClose={onClose}>
        <ResponsiveDialogHeader onClose={onClose}></ResponsiveDialogHeader>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            p: 9,
            pt: 0,
            height: '100%',
          }}
        >
          <CircularProgress />
        </Stack>
      </ResponsiveDialog>
    );
  }

  if (sportEventQuery.isError) {
    return (
      <ResponsiveDialog onClose={onClose}>
        <ResponsiveDialogHeader onClose={onClose}></ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <ErrorPageContent
            status={sportEventQuery.error.status}
            errorMessage={sportEventQuery.error.message}
            retryFn={sportEventQuery.refetch}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  const sportEvent = sportEventQuery.data;

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <EditSportEventModalContent sportEvent={sportEvent} onClose={onClose} />
    </ResponsiveDialog>
  );
}
