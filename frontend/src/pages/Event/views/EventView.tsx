import React from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import axios from 'axios';

import Calendar from '#components/Calendar/Calendar';
import { EventProps, eventsToCamelCase } from '#types/Event';
import { ListResults, LoadStatus } from '#types/GenericTypes';

import EventGrid from './EventGrid';

const EVENT_PER_PAGE = 6;

interface EventViewProps {
  filter: any;
  selectedTab: string | null;
  onChangeTab: (tab: string) => void;
  onChangePage: (page: number) => void;
}

export default function EventView({
  filter,
  selectedTab,
  onChangeTab,
  onChangePage,
}: EventViewProps) {
  const [value, setValue] = React.useState(selectedTab || '1');
  const [status, setStatus] = React.useState<LoadStatus>('loading');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [eventsList, setEventsList] = React.useState<ListResults<EventProps>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [eventsCalendar, setEventsCalendar] = React.useState<Array<EventProps>>(
    []
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onChangeTab(newValue);
  };

  const today = new Date();
  // Request to get Events to display, depending of the filter.
  // If no date filter, only current and futur events are displayed.
  React.useEffect(() => {
    setStatus('loading');
    if (filter !== null) {
      // filtered calendar
      axios
        .get('/api/event/', {
          params: {
            is_shotgun: filter.shotgun,
            is_favorite: filter.favorite,
            is_participating: filter.participate,
            group: filter.organiser,
            limit: EVENT_PER_PAGE,
            order_by: '-date',
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data.results);
          setEventsCalendar(res.data.results);
          setStatus('success');
        })
        .catch(() => {
          setStatus('error');
        });
      if (filter.dateBegin === '' && filter.dateEnd === '') {
        // filtered list without date filters (only current and futur events)
        axios
          .get('/api/event', {
            params: {
              is_shotgun: filter.shotgun,
              is_favorite: filter.favorite,
              is_participating: filter.participate,
              from_date: today,
              group: filter.organiser,
              limit: EVENT_PER_PAGE,
              order_by: '-date',
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data.results);
            setEventsList(res.data);
            setStatus('success');
          })
          .catch(() => {
            setStatus('error');
          });
      } else {
        // filtered list with date filters
        axios
          .get('/api/event/', {
            params: {
              is_shotgun: filter.shotgun,
              is_favorite: filter.favorite,
              is_participating: filter.participate,
              from_date: filter.dateBegin,
              to_date: filter.dateEnd,
              group: filter.organiser,
              limit: EVENT_PER_PAGE,
              order_by: '-date',
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data.results);
            setEventsList(res.data);
            setStatus('success');
          })
          .catch(() => {
            setStatus('error');
          });
      }
    } else {
      // non filtered list
      axios
        .get('/api/event/', {
          params: {
            from_date: today,
            limit: EVENT_PER_PAGE,
            order_by: '-date',
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data.results);
          setEventsList(res.data);
          setStatus('success');
        })
        .catch(() => {
          setStatus('error');
        });

      // non filtered calendar
      axios
        .get('/api/event/')
        .then((res: any) => {
          eventsToCamelCase(res.data.results);
          setEventsCalendar(res.data.results);
          setStatus('success');
        })
        .catch(() => {
          setStatus('error');
        });
    }
  }, [filter]);
  const handleNextPage = (newPage: number) => {
    if (currentPage === newPage) return;
    setStatus('loading');
    setCurrentPage(newPage);
    onChangePage(newPage);
    axios
      .get(eventsList.next || eventsList.previous, {
        params: { offset: (newPage - 1) * EVENT_PER_PAGE },
      })
      .then((res: any) => {
        eventsToCamelCase(res.data.results);
        setEventsList(res.data);
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  };
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Liste" value="1" />
          <Tab label="Calendrier" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ padding: 0 }}>
        <EventGrid
          status={status}
          events={eventsList}
          onChangePage={handleNextPage}
          page={currentPage}
          eventsPerPage={EVENT_PER_PAGE}
        ></EventGrid>
      </TabPanel>
      <TabPanel value="2" sx={{ padding: 0 }}>
        <Calendar events={eventsCalendar}></Calendar>
      </TabPanel>
    </TabContext>
  );
}
