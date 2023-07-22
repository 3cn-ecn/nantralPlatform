import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';

import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import EditEventModal from '#shared/components/FormEvent/FormEvent';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { ActionButtonsBar } from './components/ActionButtonsBar';
import { BackgroundImageOverlay } from './components/BackgroundImageOverlay';
import { EventInfo } from './components/EventInfo';
import { EventPopupAlerts } from './components/EventPopupAlerts';
import { TopImage } from './components/TopImage';
import { useEventDetailsQuery } from './hooks/useEventDetails.query';

export default function EventDetailsPage() {
  const { id: eventId } = useParams();
  const eventQuery = useEventDetailsQuery(Number(eventId));
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  if (eventQuery.isLoading || eventQuery.isIdle) {
    return (
      <Container>
        <FlexRow justifyContent="center" mt={8}>
          <CircularProgress />
        </FlexRow>
      </Container>
    );
  }

  if (eventQuery.isError) {
    return (
      <ErrorPageContent
        status={eventQuery.error.status}
        errorMessage={eventQuery.error.message}
        retryFn={eventQuery.refetch}
      />
    );
  }

  const event = eventQuery.data;

  return (
    <Box position="relative">
      <BackgroundImageOverlay src={event.image} />
      <Container maxWidth="md" disableGutters>
        <TopImage src={event.image} />
      </Container>
      <Container
        maxWidth="md"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}
      >
        <Typography variant="h3">{event.title}</Typography>
        <ActionButtonsBar event={event} />
        <EventInfo
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
          group={event.group}
        />
        <EventPopupAlerts event={event} />
        <Divider />
        <Typography dangerouslySetInnerHTML={{ __html: event.description }} />
        <Spacer vertical={200} />
      </Container>
      <EditEventModal
        closeModal={() => setIsOpenEditModal(false)}
        open={isOpenEditModal}
        event={event}
        mode="edit"
        onDelete={() => history.back()}
      />
    </Box>
  );
}
