import { Link } from 'react-router-dom';

import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Alert, Button, Grid, Pagination, Typography } from '@mui/material';

import { EventCard } from '#modules/event/view/EventCard/EventCard';
import { EventCardSkeleton } from '#modules/event/view/EventCard/EventCardSkeleton';
import { useUpcomingEventsQuery } from '#pages/Home/hooks/useUpcomingEvents.query';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';
import { arrayRange } from '#shared/utils/arrayRange';

const NUMBER_OF_EVENTS = 6;

function SeeAllEventsButton() {
  const { t } = useTranslation();

  return (
    <Button
      component={Link}
      to="/event"
      variant="outlined"
      color="secondary"
      endIcon={<ChevronRightIcon />}
    >
      {t('home.eventSection.openEventPageButton.label')}
    </Button>
  );
}

interface UpcomingEventsSectionProps {
  enabled: boolean;
}

export function UpcomingEventsSection({ enabled }: UpcomingEventsSectionProps) {
  const { t } = useTranslation();
  const eventsQuery = useUpcomingEventsQuery(NUMBER_OF_EVENTS, { enabled });

  if (eventsQuery.isLoading || eventsQuery.isIdle) {
    return (
      <Section
        title={t('home.eventSection.title')}
        button={<SeeAllEventsButton />}
      >
        <Grid container spacing={1}>
          {arrayRange(NUMBER_OF_EVENTS).map((_, index) => (
            <Grid key={index} xs={12} sm={6} md={4} item>
              <EventCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Section>
    );
  }

  if (eventsQuery.isError) {
    if (eventsQuery.page > 1) eventsQuery.setPage(1);
    return (
      <Section
        title={t('home.eventSection.title')}
        button={<SeeAllEventsButton />}
      >
        <Alert severity="error" sx={{ width: 'max-content' }}>
          {t('home.eventSection.error')}
        </Alert>
      </Section>
    );
  }

  const upcomingEvents = eventsQuery.data.results;

  if (upcomingEvents.length === 0) {
    return (
      <Section
        title={t('home.eventSection.title')}
        button={<SeeAllEventsButton />}
      >
        <Typography>{t('home.eventSection.isEmpty')}</Typography>
      </Section>
    );
  }

  return (
    <Section
      title={t('home.eventSection.title')}
      button={<SeeAllEventsButton />}
    >
      <Grid spacing={1} container>
        {upcomingEvents.map((event) => (
          <Grid key={event.id} xs={12} sm={6} md={4} item>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      {eventsQuery.data.numPages > 1 && (
        <Pagination
          count={eventsQuery.data.numPages}
          page={eventsQuery.page}
          onChange={(e, val) => eventsQuery.setPage(val)}
          sx={{ mt: 1 }}
        />
      )}
    </Section>
  );
}
