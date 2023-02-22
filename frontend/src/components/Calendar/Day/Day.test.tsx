import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../../Props/Event';
import { createTestEvent } from '../testElements/testElements';
import { Day } from './Day';

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
    // to implement: console.log(component.getByText('GlobalDayContainer').style.transform);expect(component.getByText('GlobalDayContainer').style.transform).toBe(`translate(0px, ${20 * 21.6}px)`);
    expect(component).toMatchSnapshot();
  });
});
