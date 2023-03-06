import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../Props/Event';
import { createTestEvent } from './testElements/testElements';
import { Day } from '../../components/Calendar/Day/Day';

const event: EventProps = createTestEvent();
describe('<Day />', () => {
  it('should display a Day', async () => {
    const component = render(
      <Day
        dayValue={event.beginDate.getDay()}
        day="Vendredi"
        events={[event]}
        chains={[[0]]}
      />
    );
    console.log(component.getByTestId('GlobalDayContainer').textContent);
    // expect(component.getByTestId('GlobalDayContainer').style.transform).toBe(
    //   `translate(0px, ${20 * 21.6}px)`
    // );
    expect(component).toMatchSnapshot();
  });
});
