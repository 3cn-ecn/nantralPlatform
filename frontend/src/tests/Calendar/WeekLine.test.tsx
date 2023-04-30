import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { WeekLine } from '#components/Calendar/Month/WeekLine/WeekLine';
import { EventProps } from '#types/Event';
import { wrapAndRender } from '#utils/tests';

import { createTestEvent } from './testElements/testElements';

// Create some weeks
const week: Array<{ day: number; date: number; events: Array<EventProps> }> =
  [];
const noBeginWeek: Array<{
  day: number;
  date: number;
  events: Array<EventProps>;
}> = [];
const noEndWeek: Array<{
  day: number;
  date: number;
  events: Array<EventProps>;
}> = [];
const emptyWeek: Array<{
  day: number;
  date: number;
  events: Array<EventProps>;
}> = [];

for (let i = 1; i <= 7; i++) {
  week.push({ day: i, date: i + 9, events: [] });
  if (i > 4) {
    noBeginWeek.push({ day: i, date: i - 4, events: [] });
  } else {
    noEndWeek.push({ day: i, date: i + 26, events: [] });
  }
  emptyWeek.push({ day: i, date: i + 9, events: [] });
}

// Add events
week[1].events.push(createTestEvent('The slug', 'The test event'));
week[3].events.push(createTestEvent('The slug1', 'The test event1'));
week[3].events.push(createTestEvent('The slug2', 'The test event2'));
week[3].events.push(createTestEvent('The slug3', 'The test event3'));
noBeginWeek[1].events.push(createTestEvent('The slug4', 'The test event4')); // It's day 6
noEndWeek[1].events.push(createTestEvent('The slug5', 'The test event5'));
noEndWeek[3].events.push(createTestEvent('The slug6', 'The test event6'));

describe('<WeekLine />', () => {
  it('should display a WeekLine with few events', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <WeekLine key="WeekLineTest" week={week} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
  it('should display a WeekLine withoutbegin', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <WeekLine key="WeekLineTest" week={noBeginWeek} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
  it('should display a WeekLine without end', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <WeekLine key="WeekLineTest" week={noEndWeek} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
  it('should display an empty WeekLine', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <WeekLine key="WeekLineTest" week={emptyWeek} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
});
