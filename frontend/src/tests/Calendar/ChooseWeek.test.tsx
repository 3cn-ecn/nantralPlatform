import React from 'react';

import { render } from '@testing-library/react';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';

import { ChooseWeek } from '../../components/Calendar/ChooseWeek/ChooseWeek';

let startDate = new Date('2023-02-17T03:24:00');
const setstartDate = (newDate: Date) => {
  startDate = newDate;
};
let endDate = new Date('2023-02-22T03:24:00');
const setEndDate = (newDate: Date) => {
  endDate = newDate;
};
let displayData: {
  type: CalendarView;
  startDate: number;
} = {
  type: 'week',
  startDate: 0,
};
const updateDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  displayData = newDisplay;
};

describe('<ChooseWeek />', () => {
  it('should display an ChooseWeek', async () => {
    const component = render(
      <ChooseWeek
        key="ChooseWeekTest"
        step={displayData}
        updateDisplay={updateDisplay}
        startDate={startDate}
        endDate={endDate}
        updateBegin={setstartDate}
        updateEnd={setEndDate}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
