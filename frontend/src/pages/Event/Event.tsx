import React, { useState, useEffect } from 'react';
import { Box, Tab, Button, Container } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import Formular from '../../components/Formular/Formular';
import ModalEditEvent from '../../legacy/event/eventsView/CreateEvent';
import { LoadStatus } from '../../Props/GenericTypes';

/**
 * Function used to filter a single event depending on the state of the filterbar
 * @returns event if it matches the filter, null if not
 * @TODO move this function to backend
 */
const filterFunction = (event: EventProps, filter: Map<string, any>) => {
  // filter for checkboxes
  if (
    (filter.get('favorite') === true && event.isFavorite !== true) ||
    (filter.get('participate') === true && event.isParticipating !== true) ||
    (filter.get('shotgun') === true && event.maxParticipant === null)
  ) {
    return null;
  }

  // filter for date
  if (filter.get('dateBegin') !== null) {
    if (filter.get('dateBegin').isAfter(event.endDate)) {
      return null;
    }
  }

  if (filter.get('dateEnd') !== null) {
    if (filter.get('dateEnd').isBefore(event.beginDate)) {
      return null;
    }
  }

  // filter for organiser

  return event;
};

/**
 * Function used to filter all the events
 * @param events all events from the database
 * @param filter filter chosen by the user in the filterbar
 * @returns events filtered if there is a filter, all events if not
 * @todo move this function to backend
 */
const filterEvent = (events: Array<EventProps>, filter: Map<string, any>) => {
  if (filter !== undefined) {
    return events.filter((event) => filterFunction(event, filter));
  }

  return events;
};

function EventList(props: { status: LoadStatus; events: any }) {
  const { events, status } = props;
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <>
      <p>Ceci est une liste.</p>
      <Button variant="contained" onClick={() => setOpenAddModal(true)}>
        Ajouter
      </Button>
      <ModalEditEvent
        open={openAddModal}
        saveEvent={(event: Event) => createEvent()}
        closeModal={() => setOpenAddModal(false)}
      />
    </>
  );
  /*
  return(
    <EventSection status={status} events={events} title="Liste des prochains évènements"></EventSection>
  );
*/
}

function EventCalendar(props: { events: any }) {
  const { events } = props;
  return <Calendar events={events}></Calendar>;
}

function EventView(props: { status: LoadStatus; events: any }) {
  const { events, status } = props;
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
        <EventList status={status} events={events}></EventList>
      </TabPanel>
      <TabPanel value="2" sx={{ padding: 0 }}>
        <EventCalendar events={events}></EventCalendar>
      </TabPanel>
    </TabContext>
  );
}

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
function Event() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [filter, setFilter] = React.useState<Map<string, any>>();
  const [eventsLoadStatus, setStatus] = React.useState<LoadStatus>('load');
  const getFilter = (validateFilter) => {
    setFilter(validateFilter);
  };
  console.log(filterEvent(events, filter));

  React.useEffect(() => {
    axios
      .get('/api/event')
      .then((res: any) => {
        eventsToCamelCase(res.data);
        setEvents(res.data);
        setStatus('success');
      })
      .catch(() => {
        setStatus('fail');
      });
  }, []);

  return (
    <Container className="EventPage">
      <h1>Évènements</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Formular />
        <FilterBar getFilter={getFilter} />
      </div>
      <EventView status={eventsLoadStatus} events={events} />
    </Container>
  );
}

export default Event;
