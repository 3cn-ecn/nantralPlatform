import React, { useState } from 'react';
import {
  Box,
  Tab,
  Button,
  Container,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import { FilterInterface } from 'Props/Filter';
import { useParams, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQueries, useQuery } from 'react-query';
import { Page } from 'Props/pagination';
import {
  AutoAwesomeMotion,
  Favorite,
  Sort,
  Today,
  Upcoming,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { EventProps } from '../../Props/Event';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import ModalEditEvent from '../../components/FormEvent/FormEvent';
import { LoadStatus } from '../../Props/GenericTypes';
import { getEvents } from '../../api/event';
import { GroupProps, SimpleGroupProps } from '../../Props/Group';
import { getGroup } from '../../api/group';
import Avatar from '../../components/Avatar/Avatar';

const EVENT_PER_PAGE = 6;

function EventList(props: {
  status: LoadStatus;
  events: Page<EventProps>[];
  onChangePage: (page: number) => void;
  onChangeOrder: (newOrder: string) => void;
  order: string;
  page: number;
  onChangeFilter: (change) => void;
  filter: FilterInterface;
  fetchingNextPage: boolean;
}) {
  const {
    events,
    status,
    onChangePage,
    page,
    onChangeFilter,
    onChangeOrder,
    order,
    filter,
    fetchingNextPage,
  } = props;
  const { t, i18n } = useTranslation('translation');
  const [orderOpen, setOrderOpen] = React.useState<boolean>(false);
  const anchorEl = React.useRef();
  const handleNextPage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onChangePage(newPage);
  };
  function loadMore() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      handleNextPage(null, page + 1);
    }
  }
  React.useEffect(() => {
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  });

  const today = new Date();
  const oneWeek = new Date();
  oneWeek.setDate(today.getDate() + 7);
  const chips = [
    {
      label: t('home.all'),
      icon: <AutoAwesomeMotion />,
      onClick: () => {
        onChangeFilter({ dateBegin: undefined, dateEnd: undefined });
        onChangeOrder('-start_date');
      },
    },
    {
      label: t('home.thisWeek'),
      icon: <Today />,
      onClick: () => {
        onChangeFilter({
          dateBegin: today.toISOString(),
          dateEnd: oneWeek.toISOString(),
        });
        onChangeOrder('-start_date');
      },
    },
    {
      label: t('home.upcomingEvents'),
      icon: <Upcoming />,
      onClick: () => {
        onChangeFilter({
          dateEnd: undefined,
          dateBegin: oneWeek.toISOString(),
        });
        onChangeOrder('start_date');
      },
    },
    {
      label: t('filterbar.favorite'),
      icon: <Favorite />,
      onClick: () => {
        onChangeFilter({
          favorite: true,
        });
        onChangeOrder('-start_date');
      },
    },
  ];
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
            display: 'inline-flex',
            gap: 1,
            overflow: 'hidden',
            flexDirection: 'column',
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
                label={`${t('filterbar.from')} : ${new Date(
                  filter.dateBegin
                ).toLocaleDateString(i18n.language, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}`}
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
                label={`${t('filterbar.to')} : ${new Date(
                  filter.dateEnd
                ).toLocaleDateString(i18n.language, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}`}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    dateEnd: undefined,
                  })
                }
              />
            )}
            {filter.participate && (
              <Chip
                label={t('filterbar.participating')}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    participate: undefined,
                  })
                }
              />
            )}
            {filter.favorite && (
              <Chip
                label={t('filterbar.favorite')}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    favorite: undefined,
                  })
                }
              />
            )}
            {filter.shotgun && (
              <Chip
                label={t('filterbar.shotgun')}
                variant="outlined"
                onDelete={() =>
                  onChangeFilter({
                    ...filter,
                    shotgun: undefined,
                  })
                }
              />
            )}
            {filter?.organiser &&
              filter?.organiser.map((group: SimpleGroupProps) => (
                <Chip
                  label={group.name}
                  variant="outlined"
                  onDelete={() => {
                    let tmp = filter.organiser;
                    tmp = tmp.filter((item) => group.id !== item.id);
                    onChangeFilter({
                      ...filter,
                      organiser: tmp,
                    });
                  }}
                  icon={
                    <Avatar url={group.icon} size="small" title={group.name} />
                  }
                  key={group.id}
                />
              ))}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton ref={anchorEl} onClick={() => setOrderOpen(!orderOpen)}>
            <Sort />
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl.current}
            open={orderOpen}
            onClose={() => setOrderOpen(false)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem color="primary" onClick={() => setOrderOpen(false)}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => setOrderOpen(false)}>My account</MenuItem>
            <MenuItem onClick={() => setOrderOpen(false)}>Logout</MenuItem>
          </Menu>
          {events?.length > 0 && (
            <Typography align="right" variant="subtitle2">
              {events[0].count} results
            </Typography>
          )}
        </Box>
      </Box>
      {events?.length > 0 &&
        events?.map((eventPage) => (
          <EventSection
            status={status}
            events={eventPage?.results}
            loadingItemCount={EVENT_PER_PAGE}
            key={eventPage.results[0]?.id || 'eventId'}
          />
        ))}
      {(fetchingNextPage || status === 'loading') && (
        <EventSection
          events={Array(0)}
          status="loading"
          loadingItemCount={EVENT_PER_PAGE}
        />
      )}
    </>
  );
}

function EventView(props: {
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
  } = useInfiniteQuery<Page<EventProps>>({
    queryKey: ['eventList', filter],
    queryFn: ({ pageParam = 1 }) =>
      getEvents({
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
  } = useQuery<Page<EventProps>>({
    queryKey: ['eventCalendar', filter, calendarRange],
    queryFn: () =>
      getEvents({
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
        <EventList
          order={order}
          onChangeOrder={setOrder}
          filter={filter}
          onChangeFilter={(newChanges) => onChangeFilter(newChanges)}
          status={eventsListStatus}
          events={eventsList?.pages}
          onChangePage={handleNextPage}
          page={currentPage}
          fetchingNextPage={isFetchingNextPage}
        ></EventList>
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

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
function Event() {
  const [queryParameters, setQueryParams] = useSearchParams();
  const [filter, setFilter] = React.useState<FilterInterface | null>({
    dateBegin: queryParameters.get('dateBegin')
      ? new Date(queryParameters.get('dateBegin'))
      : undefined,
    dateEnd: queryParameters.get('dateEnd')
      ? new Date(queryParameters.get('dateEnd'))
      : undefined,
    favorite: queryParameters.get('favorite') ? true : null,
    organiser: [],
    participate: queryParameters.get('participate') ? true : null,
    shotgun: queryParameters.get('shotgun') ? true : null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Get organisers
  React.useEffect(() => {
    const organisers = queryParameters.get('organiser');
    if (organisers)
      Promise.all(
        organisers?.split(',')?.map((slug) => getGroup(slug, { simple: true }))
      ).then((groups) => setFilter({ ...filter, organiser: groups }));
  }, []);

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
    updateParameters({
      ...validateFilter,
      organiser: validateFilter?.organiser
        ?.map((group) => group.slug)
        .join(','),
    });
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
            <FilterBar filter={filter} onChangeFilter={getFilter} />
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
