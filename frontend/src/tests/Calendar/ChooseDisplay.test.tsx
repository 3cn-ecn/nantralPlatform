import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';
import { ChooseDisplay } from '../../components/Calendar/ChooseDisplay/ChooseDisplay';

let dayDisplay: { type: CalendarView; beginDate: number } = {
  type: 'day',
  beginDate: 6,
};
const updateDayDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
}) => {
  dayDisplay = newDisplay;
};
let daysDisplay: { type: CalendarView; beginDate: number } = {
  type: '3Days',
  beginDate: 2,
};
const updateDaysDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
}) => {
  daysDisplay = newDisplay;
};
let weekDisplay: { type: CalendarView; beginDate: number } = {
  type: 'week',
  beginDate: 0,
};
const updateWeekDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
}) => {
  weekDisplay = newDisplay;
};
let monthDisplay: { type: CalendarView; beginDate: number } = {
  type: 'month',
  beginDate: 0,
};
const updateMonthDisplay = (newDisplay: {
  type: CalendarView;
  beginDate: number;
}) => {
  monthDisplay = newDisplay;
};

const user = userEvent.setup();

describe('<ChooseDisplay />', () => {
  it('should display a ChooseDisplay which update variable day; Components does not rerender, so we can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={dayDisplay}
        updateDisplay={updateDayDisplay}
        beginDate={new Date('2023-02-26T03:24:00')}
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

    // day
    await user.click(component.getByRole('button', { name: 'day' }));
    expect(dayDisplay).toStrictEqual({
      type: 'day',
      beginDate: 6,
    });

    // 3Days
    await user.click(component.getByRole('button', { name: '3Days' }));
    expect(dayDisplay).toStrictEqual({
      type: '3Days',
      beginDate: 6,
    });

    // week
    await user.click(component.getByRole('button', { name: 'week' }));
    expect(dayDisplay).toStrictEqual({
      type: 'week',
      beginDate: 0,
    });

    // month
    await user.click(component.getByRole('button', { name: 'month' }));
    expect(dayDisplay).toStrictEqual({
      type: 'month',
      beginDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable 3Days; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={daysDisplay}
        updateDisplay={updateDaysDisplay}
        beginDate={new Date('2023-02-22T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByRole('button', { name: 'day' }));
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      beginDate: 2,
    });

    // 3Days
    await user.click(component.getByRole('button', { name: '3Days' }));
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      beginDate: 2,
    });

    // week
    await user.click(component.getByRole('button', { name: 'week' }));
    expect(daysDisplay).toStrictEqual({
      type: 'week',
      beginDate: 0,
    });

    // month
    await user.click(component.getByRole('button', { name: 'month' }));
    expect(daysDisplay).toStrictEqual({
      type: 'month',
      beginDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable week; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={weekDisplay}
        updateDisplay={updateWeekDisplay}
        beginDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByRole('button', { name: 'day' }));
    expect(weekDisplay).toStrictEqual({
      type: 'day',
      beginDate: 0,
    });

    // 3Days
    await user.click(component.getByRole('button', { name: '3Days' }));
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      beginDate: 0,
    });

    // week
    await user.click(component.getByRole('button', { name: 'week' }));
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      beginDate: 0,
    });

    // month
    await user.click(component.getByRole('button', { name: 'month' }));
    expect(weekDisplay).toStrictEqual({
      type: 'month',
      beginDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable month; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={monthDisplay}
        updateDisplay={updateMonthDisplay}
        beginDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(component.getByRole('button', { name: 'day' }));
    expect(monthDisplay).toStrictEqual({
      type: 'day',
      beginDate: 0,
    });

    // 3Days
    await user.click(component.getByRole('button', { name: '3Days' }));
    expect(monthDisplay).toStrictEqual({
      type: '3Days',
      beginDate: 0,
    });

    // week
    await user.click(component.getByRole('button', { name: 'week' }));
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      beginDate: 0,
    });

    // month
    await user.click(component.getByRole('button', { name: 'month' }));
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      beginDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
});
