/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';

import {
  CalendarMonth,
  CalendarToday,
  CalendarViewDay,
} from '@mui/icons-material';
import { EventBDDProps, EventProps } from 'Props/Event';
import { snakeIntoCamel } from '../../utils/camel';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import Formular from '../../components/Formular/Formular'

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */

function EventList(props: { events: any }) {
  const { events } = props;
  console.log(events);

  return <p>Ceci est une liste.</p>;
}

function EventCalendar(props: { events: any }) {
  const { events } = props;
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
        <CalendarViewDay></CalendarViewDay>
        <CalendarToday></CalendarToday>
      </TabPanel>
    </TabContext>
  );
}

function Event() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);

  React.useEffect(() => {
    axios.get('/api/event').then((res) => {
      // const eventsObject: Array<EventProps> = [];
      const eventsObject = [];
      
      // delete when endDate defined forEach event
      res.data.forEach((event: EventBDDProps) => 
      { 
        eventsObject.push(snakeIntoCamel(event, [{type2Convert: "Date", keys: ["date", "end_date"]}]));
        if (event.end_date === null) {
          eventsObject[eventsObject.length - 1].endDate = new Date(new Date(event.date).getTime() + 3600000);
        }
      });

      // delete when date update to beginDate
      eventsObject.forEach((event) => {
        event.beginDate = event.date;
      });
      setEvents(eventsObject);
    });
  }, []);

  return (
    <>
      <h1>Évènements</h1>
      <p>Ceci est la page des events</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Formular />
        <FilterBar />
      </div> 
      <EventView events={events} />
    </>
  );
}

export default Event;
