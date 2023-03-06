import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { DayInfos } from '../../components/Calendar/DayInfos/DayInfos';

const event: EventProps = createTestEvent();
const day: { day: number; date: number; events: Array<EventProps> }
describe('<DayInfos />', () => {
  it('should display an DayInfos', async () => {
    const component = render(
      <DayInfos key="DayInfosTest" day={null} maxEventsInDayWeek={3} inMonth />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});
