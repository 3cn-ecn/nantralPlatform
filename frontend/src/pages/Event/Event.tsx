import React, { useState } from 'react';
import {
  Box,
  Tab,
  Button,
  Container,
  Pagination,
  Typography,
  Chip,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import { FilterInterface } from 'Props/Filter';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Page } from 'Props/pagination';
import { AutoAwesomeMotion, Today, Upcoming } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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
  onChangeFilter: (change) => void;
  filter;
}) {
  const { events, status, onChangePage, page, onChangeFilter, filter } = props;
  const { t, i18n } = useTranslation('translation');
  const handleNextPage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (page !== newPage) onChangePage(newPage);
  };
  const today = new Date();
  const oneWeek = new Date();
  oneWeek.setDate(today.getDate() + 7);
  const chips = [
    {
      label: 'All',
      icon: <AutoAwesomeMotion />,
      onClick: () =>
        onChangeFilter({ dateBegin: undefined, dateEnd: undefined }),
    },
    {
      label: 'This week',
      icon: <Today />,
      onClick: () =>
        onChangeFilter({
          dateBegin: today.toISOString(),
          dateEnd: oneWeek.toISOString(),
        }),
    },
    {
      label: 'Upcoming',
      icon: <Upcoming />,
      onClick: () =>
        onChangeFilter({
          dateEnd: undefined,
          dateBegin: oneWeek.toISOString(),
        }),
    },
  ];
  console.log(filter);
  return (
    <>
      <Box
        className="event-list-container"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          justifyContent: 'space-between',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          className="event-list-container"
          sx={{
            // justifyContent: 'space-between',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box columnGap={1} display="flex" overflow="scroll">
            {chips.map((chip, index: number) => (
              <Chip
                icon={chip.icon}
                label={chip.label}
                key={chip.label}
                variant="filled"
                onClick={chip.onClick}
              />
            ))}
          </Box>
          <Box columnGap={1} display="flex" overflow="scroll">
            {filter.dateBegin && (
              <Chip
                label={`from : ${new Date(filter.dateBegin).toLocaleDateString(
                  i18n.language,
                  { weekday: 'long', day: 'numeric', month: 'short' }
                )}`}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    dateBegin: undefined,
                  })
                }
              />
            )}
            {filter.dateEnd && (
              <Chip
                label={`to : ${new Date(filter.dateEnd).toLocaleDateString(
                  i18n.language,
                  { weekday: 'long', day: 'numeric', month: 'short' }
                )}`}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    dateEnd: undefined,
                  })
                }
              />
            )}
            {filter.shotgun && (
              <Chip
                label="Shotgun"
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    shotgun: undefined,
                  })
                }
              />
            )}
          </Box>
        </Box>
        <Typography align="right" variant="subtitle2">
          {events?.count ?? '--'} results
        </Typography>
      </Box>
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

  const { data: eventsList, status: eventsListStatus } = useQuery<
    Page<EventProps>
  >({
    queryKey: ['eventList', filter, currentPage],
    queryFn: () =>
      getEvents({
        limit: EVENT_PER_PAGE,
        offset: (currentPage - 1) * EVENT_PER_PAGE,
        orderBy: '-start_date',
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
        fromDate: filter.dateBegin,
        toDate: filter.dateEnd,
        group: filter.organiser,
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
        orderBy: '-start_date',
        isShotgun: filter.shotgun,
        isFavorite: filter.favorite,
        isParticipating: filter.participate,
        group: filter.organiser,
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
          filter={filter}
          onChangeFilter={(newChanges) => onChangeFilter(newChanges)}
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
    <>
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
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FilterBar filter={filter} getFilter={getFilter} />
          </div>
        </Box>
        <EventView
          onChangeFilter={(changes) => {
            getFilter(changes);
          }}
          filter={filter}
          initialPage={Number.parseInt(queryParameters.get('page'), 10) || 1}
          selectedTab={queryParameters.get('tab')}
          onChangeTab={(value) => updateParameters({ tab: value })}
          onChangePage={(page: number) => updateParameters({ page: page })}
        />
      </Container>
      <ModalEditEvent
        open={openAddModal}
        closeModal={() => setOpenAddModal(false)}
      />
    </>
  );
}

export default Event;
