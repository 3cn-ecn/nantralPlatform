import React from 'react';
import { render } from '@testing-library/react';
import { DateBox } from '../../components/Calendar/ChooseWeek/DateBox/DateBox';

describe('<DateBox />', () => {
  it('should display a DateBox', async () => {
    const component = render(
      <DateBox
        date={new Date('2023-02-17T03:24:00')}
        endDate={new Date('2023-02-26T03:24:00')}
      />
    );
    expect(component.getByTestId('DateBoxTestId').textContent).toBe(
      'vendredi 17 février 2023 au samedi 25 février 2023'
    );
    expect(component).toMatchSnapshot();
  });
});
