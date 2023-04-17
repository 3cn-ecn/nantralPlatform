import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarView } from 'components/Calendar/CalendarProps/CalendarProps';
import { ChooseDisplay } from '../../components/Calendar/ChooseDisplay/ChooseDisplay';

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
  it('should display a ChooseDisplay which update variable day; Components does not rerender, so we can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={dayDisplay}
        updateDisplay={updateDayDisplay}
        startDate={new Date('2023-02-26T03:24:00')}
      ></ChooseDisplay>
    );

    expect(
      component.getByRole('button', { name: 'calendar.view.day' }).textContent
    ).toBe('calendar.view.day');
    expect(
      component.getByRole('button', { name: 'calendar.view.3Days' }).textContent
    ).toBe('calendar.view.3Days');
    expect(
      component.getByRole('button', { name: 'calendar.view.week' }).textContent
    ).toBe('calendar.view.week');
    expect(
      component.getByRole('button', { name: 'calendar.view.month' }).textContent
    ).toBe('calendar.view.month');

    // day
    await user.click(
      component.getByRole('button', { name: 'calendar.view.day' })
    );
    expect(dayDisplay).toStrictEqual({
      type: 'day',
      startDate: 6,
    });

    // 3Days
    await user.click(
      component.getByRole('button', { name: 'calendar.view.3Days' })
    );
    expect(dayDisplay).toStrictEqual({
      type: '3Days',
      startDate: 6,
    });

    // week
    await user.click(
      component.getByRole('button', { name: 'calendar.view.week' })
    );
    expect(dayDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(
      component.getByRole('button', { name: 'calendar.view.month' })
    );
    expect(dayDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable 3Days; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={daysDisplay}
        updateDisplay={updateDaysDisplay}
        startDate={new Date('2023-02-22T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(
      component.getByRole('button', { name: 'calendar.view.day' })
    );
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      startDate: 2,
    });

    // 3Days
    await user.click(
      component.getByRole('button', { name: 'calendar.view.3Days' })
    );
    expect(daysDisplay).toStrictEqual({
      type: 'day',
      startDate: 2,
    });

    // week
    await user.click(
      component.getByRole('button', { name: 'calendar.view.week' })
    );
    expect(daysDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(
      component.getByRole('button', { name: 'calendar.view.month' })
    );
    expect(daysDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable week; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={weekDisplay}
        updateDisplay={updateWeekDisplay}
        startDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(
      component.getByRole('button', { name: 'calendar.view.day' })
    );
    expect(weekDisplay).toStrictEqual({
      type: 'day',
      startDate: 0,
    });

    // 3Days
    await user.click(
      component.getByRole('button', { name: 'calendar.view.3Days' })
    );
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // week
    await user.click(
      component.getByRole('button', { name: 'calendar.view.week' })
    );
    expect(weekDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // month
    await user.click(
      component.getByRole('button', { name: 'calendar.view.month' })
    );
    expect(weekDisplay).toStrictEqual({
      type: 'month',
      startDate: 2,
    });

    expect(component).toMatchSnapshot();
  });
  it('should display a ChooseDisplay which update variable month; Components does not rerender, so wwe can do only few tests', async () => {
    const component = render(
      <ChooseDisplay
        display={monthDisplay}
        updateDisplay={updateMonthDisplay}
        startDate={new Date('2023-02-20T03:24:00')}
      ></ChooseDisplay>
    );

    // day
    await user.click(
      component.getByRole('button', { name: 'calendar.view.day' })
    );
    expect(monthDisplay).toStrictEqual({
      type: 'day',
      startDate: 0,
    });

    // 3Days
    await user.click(
      component.getByRole('button', { name: 'calendar.view.3Days' })
    );
    expect(monthDisplay).toStrictEqual({
      type: '3Days',
      startDate: 0,
    });

    // week
    await user.click(
      component.getByRole('button', { name: 'calendar.view.week' })
    );
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    // month
    await user.click(
      component.getByRole('button', { name: 'calendar.view.month' })
    );
    expect(monthDisplay).toStrictEqual({
      type: 'week',
      startDate: 0,
    });

    expect(component).toMatchSnapshot();
  });
});
