import React from 'react';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';

import { modulo } from '#utils/maths';

import { CalendarView } from '../../CalendarProps/CalendarProps';
import { numberOfDayInDateMonth, numberOfDayInMonth } from '../../utils';

/**
 * The component which display the arrow to switch to last and next week.
 * @param action Defines whether the component is for last or next week.
 * @param step The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @param startDate The first day of the week.
 * @param endDate The last day of the week.
 * @param updateBegin The callback to update first day.
 * @param updateEnd The callback to update last day.
 * @returns
 */
export function ChangeWeek(props: {
  action: 'previous' | 'next';
  step: { type: CalendarView; startDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; startDate: number }>
  >;
  startDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}): JSX.Element {
  const {
    step,
    updateDisplay,
    action,
    startDate,
    endDate,
    updateBegin,
    updateEnd,
  } = props;
  let stepValue: number;
  switch (step.type) {
    case 'day':
      stepValue = 1;
      break;
    case '3Days':
      stepValue = 3;
      break;
    case 'week':
      stepValue = 7;
      break;
    case 'month':
      if (action === 'previous') {
        stepValue = numberOfDayInMonth(
          startDate.getFullYear(),
          startDate.getMonth() - 1
        );
      } else {
        stepValue = numberOfDayInDateMonth(startDate);
      }
      break;
    default:
      stepValue = 0;
      break;
  }
  if (action === 'previous') {
    return (
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          updateDisplay({
            type: step.type,
            startDate: modulo(step.startDate - stepValue, 7),
          });
          const newstartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          const newEndDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );
          newstartDate.setDate(newstartDate.getDate() - stepValue);
          updateBegin(newstartDate);
          newEndDate.setDate(endDate.getDate() - stepValue);
          updateEnd(newEndDate);
        }}
        style={{
          minWidth: `1px`,
          padding: '0px',
        }}
        data-testid="ChangeWeekPreviousTestId"
      >
        <ArrowBackIosNewIcon style={{ width: 'inherit' }}></ArrowBackIosNewIcon>
      </Button>
    );
  }
  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={() => {
        updateDisplay({
          type: step.type,
          startDate: modulo(step.startDate + stepValue, 7),
        });
        const newstartDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const newEndDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
        newstartDate.setDate(newstartDate.getDate() + stepValue);
        updateBegin(newstartDate);
        newEndDate.setDate(endDate.getDate() + stepValue);
        updateEnd(newEndDate);
      }}
      style={{
        minWidth: `1px`,
        padding: '0px',
      }}
      data-testid="ChangeWeekNextTestId"
    >
      <ArrowForwardIosIcon style={{ width: 'inherit' }}></ArrowForwardIosIcon>
    </Button>
  );
}
