/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Button, Tab } from '@mui/material';
import { CalendarPicker, TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';

import {
  CalendarMonth,
  CalendarToday,
  CalendarViewDay,
} from '@mui/icons-material';
import { EventProps } from 'pages/Props/Event';
import { getEventApi } from '../../api';
import Calendar from './Calendar/Calendar';
import { formatDate } from '../../utils/date';
import FilterBar from './FilterBar/FilterBar';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */

function EventList(props: { events: any }) {
  const { events } = props;
  // console.log(events);
  // console.log(getEventApi);

  // React.useEffect(() => {
  //   axios.get('../api/event').then((eventsData) => {
  //     setEvents(eventsData.data);
  //     // console.log(events[0].date);
  //     console.log(eventsData.data[0].date);
  //     const a = new Date(eventsData.data[0].date);
  //     console.log(a);
  //     console.log(a.getDay());
  //     console.log(a.getDate());
  //     console.log(a.getMonth());
  //     console.log(a.getFullYear());
  //   });
  // }, []);
  axios.get('api/event').then((value) => {
    console.log(value);
    console.log("c'est bon");
  });

  return <p>Ceci est une liste.</p>;
}

function EventCalendar(props: { events: any }) {
  const { events } = props;
  // console.log(events);
  return (
    <>
      <p>Ceci est un calendrier.</p>
      <CalendarMonth></CalendarMonth>
      <Calendar events={events}></Calendar>
    </>
  );
}

function EventView(props: { events: any }) {
  const { events } = props;
  // console.log(events);
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
      <TabPanel value="1">
        <EventList events={events}></EventList>
      </TabPanel>
      <TabPanel value="2">
        <EventCalendar events={events}></EventCalendar>
        <CalendarMonth></CalendarMonth>
        <CalendarPicker></CalendarPicker>
        <CalendarViewDay></CalendarViewDay>
        <CalendarToday></CalendarToday>
      </TabPanel>
    </TabContext>
  );
}

function Event() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);

  React.useEffect(() => {
    axios.get(getEventApi).then((eventsData) => {
      setEvents(eventsData.data);
      // console.log(events[0].date);
      // console.log(eventsData.data[0].date);
      // const a = new Date(eventsData.data[0].date);
      // console.log(a);
      // console.log(a.getDay());
      // console.log(a.getDate());
      // console.log(a.getMonth());
      // console.log(a.getFullYear());
    });
  }, []);

  return (
    <>
      <h1>Évènements</h1>
      <p>Ceci est la page des events</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FilterBar />
      </div>
      <EventView events={events} />
    </>
  );
}

export default Event;
