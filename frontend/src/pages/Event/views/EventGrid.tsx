import React from 'react';

import { Pagination } from '@mui/material';

import { EventSection } from '#components/Section/EventSection/EventSection';
import { EventProps } from '#types/Event';
import { ListResults, LoadStatus } from '#types/GenericTypes';

interface EventGridProps {
  status: LoadStatus;
  events: ListResults<EventProps>;
  onChangePage: (page: number) => void;
  page: number;
  eventsPerPage: number;
}

export default function EventGrid({
  events,
  status,
  onChangePage,
  page,
  eventsPerPage,
}: EventGridProps) {
  const handleNextPage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (page !== newPage) onChangePage(newPage);
  };
  return (
    <>
      <div style={{ height: 30 }}></div>
      <EventSection
        status={status}
        events={events.results}
        loadingItemCount={eventsPerPage}
      ></EventSection>
      <Pagination
        sx={{ marginBottom: 5 }}
        count={Math.floor(events.count / eventsPerPage + 1) || 1}
        page={page}
        onChange={handleNextPage}
      />
    </>
  );
}
