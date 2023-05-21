import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { DayBlock } from '#shared/components/Calendar/Month/WeekLine/DayBlock/DayBlock';
import { wrapAndRender } from '#shared/utils/tests';
import { EventProps } from '#types/Event';

import { createTestEvent } from './testElements/testElements';

const events: Array<EventProps> = [];
events.push(
  createTestEvent(
    'The slug',
    'The test event',
    new Date('2023-02-17T03:24:00'),
    new Date('2023-02-17T04:24:00')
  )
);
events.push(
  createTestEvent(
    'The new slug',
    'Another test event',
    new Date('2023-02-17T08:24:00'),
    new Date('2023-02-17T10:24:00')
  )
);
const day = { day: 5, date: 17, events: events };

const otherEvents: Array<EventProps> = [];
otherEvents.push(
  createTestEvent(
    undefined,
    undefined,
    new Date('2023-02-17T03:24:00'),
    new Date('2023-02-17T04:24:00')
  )
);
const otherDay = { day: 5, date: 17, events: otherEvents };

const newOtherDay = { day: 5, date: 17, events: [] };
describe('<DayBlock />', () => {
  it('should display a DayBlock', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <DayBlock
          key="DayBlockTest1"
          day={day}
          maxEventsInDayWeek={2}
          inMonth
        />
      </BrowserRouter>
    );
    let innerHTMLString = '17';

    day.events.forEach((event) => {
      expect(
        component.getByTestId(`${event.slug}DateBoxButtonTestId`).style.height
      ).toBe('3rem');
      expect(
        component.getByTestId(`${event.slug}DateBoxButtonTestId`).textContent
      ).toBe(event.title);
      innerHTMLString += event.title;
    });
    expect(component.getByTestId('DateBoxTestId').textContent).toBe(
      innerHTMLString
    );

    expect(component).toMatchSnapshot();
  });

  it('should display an unfullfilled DayBlock', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <DayBlock
          key="DayBlockTest1"
          day={otherDay}
          maxEventsInDayWeek={3}
          inMonth
        />
      </BrowserRouter>
    );
    let innerHTMLString = '17';

    otherDay.events.forEach((event) => {
      expect(
        component.getByTestId(`${event.slug}DateBoxButtonTestId`).style.height
      ).toBe('3rem');
      expect(
        component.getByTestId(`${event.slug}DateBoxButtonTestId`).textContent
      ).toBe(event.title);
      innerHTMLString += event.title;
    });
    expect(component.getByTestId('DateBoxTestId').textContent).toBe(
      innerHTMLString
    );

    expect(component).toMatchSnapshot();
  });

  it('should display an empty DayBlock', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <DayBlock
          key="DayBlockTest1"
          day={newOtherDay}
          maxEventsInDayWeek={5}
          inMonth
        />
      </BrowserRouter>
    );
    expect(component.getByTestId('DateBoxTestId').textContent).toBe('17');

    expect(component).toMatchSnapshot();
  });

  it('should display an out of month DayBlock', async () => {
    const component = wrapAndRender(
      <BrowserRouter>
        <DayBlock
          key="DayBlockTest4"
          day={null}
          maxEventsInDayWeek={1}
          inMonth={false}
        />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
});
