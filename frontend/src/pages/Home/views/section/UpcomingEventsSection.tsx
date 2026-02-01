import { Link } from 'react-router-dom';

import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Alert, Button, Grid, Typography } from '@mui/material';

import { EventCard } from '#modules/event/view/EventCard/EventCard';
import { EventCardSkeleton } from '#modules/event/view/EventCard/EventCardSkeleton';
import { useUpcomingEventsQuery } from '#pages/Home/hooks/useUpcomingEvents.query';
import { Section } from '#shared/components/Section/Section';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';
import { repeat } from '#shared/utils/repeat';

function SeeAllEventsButton({ label }: { label: string }) {
  return (
    <Button
      component={Link}
      to="/event"
      variant="outlined"
      color="secondary"
      endIcon={<ChevronRightIcon />}
    >
      {label}
    </Button>
  );
}

interface UpcomingEventsSectionProps {
  enabled: boolean;
}

export function UpcomingEventsSection({ enabled }: UpcomingEventsSectionProps) {
  const { t } = useTranslation();
  const smBk = useBreakpoint('sm');
  const mdBk = useBreakpoint('md');
  const numberOfEvents = mdBk.isLarger ? 6 : smBk.isLarger ? 4 : 3;

  const eventsQuery = useUpcomingEventsQuery(numberOfEvents, { enabled });

  if (eventsQuery.isPending) {
    return (
      <Section
        title={t('home.eventSection.title')}
        button={<SeeAllEventsButton label={t('home.eventSection.seeAll')} />}
      >
        <Grid container spacing={1}>
          {repeat(
            numberOfEvents,
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventCardSkeleton />
            </Grid>,
          )}
        </Grid>
      </Section>
    );
  }

  if (eventsQuery.isError) {
    return (
      <Section
        title={t('home.eventSection.title')}
        button={<SeeAllEventsButton label={t('home.eventSection.seeAll')} />}
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
        button={<SeeAllEventsButton label={t('home.eventSection.seeAll')} />}
      >
        <Typography>{t('home.eventSection.isEmpty')}</Typography>
      </Section>
    );
  }

  return (
    <Section
      title={t('home.eventSection.title')}
      button={<SeeAllEventsButton label={t('home.eventSection.seeAll')} />}
    >
      <Grid spacing={1} container>
        {upcomingEvents.map((event) => (
          <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      {eventsQuery.data.count > numberOfEvents && (
        <>
          <Spacer vertical={1} />
          <SeeAllEventsButton label={t('home.eventSection.seeMore')} />
        </>
      )}
    </Section>
  );
}
