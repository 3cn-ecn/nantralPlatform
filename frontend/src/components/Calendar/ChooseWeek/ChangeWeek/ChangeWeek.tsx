import React from 'react';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CalendarView } from '../../CalendarProps/CalendarProps';
import { modulo } from '../../../../utils/maths';

/**
 * The component which display the arrow to switch to last and next week.
 * @param action Defines whether the component is for last or next week.
 * @param step The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @param beginDate The first day of the week.
 * @param endDate The last day of the week.
 * @param updateBegin The callback to update first day.
 * @param updateEnd The callback to update last day.
 * @returns
 */
export function ChangeWeek(props: {
  action: 'previous' | 'next';
  step: { type: CalendarView; beginDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; beginDate: number }>
  >;
  beginDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}): JSX.Element {
  const {
    step,
    updateDisplay,
    action,
    beginDate,
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
      stepValue = 1;
      break;
    default:
      stepValue = 0;
      break;
  }
  if (action === 'previous') {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          updateDisplay({
            type: step.type,
            beginDate: modulo(step.beginDate - stepValue, 7),
          });
          const newBeginDate = new Date(
            beginDate.getFullYear(),
            beginDate.getMonth(),
            beginDate.getDate()
          );
          const newEndDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );
          newBeginDate.setDate(newBeginDate.getDate() - stepValue);
          updateBegin(newBeginDate);
          newEndDate.setDate(endDate.getDate() - stepValue);
          updateEnd(newEndDate);
        }}
      >
        <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
      </Button>
    );
  }
  if (action === 'next') {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          updateDisplay({
            type: step.type,
            beginDate: modulo(step.beginDate + stepValue, 7),
          });
          const newBeginDate = new Date(
            beginDate.getFullYear(),
            beginDate.getMonth(),
            beginDate.getDate()
          );
          const newEndDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );
          newBeginDate.setDate(newBeginDate.getDate() + stepValue);
          updateBegin(newBeginDate);
          newEndDate.setDate(endDate.getDate() + stepValue);
          updateEnd(newEndDate);
        }}
      >
        <ArrowForwardIosIcon></ArrowForwardIosIcon>
      </Button>
    );
  }
  console.warn('Appel de ChangeWeek mal effectué');
  return <p>Error</p>;
}
