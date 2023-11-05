import { useEffect } from 'react';

import { Button, Grid, Typography } from '@mui/material';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { EventCard } from '#modules/event/view/EventCard/EventCard';
import { EventCardSkeleton } from '#modules/event/view/EventCard/EventCardSkeleton';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';
import { repeat } from '#shared/utils/repeat';

import { useInfiniteEventListQuery } from '../hooks/useInfiniteEventList.query';

interface EventInfiniteGridProps {
  filters: EventListQueryParams;
  disableLoading?: boolean;
}

export function EventInfiniteGrid({
  filters,
  disableLoading,
}: EventInfiniteGridProps) {
  const { t } = useTranslation();
  const bk = useBreakpoint('lg');

  const eventsPerPage = bk.isLarger ? 8 : 6;

  const eventsQuery = useInfiniteEventListQuery(
    { ...filters, pageSize: eventsPerPage },
    { enabled: !disableLoading },
  );

  function loadMore() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement?.scrollHeight
    ) {
      eventsQuery.fetchNextPage();
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  });

  if (eventsQuery.isLoading) {
    return (
      <Grid container spacing={1}>
        {repeat(
          eventsPerPage,
          <Grid xs={12} sm={6} md={4} lg={3} item>
            <EventCardSkeleton />
          </Grid>,
        )}
      </Grid>
    );
  }

  if (eventsQuery.isError) {
    return (
      <ErrorPageContent
        status={eventsQuery.error.status}
        errorMessage={eventsQuery.error.message}
        retryFn={eventsQuery.refetch}
      />
    );
  }

  if (eventsQuery.data.pages[0].count === 0) {
    return (
      <Typography color="secondary" textAlign="center" mt={3}>
        {t('event.list.noEventFound')}
      </Typography>
    );
  }

  return (
    <>
      <Grid spacing={1} container>
        {eventsQuery.data.pages.map((page) =>
          page.results.map((event) => (
            <Grid key={event.id} xs={12} sm={6} md={4} lg={3} item>
              <EventCard event={event} />
            </Grid>
          )),
        )}
        {eventsQuery.isFetchingNextPage &&
          repeat(
            eventsPerPage,
            <Grid xs={12} sm={6} md={4} lg={3} item>
              <EventCardSkeleton />
            </Grid>,
          )}
      </Grid>
      <FlexRow justifyContent="center" mt={3}>
        {eventsQuery.hasNextPage && !eventsQuery.isFetchingNextPage && (
          <Button
            onClick={() => eventsQuery.fetchNextPage()}
            variant="contained"
            color="secondary"
            size="small"
          >
            {t('event.list.loadMore')}
          </Button>
        )}
        {!eventsQuery.hasNextPage && (
          <Typography color="secondary">
            {t('event.list.allIsLoaded')}
          </Typography>
        )}
      </FlexRow>
    </>
  );
}
