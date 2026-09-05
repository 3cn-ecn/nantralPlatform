import { useParams } from 'react-router';

import { AdminPanelSettings as AdminPanelSettingsIcon } from '@mui/icons-material';
import {
  Container,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { useSuspenseEventDetailQuery } from '#modules/event/hooks/useEventDetails.query';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { TopImage } from '../../shared/components/TopImage/TopImage';
import { ActionButtonsBar } from './components/ActionButtonsBar';
import { BackgroundImageOverlay } from './components/BackgroundImageOverlay';
import { EventInfo } from './components/EventInfo';
import { EventPopupAlerts } from './components/EventPopupAlerts';

export default function EventDetailsPage() {
  const { t } = useTranslation();
  const { staff } = useCurrentUserData();

  const { id: eventId } = useParams();
  // Using suspense query allows to skip isPending, isError states: they
  // are catch by the nearest <Suspense> boundary, in this case the one
  // from <PageTemplate />.
  // We add useErrorBoundary: false to remove the isError state from suspense
  const eventQuery = useSuspenseEventDetailQuery(Number(eventId));

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
