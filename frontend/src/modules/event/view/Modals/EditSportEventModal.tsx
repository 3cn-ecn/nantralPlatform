import { CircularProgress } from '@mui/material';

import { useSportEventDetailsQuery } from '#modules/event/hooks/useSportEventDetails.query';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
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
}: EditSportEventModalProps) {
  const sportEventQuery = useSportEventDetailsQuery(sportEventId);

  if (sportEventQuery.isLoading) {
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
      <EditSportEventModalContent
        sportEvent={sportEvent}
        onClose={onClose}
      />
    </ResponsiveDialog>
  );
}
