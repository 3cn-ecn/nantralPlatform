import React from 'react';

import { DayInfos } from '#shared/components/Calendar/DayInfos/DayInfos';
import { wrapAndRender } from '#utils/tests';

describe('<DayInfos />', () => {
  it('should display a DayInfos', async () => {
    const component = wrapAndRender(<DayInfos key="DayInfosTest" />);

    for (let i = 0; i < 10; i += 2) {
      expect(
        component.getByTestId(`timeSlotTestId 0${i}:00`).className.slice(0, 12)
      ).toBe('timeSlot');
    }
    for (let i = 10; i < 24; i += 2) {
      expect(
        component.getByTestId(`timeSlotTestId ${i}:00`).className.slice(0, 12)
      ).toBe('timeSlot');
    }
    expect(
      component.getByTestId('blockDisplayTestId').className.slice(0, 12)
    ).toBe('blockDisplay');
    expect(
      component.getByTestId('blankedAreaTestId').className.slice(0, 12)
    ).toBe('blankedArea');

    expect(component).toMatchSnapshot();
  });
});
