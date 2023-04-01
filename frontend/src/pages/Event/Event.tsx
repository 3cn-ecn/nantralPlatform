import React, { useState } from 'react';
import { Box, Tab, Button, Container, Pagination } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';
import { FilterInterface } from 'Props/Filter';
import { useSearchParams } from 'react-router-dom';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import ModalEditEvent from '../../components/FormEvent/FormEvent';
import { ListResults, LoadStatus } from '../../Props/GenericTypes';

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
      <EventSection status={status} events={events.results}></EventSection>
      <Pagination
        sx={{ marginBottom: 1 }}
        count={Math.floor(events.count / EVENT_PER_PAGE + 1) || 1}
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
}) {
  const { filter, selectedTab, onChangeTab } = props;
  const [value, setValue] = React.useState(selectedTab || '1');
  const [status, setStatus] = React.useState<LoadStatus>('load');
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

  function getListEvents(queryFilter?: any, offset = 0) {
    axios
      .get('/api/event', {
        params: {
          is_shotgun: queryFilter.shotgun,
          is_favorite: queryFilter.favorite,
          from_date: queryFilter.from_date,
          group: filter.organiser,
          limit: EVENT_PER_PAGE,
          offset: offset,
        },
      })
      .then((res: any) => {
        eventsToCamelCase(res.data.results);
        setEventsList(res.data);
        setStatus('success');
      })
      .catch(() => {
        setStatus('fail');
      });
  }

  const today = new Date();
  // Request to get Events to display, depending of the filter.
  // If no date filter, only current and futur events are displayed.
  React.useEffect(() => {
    setStatus('load');
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
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data.results);
          setEventsCalendar(res.data.results);
          setStatus('success');
        })
        .catch(() => {
          setStatus('fail');
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
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data.results);
            setEventsList(res.data);
            setStatus('success');
          })
          .catch(() => {
            setStatus('fail');
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
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data.results);
            setEventsList(res.data);
            setStatus('success');
          })
          .catch(() => {
            setStatus('fail');
          });
      }
    } else {
      // non filtered list
      axios
        .get('/api/event/', {
          params: {
            from_date: today,
            limit: EVENT_PER_PAGE,
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data.results);
          setEventsList(res.data);
          setStatus('success');
        })
        .catch(() => {
          setStatus('fail');
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
          setStatus('fail');
        });
    }
  }, [filter]);
  const handleNextPage = (newPage: number) => {
    if (currentPage === newPage) return;
    setCurrentPage(newPage);
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
        setStatus('fail');
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
        <EventList
          status={status}
          events={eventsList}
          onChangePage={handleNextPage}
          page={currentPage}
        ></EventList>
      </TabPanel>
      <TabPanel value="2" sx={{ padding: 0 }}>
        <EventCalendar events={eventsCalendar}></EventCalendar>
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
  const [tab, setTab] = React.useState(queryParameters.get('tab') || '1');
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
        selectedTab={queryParameters.get('tab')}
        onChangeTab={(value) => updateParameters({ tab: value })}
      />
    </Container>
  );
}

export default Event;
