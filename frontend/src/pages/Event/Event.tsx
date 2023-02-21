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
import { EventProps } from 'Props/Event';
import { snakeToCamelCase } from '../../utils/camel';
import FilterBar from '../../components/FilterBar/FilterBar';
import Calendar from '../../components/Calendar/Calendar';
import Formular from '../../components/Formular/Formular'



/**
 * Function used to filter a single event depending on the state of the filterbar
 * @returns event if it matches the filter, null if not
 */
const filterFunction=(event:EventProps, filter: Map<string, any>) => {

  // filter for favorite events
  if((filter.get('favorite')===true && event.isFavorite!==true)||
  (filter.get('participate')===true && event.isParticipating!==true)||
  (filter.get('shotgun')===true && event.maxParticipant===null)){
    return null;
  }

  // filter for date
  if(filter.get('dateBegin')!==null && filter.get('dateEnd')===null){
    if (filter.get('dateBegin').isAfter(event.endDate)){
      return null;
    }
  }

  if(filter.get('dateBegin')===null && filter.get('dateEnd')!==null){
    if (filter.get('dateEnd').isBefore(event.beginDate)){
      return null;
    }
  }

  if(filter.get('dateBegin')!==null && filter.get('dateEnd')!==null){
    if (filter.get('dateBegin').isAfter(event.endDate) || filter.get('dateEnd').isBefore(event.beginDate)){
      return null;
    }
  }

  // filter for organiser
 
  return event;
  
}

/**
 * Function used to filter all the events
 * @param events all events from the database
 * @param filter filter chosen by the user in the filterbar
 * @returns events filtered if there is a filter, all events if not
 */
const filterEvent=(events: Array<EventProps>, filter: Map<string, any>) => {
  if (filter !== undefined){
    return(events.filter((event) => filterFunction(event, filter)))
  }

  return events;
}

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

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
function Event() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [filter, setFilter] = React.useState<Map<string,any>>();

  const getFilter = (validateFilter) => {
    setFilter(validateFilter);
  }
 console.log(filterEvent(events, filter));

  React.useEffect(() => {
    axios.get('/api/event').then((res: any) => {
      
      res.data.forEach((event) => 
      { 
        // delete when date update to beginDate
        event.begin_date = event.date;

        // delete when endDate defined forEach event
        if (event.end_date === null) {
          event.end_date = new Date(new Date(event.date).getTime() + 3600000);
        }

        snakeToCamelCase(event, { beginDate: 'Date', endDate: 'Date' });
      });
      setEvents(res.data);
    });
  }, []);

  return (
    <>
      <h1>Évènements</h1>
      <p>Ceci est la page des events</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Formular />
        <FilterBar getFilter={getFilter}/>
      </div> 
      <EventView events={events}/>
    </>
  );
}

export default Event;
