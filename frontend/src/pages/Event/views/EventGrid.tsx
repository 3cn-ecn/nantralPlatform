import React from 'react';

import {
  AutoAwesomeMotion,
  Favorite,
  Sort,
  Today,
  Upcoming,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { EventSection } from '#pages/Home/views/section/EventSection';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';
import { EventProps } from '#types/Event';
import { FilterInterface } from '#types/Filter';
import { ListResults, LoadStatus } from '#types/GenericTypes';
import { Page, SimpleGroupProps } from '#types/Group';

interface EventGridProps {
  status: LoadStatus;
  events: ListResults<EventProps>;
  onChangePage: (page: number) => void;
  page: number;
  eventsPerPage: number;
}
const EVENT_PER_PAGE = 6;

export default function EventGrid(props: {
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
  const { t, formatDate } = useTranslation();
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
                label={`${t('filterbar.from')} : ${formatDate(
                  new Date(filter.dateBegin),
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  }
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
                label={`${t('filterbar.to')} : ${formatDate(
                  new Date(filter.dateEnd),
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  }
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
                  icon={<Avatar url={group.icon} size="s" title={group.name} />}
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
