import React from 'react';
import { render } from '@testing-library/react';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';
import userEvent from '@testing-library/user-event';
import { ChangeWeek } from '../../components/Calendar/ChooseWeek/ChangeWeek/ChangeWeek';

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

let newBeginDate = new Date('2023-02-11T03:24:00');
const setNewBeginDate = (newDate: Date) => {
  newBeginDate = newDate;
};
let newEndDate = new Date('2023-02-24T03:24:00');
const setNewEndDate = (newDate: Date) => {
  newEndDate = newDate;
};
let newDisplayData: {
  type: CalendarView;
  beginDate: number;
} = {
  type: 'day',
  beginDate: 0,
};
const updateNewDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
}) => {
  newDisplayData = newDisplay;
};

const lastBeginDate = new Date('2023-09-14T03:24:00');
const setLastBeginDate = (newDate: Date) => {
  newBeginDate = newDate;
};
const lastEndDate = new Date('2023-09-16T03:24:00');
const setLastEndDate = (newDate: Date) => {
  newEndDate = newDate;
};
const lastDisplayData: {
  type: CalendarView;
  beginDate: number;
} = {
  type: 'month',
  beginDate: 0,
};
const updateLastDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
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
        beginDate={beginDate}
        endDate={endDate}
        updateBegin={setBeginDate}
        updateEnd={setEndDate}
      />
    );

    updateDisplay({ type: '3Days', beginDate: displayData.beginDate });
    const nextComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="next"
        step={displayData}
        updateDisplay={updateDisplay}
        beginDate={beginDate}
        endDate={endDate}
        updateBegin={setBeginDate}
        updateEnd={setEndDate}
      />
    );
    await user.click(previousComponent.getByTestId('ChangeWeekPreviousTestId'));
    expect(beginDate.getDate()).toBe(10);

    await user.click(nextComponent.getByTestId('ChangeWeekNextTestId'));
    expect(beginDate.getDate()).toBe(20);
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
        beginDate={newBeginDate}
        endDate={newEndDate}
        updateBegin={setNewBeginDate}
        updateEnd={setNewEndDate}
      />
    );

    updateNewDisplay({ type: 'month', beginDate: displayData.beginDate });
    const nextComponent = render(
      <ChangeWeek
        key="ChangeWeekTest"
        action="next"
        step={newDisplayData}
        updateDisplay={updateNewDisplay}
        beginDate={newBeginDate}
        endDate={newEndDate}
        updateBegin={setNewBeginDate}
        updateEnd={setNewEndDate}
      />
    );

    await user.click(previousComponent.getByTestId('ChangeWeekPreviousTestId'));
    expect(newBeginDate.getDate()).toBe(10);
    expect(newEndDate.getDate()).toBe(23);

    await user.click(nextComponent.getByTestId('ChangeWeekNextTestId'));
    expect(newBeginDate.getMonth()).toBe(2);

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
        beginDate={lastBeginDate}
        endDate={lastEndDate}
        updateBegin={setLastBeginDate}
        updateEnd={setLastEndDate}
      />
    );

    await user.click(component.getByTestId('ChangeWeekPreviousTestId'));
    expect(newBeginDate.getMonth()).toBe(7);

    expect(component).toMatchSnapshot();
  });
});
