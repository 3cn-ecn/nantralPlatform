import React from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import './Calendar.scss';

function TimeBlock(props: { startTime: any }) {
  const { startTime } = props;
  if (startTime % 2 === 0) {
    return (
      <Box
        className="TimeBlockEven"
        // style={{ width: '120px', height: '40px', border: '1px solid gray' }}
      >
        {/* {startTime} */}
        {/* <div id="trait_dessus"></div> */}
      </Box>
    );
  }

  return (
    <Box
      className="TimeBlockOdd"
      // style={{ width: '120px', height: '40px', border: '1px solid gray' }}
    >
      {/* {startTime} */}
      {/* <div id="trait_dessus"></div> */}
    </Box>
  );
}

function DayInfos() {
  return (
    <div style={{ display: 'block' }}>
      <p>0</p>
      <p>2</p>
      <p>4</p>
      <p>6</p>
      <p>8</p>
      <p>10</p>
      <p>12</p>
      <p>14</p>
      <p>16</p>
      <p>18</p>
      <p>20</p>
      <p>22</p>
    </div>
  );
}

function sortInDay(oldSortEvents: Array<any>) {
  // const sortEvents = new Array(7).fill(Array<any>());
  const sortEvents = new Array<any>();
  for (let i = 0; i < 24; i++) {
    sortEvents.push(new Array<any>());
  }
  let eventDate;
  console.log(sortEvents);
  oldSortEvents.forEach((event) => {
    eventDate = new Date(event.date);
    console.log(eventDate.getHour());
    console.log(sortEvents[0]);
    sortEvents[eventDate.getHour()].push(event);
    console.log(sortEvents);
  });
  return sortEvents;
}

function Day(props: { day: string; events: any }) {
  const { day, events } = props;
  let dayChain;
  for (let hour = 0; hour < 24; hour++) {
    dayChain += <TimeBlock startTime={0}></TimeBlock>;
  }
  return (
    <div style={{ display: 'block' }}>
      {day}
      {dayChain}
      {/* <TimeBlock startTime={0}></TimeBlock>
      <TimeBlock startTime={1}></TimeBlock>
      <TimeBlock startTime={2}></TimeBlock>
      <TimeBlock startTime={3}></TimeBlock>
      <TimeBlock startTime={4}></TimeBlock>
      <TimeBlock startTime={5}></TimeBlock>
      <TimeBlock startTime={6}></TimeBlock>
      <TimeBlock startTime={7}></TimeBlock>
      <TimeBlock startTime={8}></TimeBlock>
      <TimeBlock startTime={9}></TimeBlock>
      <TimeBlock startTime={10}></TimeBlock>
      <TimeBlock startTime={11}></TimeBlock>
      <TimeBlock startTime={12}></TimeBlock>
      <TimeBlock startTime={13}></TimeBlock>
      <TimeBlock startTime={14}></TimeBlock>
      <TimeBlock startTime={15}></TimeBlock>
      <TimeBlock startTime={16}></TimeBlock>
      <TimeBlock startTime={17}></TimeBlock>
      <TimeBlock startTime={18}></TimeBlock>
      <TimeBlock startTime={19}></TimeBlock>
      <TimeBlock startTime={20}></TimeBlock>
      <TimeBlock startTime={21}></TimeBlock>
      <TimeBlock startTime={22}></TimeBlock>
      <TimeBlock startTime={23}></TimeBlock> */}
    </div>
  );
}

function getEventWithDate(events: Array<any>, beginDate: Date, endDate: Date) {
  const sortEvents = new Array<any>();
  // console.log(events);
  let eventDate;
  events.forEach((event) => {
    eventDate = new Date(event.date);
    console.log(beginDate.getDate());
    console.log(eventDate.getDate());
    console.log(endDate.getDate());
    if (
      beginDate.getFullYear() <= eventDate.getFullYear() &&
      eventDate.getFullYear() <= endDate.getFullYear()
    ) {
      console.log('year');
      if (
        beginDate.getMonth() <= eventDate.getMonth() &&
        eventDate.getMonth() <= endDate.getMonth()
      ) {
        console.log('month');
        if (
          beginDate.getDate() <= eventDate.getDate() &&
          eventDate.getDate() <= endDate.getDate()
        ) {
          console.log('day');
          sortEvents.push(event);
        }
      }
    }
  });
  return sortEvents;
}

function sortInWeek(oldSortEvents: Array<any>) {
  // const sortEvents = new Array(7).fill(Array<any>());
  const sortEvents = new Array<any>();
  for (let i = 0; i < 7; i++) {
    sortEvents.push(new Array<any>());
  }
  let eventDate;
  console.log(sortEvents);
  oldSortEvents.forEach((event) => {
    eventDate = new Date(event.date);
    console.log(eventDate.getDay());
    console.log(sortEvents[0]);
    sortEvents[eventDate.getDay() - 1].push(event);
    console.log(sortEvents);
  });
  return sortEvents;
}

function Calendar(props: { events: any }) {
  const { events } = props;
  // console.log(events);
  let sortEvents = getEventWithDate(
    events,
    new Date('June 07, 2023 03:24:00'),
    new Date('June 13, 2023 03:24:00')
  );
  sortEvents = sortInWeek(sortEvents);
  console.log(sortEvents);
  return (
    <>
      {/* <h1>Évènements</h1> */}
      <p>Le calendrier</p>
      <div id="Calendar" style={{ display: 'flex' }}>
        <DayInfos />
        <Day day="Lundi" events={sortEvents[0]} />
        <Day day="Mardi" events={sortEvents[1]} />
        <Day day="Mercredi" events={sortEvents[2]} />
        <Day day="Jeudi" events={sortEvents[3]} />
        <Day day="Vendredi" events={sortEvents[4]} />
        <Day day="Samedi" events={sortEvents[5]} />
        <Day day="Dimanche" events={sortEvents[6]} />
      </div>
    </>
  );
}

export default Calendar;
