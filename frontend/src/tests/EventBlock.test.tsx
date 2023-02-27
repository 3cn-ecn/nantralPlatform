import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../Props/Event';
import { createTestEvent } from '../components/Calendar/testElements/testElements';
import { EventBlock } from '../components/Calendar/Day/EventBlock/EventBlock';

const event: EventProps = createTestEvent();
describe('<EventBlock />', () => {
  it('should display an EventBlock', async () => {
    const component = render(
      <EventBlock day={event.beginDate.getDay()} event={event} />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});