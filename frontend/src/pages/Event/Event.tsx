import React from 'react';
import { Box, Button, Tab } from '@mui/material';
import { CalendarPicker, TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';
import axios from 'axios';
import { getEventApi } from 'api';
import {
  CalendarMonth,
  CalendarToday,
  CalendarViewDay,
} from '@mui/icons-material';
import Calendar from './Calendar';
import FilterBar from '../../components/FilterBar/FilterBar';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */

function EventList() {
  // React.useEffect(() => {
  //   const test = axios.get('api/event');
  //   console.log(test);
  // });

  axios.get('api/event').then((value) => {
    console.log(value);
    console.log("c'est bon");
  });

  return <p>Ceci est une liste.</p>;
}

function EventCalendar() {
  return (
    <>
      <p>Ceci est un calendrier.</p>
      <CalendarMonth></CalendarMonth>
      <Calendar></Calendar>
    </>
  );
}

function EventView() {
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
        <EventList></EventList>
      </TabPanel>
      <TabPanel value="2">
        <EventCalendar></EventCalendar>
        <CalendarMonth></CalendarMonth>
        <CalendarPicker></CalendarPicker>
        <CalendarViewDay></CalendarViewDay>
        <CalendarToday></CalendarToday>
      </TabPanel>
    </TabContext>
  );
}

function Event() {
  return (
    <>
      <h1>Évènements</h1>
      <p>Ceci est la page des events</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FilterBar />
      </div>
      <EventView />
    </>
  );
}

export default Event;
