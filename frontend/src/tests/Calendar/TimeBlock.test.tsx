import React from 'react';
import { render } from '@testing-library/react';
import { TimeBlock } from '../../components/Calendar/Day/TimeBlock/TimeBlock';

describe('<DayInfos />', () => {
  it('should display an TimeBlock', async () => {
    const oddComponent = render(
      <TimeBlock key="TimeBlockOddTest" startTime={5} />
    );

    const evenComponent = render(
      <TimeBlock key="TimeBlockEvenTest" startTime={2} />
    );
    expect(
      oddComponent.getByTestId('TimeBlockOddTestId').className.slice(0, 12)
    ).toBe('timeBlockOdd');
    expect(
      evenComponent.getByTestId('TimeBlockEvenTestId').className.slice(0, 13)
    ).toBe('timeBlockEven');

    expect(evenComponent).toMatchSnapshot();
    expect(oddComponent).toMatchSnapshot();
  });
});
