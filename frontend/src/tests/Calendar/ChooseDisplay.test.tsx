import React from 'react';
import { render } from '@testing-library/react';
import { ChooseDisplay } from '../../components/Calendar/ChooseDisplay/ChooseDisplay';

describe('<ChooseDisplay />', () => {
  const testClick = () => {
    console.log('click');
  };

  it('should display a ChooseDisplay', async () => {
    const component = render(
      <ChooseDisplay
        display={{
          type: 'week',
          beginDate: 0,
        }}
        updateDisplay={testClick}
      ></ChooseDisplay>
    );
    expect(component.getByRole('button', { name: 'day' }).textContent).toBe(
      'day'
    );
    expect(component.getByRole('button', { name: '3Days' }).textContent).toBe(
      '3Days'
    );
    expect(component.getByRole('button', { name: 'week' }).textContent).toBe(
      'week'
    );
    expect(component.getByRole('button', { name: 'month' }).textContent).toBe(
      'month'
    );
    expect(component).toMatchSnapshot();
  });
});
