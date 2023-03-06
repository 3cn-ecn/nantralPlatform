import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { TimeBlock } from '../../components/Calendar/Day/TimeBlock/TimeBlock';

const event: EventProps = createTestEvent();
const day: { day: number; date: number; events: Array<EventProps> }
describe('<DayInfos />', () => {
  it('should display an TimeBlock', async () => {
    const component = render(
      <TimeBlock key="TimeBlockTest" day={null} maxEventsInDayWeek={3} inMonth />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});
