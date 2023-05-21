import React from 'react';

import userEvent from '@testing-library/user-event';

import { CalendarView } from '#modules/event/view/Calendar/CalendarProps/CalendarProps';
import { ChooseDisplay } from '#modules/event/view/Calendar/ChooseDisplay/ChooseDisplay';
import { wrapAndRender } from '#shared/utils/tests';

let dayDisplay: { type: CalendarView; startDate: number } = {
  type: 'day',
  startDate: 6,
};
const updateDayDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  dayDisplay = newDisplay;
};
let daysDisplay: { type: CalendarView; startDate: number } = {
  type: '3Days',
  startDate: 2,
};
const updateDaysDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  daysDisplay = newDisplay;
};
let weekDisplay: { type: CalendarView; startDate: number } = {
  type: 'week',
  startDate: 0,
};
const updateWeekDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  weekDisplay = newDisplay;
};
let monthDisplay: { type: CalendarView; startDate: number } = {
  type: 'month',
  startDate: 0,
};
const updateMonthDisplay = (newDisplay: {
  type: CalendarView;
  startDate: number;
}) => {
  monthDisplay = newDisplay;
};

const user = userEvent.setup();

describe('<ChooseDisplay />', () => {
  it('should display a ChooseDisplay which update variable day', async () => {
    const component = wrapAndRender(
      <ChooseDisplay
        display={dayDisplay}
        updateDisplay={updateDayDisplay}
        startDate={new Date('2023-02-26T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByTestId('day-view-button'));
    expect(dayDisplay).toStrictEqual({
      type: 'day',
      startDate: 6,
    });

    // 3Days
    await user.click(component.getByTestId('3days-view-button'));
    expect(dayDisplay).toStrictEqual({
      type: '3Days',
      startDate: 6,
    });

    // week
    await user.click(component.getByTestId('week-view-button'));
    expect(dayDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(component.getByTestId('month-view-button'));
    expect(dayDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable 3Days', async () => {
    const component = wrapAndRender(
      <ChooseDisplay
        display={daysDisplay}
        updateDisplay={updateDaysDisplay}
        startDate={new Date('2023-02-22T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByTestId('day-view-button'));
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      startDate: 2,
    });

    // 3Days
    await user.click(component.getByTestId('3days-view-button'));
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      startDate: 2,
    });

    // week
    await user.click(component.getByTestId('week-view-button'));
    expect(daysDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(component.getByTestId('month-view-button'));
    expect(daysDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable week', async () => {
    const component = wrapAndRender(
      <ChooseDisplay
        display={weekDisplay}
        updateDisplay={updateWeekDisplay}
        startDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByTestId('day-view-button'));
    expect(weekDisplay).toStrictEqual({
      type: 'day',
      startDate: 0,
    });

    // 3Days
    await user.click(component.getByTestId('3days-view-button'));
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // week
    await user.click(component.getByTestId('week-view-button'));
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // month
    await user.click(component.getByTestId('month-view-button'));
    expect(weekDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable month', async () => {
    const component = wrapAndRender(
      <ChooseDisplay
        display={monthDisplay}
        updateDisplay={updateMonthDisplay}
        startDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByTestId('day-view-button'));
    expect(monthDisplay).toStrictEqual({
      type: 'day',
      startDate: 0,
    });

    // 3Days
    await user.click(component.getByTestId('3days-view-button'));
    expect(monthDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // week
    await user.click(component.getByTestId('week-view-button'));
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(component.getByTestId('month-view-button'));
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
});
