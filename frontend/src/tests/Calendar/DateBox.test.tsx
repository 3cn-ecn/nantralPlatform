import React from 'react';

import { DateBox } from '#shared/components/Calendar/ChooseWeek/DateBox/DateBox';
import { wrapAndRender } from '#shared/utils/tests';

describe('<DateBox />', () => {
  it('should display a DateBox', async () => {
    const component = wrapAndRender(
      <DateBox
        date={new Date('2023-02-17T03:24:00')}
        endDate={new Date('2023-02-26T03:24:00')}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
