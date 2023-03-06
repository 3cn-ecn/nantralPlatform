import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { DayBlock } from '../../components/Calendar/Month/WeekLine/DayBlock/DayBlock';

const event: EventProps = createTestEvent();
const day: { day: number; date: number; events: Array<EventProps> }
describe('<DayBlock />', () => {
  it('should display an DayBlock', async () => {
    const component = render(
      <DayBlock key="DayBlockTest" day={null} maxEventsInDayWeek={3} inMonth />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});
