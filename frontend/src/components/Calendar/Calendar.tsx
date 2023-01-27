import React from 'react';
import { Box, Button } from '@mui/material';
import './Calendar.scss';

function EventBlock(props: { day: number; event: any }) {
  const { day, event } = props;
  const beginDate = new Date(event.date);
  // Modifier quand date de fin dispo
  const endDate = new Date('June 10, 2023 19:10:34');
  let todayBegin = false;
  let startTime = 24;
  if (
    beginDate.getDay() === day &&
    (beginDate.getHours() !== 0 ||
      beginDate.getMinutes() !== 0 ||
      beginDate.getSeconds() !== 0)
  ) {
    startTime =
      23 -
      beginDate.getHours() +
      (59 - beginDate.getMinutes()) / 60 +
      (60 - beginDate.getSeconds()) / 3600;
    todayBegin = true;
  }
  let duration;
  if (todayBegin) {
    duration = (endDate.getTime() - beginDate.getTime()) / 3600000;
  } else {
    duration =
      endDate.getHours() +
      endDate.getMinutes() / 60 +
      endDate.getSeconds() / 3600;
  }
  return (
    <Button
      variant="contained"
      style={{
        position: 'absolute',
        width: '120px',
        height: `${Math.min(duration, startTime) * 20}px`,
        transform: `translate(-60px, -${startTime * 20}px)`,
      }}
    >
      {event.title}
    </Button>
  );
}

function TimeBlock(props: { startTime: any }) {
  const { startTime } = props;

  if (startTime % 2 === 0) {
    return <Box className="TimeBlockEven"></Box>;
  }

  return <Box className="TimeBlockOdd"></Box>;
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

// function sortInDay(oldSortEvents: Array<any>) {
//   const sortEvents = new Array<any>();
//   for (let i = 0; i < 24; i++) {
//     sortEvents.push(new Array<any>());
//   }
//   let eventDate;
//   oldSortEvents.forEach((event) => {
//     eventDate = new Date(event.date);
//     sortEvents[eventDate.getHours()].push(event);
//     console.log(sortEvents);
//   });
//   return sortEvents;
// }

function Day(props: { dayValue: number; day: string; events: any }) {
  const { dayValue, day, events } = props;
  const dayChain = [];

  for (let hour = 0; hour < 24; hour++) {
    dayChain.push(<TimeBlock key={hour} startTime={hour}></TimeBlock>);
  }

  return (
    <div id={day} style={{ display: 'block' }}>
      {day}
      {dayChain}
      {events.map((event) => (
        <EventBlock key={event} day={dayValue} event={event} />
      ))}
    </div>
  );
}

function getEventWithDate(events: Array<any>, beginDate: Date, endDate: Date) {
  const sortEvents = new Array<any>();
  let eventDate;
  let eventSorted;
  events.forEach((event) => {
    eventSorted = false;
    eventDate = new Date(event.date);
    if (
      beginDate.getFullYear() <= eventDate.getFullYear() &&
      eventDate.getFullYear() <= endDate.getFullYear()
    ) {
      if (
        beginDate.getMonth() <= eventDate.getMonth() &&
        eventDate.getMonth() <= endDate.getMonth()
      ) {
        if (
          beginDate.getDate() <= eventDate.getDate() &&
          eventDate.getDate() <= endDate.getDate()
        ) {
          console.log(event.date);
          sortEvents.push(event);
        }
      }
    }

    // // Pour trier par rapport à la fin d'event quand elle existera
    // if (!eventSorted) {
    //   eventDate = new Date(event.endDate);
    //   if (
    //     beginDate.getFullYear() <= eventDate.getFullYear() &&
    //     eventDate.getFullYear() <= endDate.getFullYear()
    //   ) {
    //     if (
    //       beginDate.getMonth() <= eventDate.getMonth() &&
    //       eventDate.getMonth() <= endDate.getMonth()
    //     ) {
    //       if (
    //         beginDate.getDate() <= eventDate.getDate() &&
    //         eventDate.getDate() <= endDate.getDate()
    //       ) {
    //         console.log(event.date);
    //         sortEvents.push(event);
    //       }
    //     }
    //   }
    // }
  });
  return sortEvents;
}

function sortInWeek(oldSortEvents: Array<any>) {
  const sortEvents = new Array<any>();
  for (let i = 0; i < 7; i++) {
    sortEvents.push(new Array<any>());
  }
  let eventDate;
  oldSortEvents.forEach((event) => {
    eventDate = new Date(event.date);
    sortEvents[eventDate.getDay() - 1].push(event);
  });
  return sortEvents;
}

function Calendar(props: { events: any }) {
  const { events } = props;
  let sortEvents = getEventWithDate(
    events,
    new Date('June 07, 2023 03:24:00'),
    new Date('June 13, 2023 03:24:00')
  );
  sortEvents = sortInWeek(sortEvents);
  return (
    <>
      <p>Le calendrier</p>
      <div id="Calendar" style={{ display: 'flex' }}>
        <DayInfos />
        {[
          'Lundi',
          'Mardi',
          'Mercredi',
          'Jeudi',
          'Vendredi',
          'Samedi',
          'Dimanche',
        ].map((day, number) => {
          return (
            <Day
              key={day}
              dayValue={number + 1}
              day={day}
              events={sortEvents[number]}
            />
          );
        })}
      </div>
    </>
  );
}

export default Calendar;
