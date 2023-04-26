import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';

import { EventProps } from '../../Props/Event';
import { Day, sortWithPos } from '../../components/Calendar/Day/Day';
import { createTestEvent } from './testElements/testElements';

// Create some events
const events: Array<EventProps> = [];
events.push(
  createTestEvent(
    'The slug1',
    'The test event1',
    new Date('2023-02-11T19:00:00'),
    new Date('2023-02-10T10:22:00'),
    'This is an event to test',
    2,
    6,
    0
  )
);
events.push(
  createTestEvent(
    'The slug2',
    'The test event2',
    new Date('2023-02-10T02:00:00'),
    new Date('2023-02-10T11:38:00'),
    'This is an event to test',
    2,
    6,
    2
  )
);
events.push(
  createTestEvent(
    'The slug3',
    'The test event3',
    new Date('2023-02-10T00:00:00'),
    new Date('2023-02-10T14:54:00'),
    'This is an event to test',
    2,
    6,
    4
  )
);
events.push(
  createTestEvent(
    'The slug4',
    'The test event4',
    new Date('2023-02-10T13:21:00'),
    new Date('2023-02-11T06:56:00'),
    'This is an event to test',
    3,
    6,
    0
  )
);
events.push(
  createTestEvent(
    'The slug5',
    'The test event5',
    new Date('2023-02-10T16:57:00'),
    new Date('2023-02-10T17:22:00'),
    'This is an event to test',
    3,
    6,
    3
  )
);
describe('<Day />', () => {
  it('should display a Day', async () => {
    const component = render(
      <BrowserRouter>
        <Day
          day={new Date('2023-02-10T13:21:00')}
          events={events}
          chains={[
            [0, 1, 2],
            [2, -1, 3],
            [3, 4],
          ]}
        />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });

  test('sortWithPos should throw an error', async () => {
    expect(() => sortWithPos([2, 3], events)).toThrow(`Event chain is wrong`);
  });
});
