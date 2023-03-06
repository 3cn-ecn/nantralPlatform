import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { WeekLine } from '../../components/Calendar/Month/WeekLine/WeekLine';

const event: EventProps = createTestEvent();
const day: { day: number; date: number; events: Array<EventProps> }
describe('<WeekLine />', () => {
  it('should display an WeekLine', async () => {
    const component = render(
      <WeekLine key="WeekLineTest" day={null} maxEventsInDayWeek={3} inMonth />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});
