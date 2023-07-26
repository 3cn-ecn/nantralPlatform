import { useParams } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';

import { useEventDetailsQuery } from '#modules/event/hooks/useEventDetails.query';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { ActionButtonsBar } from './components/ActionButtonsBar';
import { BackgroundImageOverlay } from './components/BackgroundImageOverlay';
import { EventInfo } from './components/EventInfo';
import { EventPopupAlerts } from './components/EventPopupAlerts';
import { TopImage } from './components/TopImage';

export default function EventDetailsPage() {
  const { id: eventId } = useParams();
  const eventQuery = useEventDetailsQuery(Number(eventId));

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
        <Typography variant="h3" component="h1">
          {event.title}
        </Typography>
        <ActionButtonsBar event={event} />
        <EventInfo
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
          group={event.group}
        />
        <EventPopupAlerts event={event} />
        <Divider />
        <RichTextRenderer content={event.description} />
        <Spacer vertical={200} />
      </Container>
    </Box>
  );
}
