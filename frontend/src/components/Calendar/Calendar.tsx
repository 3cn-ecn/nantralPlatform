import React from 'react';
import { Box, Button } from '@mui/material';
import './Calendar.scss';

function EventBlock(props: { day: number; event: any }) {
  const { day, event } = props;
  // console.log(event, event.size, day);
  const beginDate = new Date(event.date);
  // Modifier quand date de fin dispo
  const endDate = new Date(event.endDate);
  // const endDate = new Date('June 10, 2023 19:10:34');
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
  // console.log(typeof(event.size));
  console.log(`l'event ${event.title} a une taille de ${120 / event.size}px`);
  return (
    <Button
      variant="contained"
      style={{
        position: 'absolute',
        width: `${120 / event.size}px`,
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
        <EventBlock key={event.slug} day={dayValue} event={event} />
      ))}
    </div>
  );
}

function getEventWithDate(events: Array<any>, beginDate: Date, endDate: Date) {
  const sortEvents = new Array<any>();
  let eventDate;
  let eventSorted;
  // console.log(events);
  events.forEach((event) => {
    // console.log(event);
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
          // console.log(event.date);
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
    //         sortEvents.push(event);
    //       }
    //     }
    //   }
    // }
  });
  return sortEvents;
}

function sameTime(event, event2Compare) {
  // console.log(event);
  if (
    (event.beginDate < event2Compare.beginDate &&
      event2Compare.beginDate < event.endDate) ||
    (event.beginDate < event2Compare.endDate &&
      event2Compare.beginDate < event.endDate) ||
    (event2Compare.beginDate < event.beginDate &&
      event.beginDate < event2Compare.endDate) ||
    (event2Compare.beginDate < event.endDate &&
      event.beginDate < event2Compare.endDate)
  ) {
    return true;
  }

  // const endDate = new Date('June 10, 2023 19:10:34');
  // if (
  //   event.beginDate < event2Compare.beginDate < endDate ||
  //   event.beginDate < endDate < endDate ||
  //   event2Compare.beginDate < event.beginDate < endDate ||
  //   event2Compare.beginDate < endDate < endDate
  // ) {
  //   return true;
  // }

  return false;
}

function allSameTime(key, eventsList, eventsData) {
  let areSameTime = true;
  let iterator = 0;
  while (areSameTime && iterator < eventsList.length) {
    // console.log(key);
    areSameTime = sameTime(eventsData[key], eventsData[eventsList[iterator]]);
    iterator += 1;
  }
  return areSameTime;
}

function isInArray(ar1, ar2) {
  let same = true;
  let iterator = 0;
  console.log(ar1, ar2);
  while (same && iterator < ar1.length) {
    same = ar2.includes(ar1[iterator]);
    iterator += 1;
  }
  return same;
}

function setSameTimeEvents(events: Array<any>) {
  const eventsData = new Array<any>();
  for (let i = 0; i < events.length; i++) {
    eventsData.push({
      key: i,
      beginDate: new Date(events[i].date),
      endDate: new Date(events[i].endDate),
      // endDate: new Date('June 10, 2023 19:10:34'),
      blocked: false,
      size: 1,
      sameTimeEvent: [],
      coupleEvents: [],
    });
  }

  for (let i = 0; i < events.length; i++) {
    eventsData.forEach((eventData) => {
      if (sameTime(eventsData[i], eventData)) {
        console.log(
          `J'ajoute l'event ${eventData.key} à l'event ${eventsData[i].key}`
        );
        eventsData[i].sameTimeEvent.push(eventData.key);
      }
    });
  }

  console.log('Affichage des eventsData', eventsData);

  // Parcours des events
  let eventData;
  let coupleEventsLength;
  for (let i = 0; i < eventsData.length; i++) {
    console.log(` L'event en cours est le ${i}`);
    eventData = eventsData[i];

    // Parcours des events en meme temps (foreach nan ?)
    for (let j = 0; j < eventData.sameTimeEvent.length; j++) {
      // parcours des couples d'events
      coupleEventsLength = eventData.coupleEvents.length;
      for (let k = 0; k < coupleEventsLength; k++) {
        if (allSameTime(j, eventData.coupleEvents[k], eventsData)) {
          eventData.coupleEvents.push(
            eventData.coupleEvents[k].concat([eventData.sameTimeEvent[j]])
          );
        }
      }
      eventData.coupleEvents.push([eventData.sameTimeEvent[j]]);
    }
    console.log("ses couples d'event sont ", eventData.coupleEvents);
  }

  const currentSizeObject = {
    maxSize: 0,
    blockedChains: [],
  };
  let previousMaxSize;
  const blockedEventsChain = [];
  for (let i = 0; i < events.length; i++) {
    currentSizeObject.maxSize = 0;
    for (
      let eventList = 0;
      eventList < eventsData[i].coupleEvents.length;
      eventList++
    ) {
      currentSizeObject.maxSize = Math.max(
        eventsData[i].coupleEvents[eventList].length,
        currentSizeObject.maxSize
      );
      if (currentSizeObject.maxSize !== previousMaxSize) {
        currentSizeObject.blockedChains = [];
        previousMaxSize = currentSizeObject.maxSize;
      }
      if (
        eventsData[i].coupleEvents[eventList].length ===
        currentSizeObject.maxSize
      ) {
        currentSizeObject.blockedChains.push(
          eventsData[i].coupleEvents[eventList]
        );
      }
    }
    currentSizeObject.blockedChains.forEach((chain) => {
      console.log(blockedEventsChain);
      let j = 0;
      console.log('je commence mon test entre ', blockedEventsChain, chain);
      while (
        j < blockedEventsChain.length &&
        !isInArray(chain, blockedEventsChain[j])
      ) {
        j += 1;
      }
      if (j >= blockedEventsChain.length) {
        console.log(chain);
        blockedEventsChain.push(chain);
      }
    });
    console.log(`Les events blockants sont`, blockedEventsChain);
    events[i].size = currentSizeObject.maxSize;
    console.log(
      `La taille max des couples de l'event ${i} est de ${currentSizeObject.maxSize}`
    );
  }
}

function sortInWeek(oldSortEvents: Array<any>) {
  // Ajustement taille
  for (let i = 0; i < oldSortEvents.length; i++) {
    console.log('Affichage des events avant ajustement taille ', oldSortEvents);
    setSameTimeEvents(oldSortEvents);
  }

  const sortEvents = new Array<any>();
  for (let i = 0; i < 7; i++) {
    sortEvents.push(new Array<any>());
  }
  let eventDate;
  oldSortEvents.forEach((event) => {
    eventDate = new Date(event.date);
    // event.size = 1;
    sortEvents[eventDate.getDay() - 1].push(event);
  });

  console.log(sortEvents);
  return sortEvents;
}

function Calendar(props: { events: any }) {
  // console.log([1, 2, 3].includes(2));
  // console.log([1, 4, 3].includes(2));
  // console.log([[5], [4], [3]].includes(5));
  // console.log([[5], [4], [3]].includes([5]));

  const { events } = props;
  let sortEvents = getEventWithDate(
    events,
    new Date('June 07, 2023 03:24:00'),
    new Date('June 13, 2023 03:24:00')
  );

  console.log('endDate à virer');
  // sortEvents.forEach((event) => {
  //   event.endDate = 'June 10, 2023 19:10:34';
  // });

  sortEvents[2].endDate = 'June 10, 2023 19:10:34';
  sortEvents[1].endDate = 'June 10, 2023 18:50:34';
  sortEvents[3].endDate = 'June 10, 2023 23:10:34';
  sortEvents[0].endDate = 'June 10, 2023 15:30:34';
  //

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
