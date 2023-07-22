import React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import Calendar from '#modules/event/view/Calendar/Calendar';
import { FilterInterface } from '#types/Filter';
import { Page } from '#types/Group';

import EventGrid from './EventGrid';

const EVENT_PER_PAGE = 6;

interface EventViewProps {
  filter: any;
  selectedTab: string | null;
  onChangeTab: (tab: string) => void;
  onChangePage: (page: number) => void;
}

export default function EventView(props: {
  filter: FilterInterface;
  selectedTab: string | null;
  onChangeTab: (tab: string) => void;
  onChangePage: (page: number) => void;
  onChangeFilter: (changes) => void;
  initialPage: number;
}) {
  const {
    filter,
    selectedTab,
    onChangeTab,
    onChangePage,
    initialPage,
    onChangeFilter,
  } = props;
  const [value, setValue] = React.useState(selectedTab || '1');
  const [currentPage, setCurrentPage] = React.useState<number>(initialPage);
  const [first, setFirst] = React.useState(true);
  const [order, setOrder] = React.useState<string>('-start_date');
  const [calendarRange, setCalendarRange] = React.useState<{
    from: Date;
    to: Date;
  }>({ from: new Date(), to: new Date() });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onChangeTab(newValue);
  };

  React.useEffect(() => {
    if (first) setFirst(false);
    else {
      setCurrentPage(1);
      onChangePage(1);
    }
  }, [filter]);

  const {
    data: eventsList,
    status: eventsListStatus,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Page<EventPreview>>({
    queryKey: ['eventList', filter],
    queryFn: ({ pageParam = 1 }) =>
      getEventList({
        limit: EVENT_PER_PAGE,
        offset: (pageParam - 1) * EVENT_PER_PAGE,
        orderBy: order,
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
        fromDate: filter.dateBegin,
        toDate: filter.dateEnd,
        group: filter?.organiser?.map((group) => group.slug),
      }),
  });

  const {
    data: eventsCalendar,
    // TODO Support status in calendar
    // status: eventsCalendarStatus,
  } = useQuery<Page<EventPreview>>({
    queryKey: ['eventCalendar', filter, calendarRange],
    queryFn: () =>
      getEventListApi({
        limit: 100,
        offset: 0,
        fromDate: calendarRange.from,
        toDate: calendarRange.to,
        orderBy: '-start_date',
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
        group: filter?.organiser?.map((group) => group.slug),
      }),
    placeholderData: { count: 0, next: null, previous: null, results: [] },
  });

  const handleNextPage = (newPage: number) => {
    if (currentPage * EVENT_PER_PAGE >= eventsList.pages[0].count) return;
    setCurrentPage(currentPage + 1);
    // onChangePage(newPage);
    fetchNextPage({ pageParam: currentPage + 1 });
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
          order={order}
          onChangeOrder={setOrder}
          filter={filter}
          onChangeFilter={(newChanges) => onChangeFilter(newChanges)}
          status={eventsListStatus}
          events={eventsList?.pages}
          onChangePage={handleNextPage}
          page={currentPage}
          fetchingNextPage={isFetchingNextPage}
        ></EventGrid>
      </TabPanel>
      <TabPanel value="2" sx={{ padding: 0 }}>
        <Calendar
          events={eventsCalendar?.results}
          onChangeRange={setCalendarRange}
        />
      </TabPanel>
    </TabContext>
  );
}
