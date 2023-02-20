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
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */


const filterFunction=(event:EventProps, filter: Map<string, any>) => {
  // //logique d'union pour tous les filtres sauf date. Si le filtre est vide, affichage de tous les events.
  // const keepUnion = [];
  // if (filter.get('dateBegin')=== null && filter.get('dateEnd')=== null 
  // && filter.get('shotgun')=== false  && filter.get('participate')===false 
  // && filter.get('favorite')===false && filter.get('organiser')!==null){  
  //   return event;
  // }
  // if(filter.get('favorite')===true && event.isFavorite===true){
  //   keepUnion.push(true);
  // } else {
  //   keepUnion.push(false);
  // }
  // if(filter.get('participate')===true && event.isParticipating===true){
  //   keepUnion.push(true);
  // } else {
  //   keepUnion.push(false);
  // }
  // if (keepUnion.includes(true)){
  // return event} 
  // return null;

  // logique exclusive partout
  if(filter.get('favorite')===true && event.isFavorite!==true){
    return null;
  }
  
  if(filter.get('participate')===true && event.isParticipating!==true){
    return null;
  }

  if(filter.get('shotgun')===true && event.maxParticipant===null){
    return null;
  }
 
  return event;
  
}

const filterEvent=(events: Array<EventProps>, filter: Map<string, any>) => {
  if (events !== undefined && filter !== undefined){
    return(events.filter((event) => filterFunction(event, filter)))
  }

  return events;
}

function EventList(props: { events: any }) {
  const { events } = props;
  // console.log(events);

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
