import React from 'react';
import { Button } from '@mui/material';
import { modulo } from '../../../utils/maths';
import { CalendarView } from '../CalendarProps/CalendarProps';
import { firstMonthDay } from '../utils';

/**
 * Component to change the calendar view.
 * @param display The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @returns The buttons to change the view of the calendar.
 */
export function ChooseDisplay(props: {
  display: { type: CalendarView; beginDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; beginDate: number }>
  >;
  beginDate: Date;
}): JSX.Element {
  const { display, updateDisplay, beginDate } = props;
  return (
    <>
      <Button
        data-testid="dayButtonTestId"
        onClick={() => {
          if (display.type !== 'day') {
            updateDisplay({ type: 'day', beginDate: display.beginDate });
          }
        }}
      >
        day
      </Button>
      <Button
        data-testid="monthButtonTestId"
        onClick={() => {
          if (display.type !== '3Days') {
            updateDisplay({ type: '3Days', beginDate: display.beginDate });
          }
        }}
      >
        3Days
      </Button>
      <Button
        data-testid="weekButtonTestId"
        onClick={() => {
          if (display.type !== 'week') {
            updateDisplay({ type: 'week', beginDate: 0 });
          }
        }}
      >
        week
      </Button>
      <Button
        data-testid="monthButtonTestId"
        onClick={() => {
          if (display.type !== 'month') {
            updateDisplay({
              type: 'month',
              beginDate: modulo(firstMonthDay(beginDate).getDay() - 1, 7) + 1,
            });
          }
        }}
      >
        month
      </Button>
    </>
  );
}
