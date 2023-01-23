import React from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Event.scss';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */

function EventList() {
  return <p>Ceci est une liste.</p>;
}

function EventCalendar() {
  return <p>Ceci est un calendrier.</p>;
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
      </TabPanel>
    </TabContext>
  );
}

function Event() {
  return (
    <>
      <h1>Évènements</h1>
      <p>Ceci est la page des events</p>
      <EventView />
    </>
  );
}

export default Event;
