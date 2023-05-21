import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Month } from '#modules/event/view/Calendar/Month/Month';
import { wrapAndRender } from '#shared/utils/tests';
import { EventProps } from '#types/Event';

import { createTestEvent } from './testElements/testElements';

// Create the list of events in the month
const eventsInWeek: Array<Array<EventProps>> = [];
for (let i = 0; i < 30; i++) {
  eventsInWeek.push([]);
}
eventsInWeek[6].push(
  createTestEvent(
    'The slug1',
    'The test event1',
    new Date('2023-04-07T03:24:00'),
    new Date('2023-04-07T04:24:00')
  )
);
eventsInWeek[11].push(
  createTestEvent(
    'The slug2',
    'The test event2',
    new Date('2023-04-12T03:24:00'),
    new Date('2023-04-12T04:24:00')
  )
);
eventsInWeek[11].push(
  createTestEvent(
    'The slug3',
    'The test event3',
    new Date('2023-04-12T08:24:00'),
    new Date('2023-04-12T11:38:00')
  )
);
eventsInWeek[16].push(
  createTestEvent(
    'The slug4',
    'The test event4',
    new Date('2023-04-17T03:24:00'),
    new Date('2023-04-17T04:24:00')
  )
);
eventsInWeek[23].push(
  createTestEvent(
    'The slug5',
    'The test event5',
    new Date('2023-04-24T03:24:00'),
    new Date('2023-04-24T04:24:00')
  )
);
eventsInWeek[23].push(
  createTestEvent(
    'The slug6',
    'The test event6',
    new Date('2023-04-24T07:22:50'),
    new Date('2023-04-24T15:24:08')
  )
);
eventsInWeek[23].push(
  createTestEvent(
    'The slug7',
    'The test event7',
    new Date('2023-04-24T21:04:00'),
    new Date('2023-04-24T21:27:17')
  )
);

// Create the weeks in the month
const week = [
  ['Lundi', 1],
  ['Mardi', 2],
  ['Mercredi', 3],
  ['Jeudi', 4],
  ['Vendredi', 5],
  ['Samedi', 6],
  ['Dimanche', 7],
];
const monthWeeks = [];
monthWeeks.push(week.slice(2, 7));
monthWeeks.push();
monthWeeks.push();
monthWeeks.push();
monthWeeks.push(week.slice(0, 5));

describe('<Month />', () => {
  it('should display a Month', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <Month key="MonthTest" monthWeeks={monthWeeks} events={eventsInWeek} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
});
