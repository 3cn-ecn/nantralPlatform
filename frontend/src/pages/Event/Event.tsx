import React, { useState } from 'react';
import { Box, Tab, Button, Container } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';
import { FilterInterface } from 'Props/Filter';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import ModalEditEvent from '../../components/FormularEvent/CreateEvent';
import { LoadStatus } from '../../Props/GenericTypes';

function EventList(props: { status: LoadStatus; events: any }) {
  const { events, status } = props;
  return (
    <>
      <div style={{ height: 30 }}></div>
      <EventSection status={status} events={events}></EventSection>
    </>
  );
}

function EventCalendar(props: { events: any }) {
  const { events } = props;
  return <Calendar events={events}></Calendar>;
}

function EventView(props: { filter: any }) {
  const { filter } = props;
  const [value, setValue] = React.useState('1');
  const [status, setStatus] = React.useState<LoadStatus>('load');
  const [eventsList, setEventsList] = React.useState<Array<EventProps>>([]);
  const [eventsCalendar, setEventsCalendar] = React.useState<Array<EventProps>>(
    []
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const today = new Date();

  // Request to get Events to display, depending of the filter.
  // If no date filter, only current and futur events are displayed.
  React.useEffect(() => {
    if (filter !== null) {
      // filtered calendar
      axios
        .get('/api/event/', {
          params: {
            is_shotgun: filter.shotgun,
            is_favorite: filter.favorite,
            is_participating: filter.participate,
            group: filter.organiser,
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data);
          setEventsCalendar(res.data);
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
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data);
            setEventsList(res.data);
            setStatus('success');
          })
          .catch(() => {
            setStatus('fail');
          });
      } else {
        // filtered list with date filters
        axios
          .get('/api/event', {
            params: {
              is_shotgun: filter.shotgun,
              is_favorite: filter.favorite,
              is_participating: filter.participate,
              from_date: filter.dateBegin,
              to_date: filter.dateEnd,
              group: filter.organiser,
            },
          })
          .then((res: any) => {
            eventsToCamelCase(res.data);
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
        .get('/api/event', {
          params: {
            from_date: today,
          },
        })
        .then((res: any) => {
          eventsToCamelCase(res.data);
          setEventsList(res.data);
          setStatus('success');
        })
        .catch(() => {
          setStatus('fail');
        });

      // non filtered calendar
      axios
        .get('/api/event')
        .then((res: any) => {
          eventsToCamelCase(res.data);
          setEventsCalendar(res.data);
          setStatus('success');
        })
        .catch(() => {
          setStatus('fail');
        });
    }
  }, [filter]);

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Liste" value="1" />
          <Tab label="Calendrier" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ padding: 0 }}>
        <EventList status={status} events={eventsList}></EventList>
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
  const [filter, setFilter] = React.useState<FilterInterface | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const getFilter = (validateFilter) => {
    setFilter(validateFilter);
  };

  return (
    <Container className="EventPage">
      <h1>Évènements</h1>
      <Box
        style={{
          display: 'flex',
          alignitems: 'center',
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
            saveEvent={(event: Event) => createEvent()}
            closeModal={() => setOpenAddModal(false)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FilterBar getFilter={getFilter} />
        </div>
      </Box>
      <EventView filter={filter} />
    </Container>
  );
}

export default Event;
