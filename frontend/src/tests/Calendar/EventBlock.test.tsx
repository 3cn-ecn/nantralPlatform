import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { EventBlock } from '../../components/Calendar/Day/EventBlock/EventBlock';

const eventInDay: EventProps = createTestEvent(
  'The slug',
  'The test event',
  new Date('2023-02-17T03:24:00'),
  new Date('2023-02-17T04:24:00')
);
const eventBeginInDay: EventProps = createTestEvent(
  'The slug',
  'The test event',
  new Date('2023-02-17T03:00:00'),
  new Date('2023-03-18T04:24:00')
);
const eventEndInDay: EventProps = createTestEvent(
  'The slug',
  'The test event',
  new Date('2023-02-16T03:24:00'),
  new Date('2023-02-17T04:00:00')
);
const eventMiddleInDay: EventProps = createTestEvent(
  'The slug',
  'The test event',
  new Date('2023-02-16T03:24:00'),
  new Date('2023-02-18T04:24:00')
);

describe('<EventBlock />', () => {
  it('should display an EventBlock in the day', async () => {
    const component = render(
      <EventBlock day={eventInDay.beginDate.getDay()} event={eventInDay} />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component.getByRole('button').style.backgroundSize).toBe('cover');
    expect(component.getByRole('button').style.backgroundPosition).toBe(
      'center'
    );
    expect(component.getByRole('button').style.backgroundRepeat).toBe(
      'no-repeat'
    );
    expect(component).toMatchSnapshot();
  });

  it('should display an EventBlock in the end of the day', async () => {
    const component = render(
      <EventBlock
        day={eventBeginInDay.beginDate.getDay()}
        event={eventBeginInDay}
      />
    );
    expect(component.getByRole('button').style.height).toBe('420px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component.getByRole('button').style.backgroundSize).toBe('cover');
    expect(component.getByRole('button').style.backgroundPosition).toBe(
      'center'
    );
    expect(component.getByRole('button').style.backgroundRepeat).toBe(
      'no-repeat'
    );
    expect(component).toMatchSnapshot();
  });

  it('should display an EventBlock in the begin the day', async () => {
    const component = render(
      <EventBlock day={eventEndInDay.endDate.getDay()} event={eventEndInDay} />
    );
    expect(component.getByRole('button').style.height).toBe('80px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component.getByRole('button').style.backgroundSize).toBe('cover');
    expect(component.getByRole('button').style.backgroundPosition).toBe(
      'center'
    );
    expect(component.getByRole('button').style.backgroundRepeat).toBe(
      'no-repeat'
    );
    expect(component).toMatchSnapshot();
  });

  it('should display an EventBlock in the all day', async () => {
    const component = render(
      <EventBlock
        day={eventMiddleInDay.beginDate.getDay() + 1}
        event={eventMiddleInDay}
      />
    );
    expect(component.getByRole('button').style.height).toBe('480px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component.getByRole('button').style.backgroundSize).toBe('cover');
    expect(component.getByRole('button').style.backgroundPosition).toBe(
      'center'
    );
    expect(component.getByRole('button').style.backgroundRepeat).toBe(
      'no-repeat'
    );
    expect(component).toMatchSnapshot();
  });
});
