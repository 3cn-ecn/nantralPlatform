import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { ChooseWeek } from '../../components/Calendar/ChooseWeek/ChooseWeek';

const event: EventProps = createTestEvent();
// const day: { day: number; date: number; events: Array<EventProps> }
describe('<ChooseWeek />', () => {
  it('should display an ChooseWeek', async () => {
    // const component = render(
    //   <ChooseWeek key="ChooseWeekTest" day={null} maxEventsInDayWeek={3} inMonth />
    // );
    // expect(component.getByRole('button').style.height).toBe('20px');
    // expect(component.getByRole('button').style.padding).toBe('0px');
    // expect(component).toMatchSnapshot();
  });
});
