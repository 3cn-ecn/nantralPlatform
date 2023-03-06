import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { Month } from '../../components/Calendar/Month/Month';

const event: EventProps = createTestEvent();
// const day: { day: number; date: number; events: Array<EventProps> }
describe('<Month />', () => {
  it('should display an Month', async () => {
    // const component = render(
    //   <Month key="MonthTest" day={null} maxEventsInDayWeek={3} inMonth />
    // );
    // expect(component.getByRole('button').style.height).toBe('20px');
    // expect(component.getByRole('button').style.padding).toBe('0px');
    // expect(component).toMatchSnapshot();
  });
});
