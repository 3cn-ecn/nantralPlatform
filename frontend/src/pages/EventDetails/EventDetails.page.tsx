import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AdminPanelSettings as AdminPanelSettingsIcon } from '@mui/icons-material';
import {
  Container,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { useEventDetailsSuspenseQuery } from '#modules/event/hooks/useEventDetailsSuspense.query';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { TopImage } from '#shared/components/TopImage/TopImage';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ActionButtonsBar } from './components/ActionButtonsBar';
import { BackgroundImageOverlay } from './components/BackgroundImageOverlay';
import { EventInfo } from './components/EventInfo';
import { EventPopupAlerts } from './components/EventPopupAlerts';

export default function EventDetailsPage() {
  const { t } = useTranslation();
  const { staff } = useCurrentUserData();

  const { id: eventId } = useParams();
  // Using suspense: true allows to skip isPending, isError states: they
  // are catch by the nearest <Suspense> boundary, in this case the one
  // from <PageTemplate />.
  // We add useErrorBoundary: false to remove the isError state from suspense
  const eventQuery = useEventDetailsSuspenseQuery(Number(eventId));

  if (eventQuery.isError) {
    return (
      <ErrorPageContent
        status={eventQuery.error.status}
        errorMessage={eventQuery.error.message}
        retryFn={eventQuery.refetch}
      />
    );
  }

  if (eventQuery.isPending) {
    return <Spinner />;
  }

  if (!eventQuery.isSuccess) {
    // this case should never happen, thanks to the suspense option
    throw new Error('Something went wrong');
  }

  const event = eventQuery.data;

  return (
    <>
      <BackgroundImageOverlay src={event.image} />
      <Container maxWidth="md" disableGutters>
        <TopImage src={event.image} />
      </Container>
      <Container
        maxWidth="md"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}
      >
        <FlexRow alignItems="center" gap={1}>
          <Typography variant="h1">{event.title}</Typography>
          {staff && (
            <Tooltip title={t('site.adminSettings')}>
              <IconButton
                size="large"
                href={`/admin/event/event/${event.id}/change/`}
                target="_blank"
              >
                <AdminPanelSettingsIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </FlexRow>
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
        <Spacer vertical={25} />
      </Container>
    </>
  );
}
