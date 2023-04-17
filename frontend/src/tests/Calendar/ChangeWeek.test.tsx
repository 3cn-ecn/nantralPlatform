import React from 'react';
import { render } from '@testing-library/react';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';
import userEvent from '@testing-library/user-event';
import { ChangeWeek } from '../../components/Calendar/ChooseWeek/ChangeWeek/ChangeWeek';

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

let newstartDate = new Date('2023-02-11T03:24:00');
const setNewstartDate = (newDate: Date) => {
  newstartDate = newDate;
};
let newEndDate = new Date('2023-02-24T03:24:00');
const setNewEndDate = (newDate: Date) => {
  newEndDate = newDate;
};
let newDisplayData: {
  type: CalendarView;
  startDate: number;
} = {
  type: 'day',
  startDate: 0,
};
const updateNewDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  newDisplayData = newDisplay;
};

const laststartDate = new Date('2023-09-14T03:24:00');
const setLaststartDate = (newDate: Date) => {
  newstartDate = newDate;
};
const lastEndDate = new Date('2023-09-16T03:24:00');
const setLastEndDate = (newDate: Date) => {
  newEndDate = newDate;
};
const lastDisplayData: {
  type: CalendarView;
  startDate: number;
} = {
  type: 'month',
  startDate: 0,
};
const updateLastDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  newDisplayData = newDisplay;
};

const user = userEvent.setup();

describe('<ChangeWeek />; only changes the date of the number of days, does not reajust the end of the area of time; + component does not rerender', () => {
  it('should display a ChangeWeek (week and 3Daays)', async () => {
    const previousComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="previous"
        step={displayData}
        updateDisplay={updateDisplay}
        startDate={startDate}
        endDate={endDate}
        updateBegin={setstartDate}
        updateEnd={setEndDate}
      />
    );

    updateDisplay({ type: '3Days', startDate: displayData.startDate });
    const nextComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="next"
        step={displayData}
        updateDisplay={updateDisplay}
        startDate={startDate}
        endDate={endDate}
        updateBegin={setstartDate}
        updateEnd={setEndDate}
      />
    );
    await user.click(previousComponent.getByTestId('ChangeWeekPreviousTestId'));
    expect(startDate.getDate()).toBe(10);

    await user.click(nextComponent.getByTestId('ChangeWeekNextTestId'));
    expect(startDate.getDate()).toBe(20);
    expect(endDate.getDate()).toBe(25);

    expect(previousComponent).toMatchSnapshot();
    expect(nextComponent).toMatchSnapshot();
  });

  it('should display an other ChangeWeek (day and month)', async () => {
    const previousComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="previous"
        step={newDisplayData}
        updateDisplay={updateNewDisplay}
        startDate={newstartDate}
        endDate={newEndDate}
        updateBegin={setNewstartDate}
        updateEnd={setNewEndDate}
      />
    );

    updateNewDisplay({ type: 'month', startDate: displayData.startDate });
    const nextComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="next"
        step={newDisplayData}
        updateDisplay={updateNewDisplay}
        startDate={newstartDate}
        endDate={newEndDate}
        updateBegin={setNewstartDate}
        updateEnd={setNewEndDate}
      />
    );

    await user.click(previousComponent.getByTestId('ChangeWeekPreviousTestId'));
    expect(newstartDate.getDate()).toBe(10);
    expect(newEndDate.getDate()).toBe(23);

    await user.click(nextComponent.getByTestId('ChangeWeekNextTestId'));
    expect(newstartDate.getMonth()).toBe(2);

    expect(previousComponent).toMatchSnapshot();
    expect(nextComponent).toMatchSnapshot();
  });

  it('should display an other ChangeWeek (month previous)', async () => {
    const component = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="previous"
        step={lastDisplayData}
        updateDisplay={updateLastDisplay}
        startDate={laststartDate}
        endDate={lastEndDate}
        updateBegin={setLaststartDate}
        updateEnd={setLastEndDate}
      />
    );

    await user.click(component.getByTestId('ChangeWeekPreviousTestId'));
    expect(newstartDate.getMonth()).toBe(7);

    expect(component).toMatchSnapshot();
  });
});
