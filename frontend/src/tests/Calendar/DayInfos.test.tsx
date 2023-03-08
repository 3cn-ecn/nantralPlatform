import React from 'react';
import { render } from '@testing-library/react';
import { DayInfos } from '../../components/Calendar/DayInfos/DayInfos';

describe('<DayInfos />', () => {
  it('should display a DayInfos', async () => {
    const component = render(<DayInfos key="DayInfosTest" />);
    expect(component).toMatchSnapshot();
  });
});
