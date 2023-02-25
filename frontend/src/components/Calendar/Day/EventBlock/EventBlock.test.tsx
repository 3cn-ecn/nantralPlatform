import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../../../Props/Event';
import { createTestEvent } from '../../testElements/testElements';
import { EventBlock } from './EventBlock';

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
