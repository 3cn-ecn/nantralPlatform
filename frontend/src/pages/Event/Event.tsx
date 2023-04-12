import React, { useState } from 'react';
import { Box, Tab, Button, Container, Pagination } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';
import { FilterInterface } from 'Props/Filter';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Page } from 'Props/pagination';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { EventProps } from '../../Props/Event';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import ModalEditEvent from '../../components/FormEvent/FormEvent';
import { ListResults, LoadStatus } from '../../Props/GenericTypes';
import { getEvents } from '../../api/event';

const EVENT_PER_PAGE = 6;

function EventList(props: {
  status: LoadStatus;
  events: ListResults<EventProps>;
  onChangePage: (page: number) => void;
  page: number;
}) {
  const { events, status, onChangePage, page } = props;
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
        events={events?.results}
        loadingItemCount={EVENT_PER_PAGE}
      ></EventSection>
      <Pagination
        sx={{ marginBottom: 5 }}
        count={
          (events?.count &&
            Math.floor((events.count - 1) / EVENT_PER_PAGE + 1)) ||
          1
        }
        page={page}
        onChange={handleNextPage}
      />
    </>
  );
}

function EventCalendar(props: { events: any }) {
  const { events } = props;
  return <Calendar events={events}></Calendar>;
}

function EventView(props: {
  filter: any;
  selectedTab: string | null;
  onChangeTab: (tab: string) => void;
  onChangePage: (page: number) => void;
  initialPage: number;
}) {
  const { filter, selectedTab, onChangeTab, onChangePage, initialPage } = props;
  const [value, setValue] = React.useState(selectedTab || '1');
  const [currentPage, setCurrentPage] = React.useState<number>(initialPage);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onChangeTab(newValue);
  };

  const today = new Date();
  // Request to get Events to display, depending of the filter.
  // If no date filter, only current and futur events are displayed.
  const {
    data: eventsList,
    // refetch: refetchEventList,
    status: eventsListStatus,
  } = useQuery<Page<EventProps>>({
    queryKey: ['eventList', filter, currentPage],
    queryFn: () =>
      getEvents({
        limit: EVENT_PER_PAGE,
        offset: (currentPage - 1) * EVENT_PER_PAGE,
        orderBy: '-date',
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
        fromDate: filter.dateBegin,
        toDate: filter.dateEnd,
      }),
  });

  const {
    data: eventsCalendar,
    // TODO Support status in calendar
    // status: eventsCalendarStatus,
  } = useQuery<Page<EventProps>>({
    queryKey: ['eventCalendar', filter],
    queryFn: () =>
      getEvents({
        limit: 100,
        offset: 0,
        orderBy: '-date',
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
      }),
    placeholderData: { count: 0, next: null, previous: null, results: [] },
  });

  const handleNextPage = (newPage: number) => {
    if (currentPage === newPage) return;
    setCurrentPage(newPage);
    onChangePage(newPage);
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
        <EventList
          status={eventsListStatus}
          events={eventsList}
          onChangePage={handleNextPage}
          page={currentPage}
        ></EventList>
      </TabPanel>
      <TabPanel value="2" sx={{ padding: 0 }}>
        <EventCalendar events={eventsCalendar?.results}></EventCalendar>
      </TabPanel>
    </TabContext>
  );
}

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
function Event() {
  const [queryParameters, setQueryParams] = useSearchParams();
  const [filter, setFilter] = React.useState<FilterInterface | null>({
    dateBegin: queryParameters.get('dateBegin'),
    dateEnd: queryParameters.get('dateEnd'),
    favorite: queryParameters.get('favorite') ? true : null,
    organiser: queryParameters.get('organiser'),
    participate: queryParameters.get('participate') ? true : null,
    shotgun: queryParameters.get('shotgun') ? true : null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  function updateParameters(attributes: object) {
    const pairs = Object.entries(attributes);
    pairs.forEach(([key, value]) => {
      if (value) queryParameters.set(key, value.toString());
      else queryParameters.delete(key);
    });
    setQueryParams(queryParameters);
  }

  const getFilter = (validateFilter: FilterInterface) => {
    setFilter(validateFilter);
    updateParameters(validateFilter);
  };

  return (
    <Container className="EventPage">
      <h1>Évènements</h1>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-begin' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenAddModal(true)}
          >
            Créer un événement
          </Button>
          <ModalEditEvent
            open={openAddModal}
            closeModal={() => setOpenAddModal(false)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FilterBar filter={filter} getFilter={getFilter} />
        </div>
      </Box>
      <EventView
        filter={filter}
        initialPage={Number.parseInt(queryParameters.get('page'), 10) || 1}
        selectedTab={queryParameters.get('tab')}
        onChangeTab={(value) => updateParameters({ tab: value })}
        onChangePage={(page: number) => updateParameters({ page: page })}
      />
    </Container>
  );
}

export default Event;
