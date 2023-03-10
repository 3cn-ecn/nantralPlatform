import React from 'react';
import { Grid } from '@mui/material';
import { ChangeWeek } from './ChangeWeek/ChangeWeek';
import { DateBox } from './DateBox/DateBox';
import { CalendarView } from '../CalendarProps/CalendarProps';
import './ChooseWeek.scss';

/**
 * Create an object to choose the current week.
 * @param step The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @param beginDate The first day of the week.
 * @param endDate The last day of the week.
 * @param updateBegin The callback to update first day.
 * @param beginDate The callback to update last day.
 * @returns The component to change week.
 */
export function ChooseWeek(props: {
  step: { type: CalendarView; beginDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; beginDate: number }>
  >;
  beginDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}): JSX.Element {
  const { step, updateDisplay, beginDate, endDate, updateBegin, updateEnd } =
    props;
  const sunday = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  sunday.setDate(sunday.getDate() - 1);
  return (
    <>
      <div id="areaOfTimeDisplay">
        {`${beginDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} au `}
        {sunday.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div id="changeAreaOfTime">
        <Grid container justifyContent="center">
          <Grid item xs={1}>
            <ChangeWeek
              action="previous"
              step={step}
              updateDisplay={updateDisplay}
              beginDate={beginDate}
              endDate={endDate}
              updateBegin={updateBegin}
              updateEnd={updateEnd}
            ></ChangeWeek>
          </Grid>
          <Grid item xs={1}>
            <DateBox date={beginDate} endDate={endDate}></DateBox>
          </Grid>
          <Grid item xs={1}>
            <ChangeWeek
              action="next"
              step={step}
              updateDisplay={updateDisplay}
              beginDate={beginDate}
              endDate={endDate}
              updateBegin={updateBegin}
              updateEnd={updateEnd}
            ></ChangeWeek>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
