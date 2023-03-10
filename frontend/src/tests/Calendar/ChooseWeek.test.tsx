import React from 'react';
import { render } from '@testing-library/react';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';
import { ChooseWeek } from '../../components/Calendar/ChooseWeek/ChooseWeek';

let beginDate = new Date('2023-02-17T03:24:00');
const setBeginDate = (newDate: Date) => {
  beginDate = newDate;
};
let endDate = new Date('2023-02-22T03:24:00');
const setEndDate = (newDate: Date) => {
  endDate = newDate;
};
let displayData: {
  type: CalendarView;
  beginDate: number;
} = {
  type: 'week',
  beginDate: 0,
};
const updateDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
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
        beginDate={beginDate}
        endDate={endDate}
        updateBegin={setBeginDate}
        updateEnd={setEndDate}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
