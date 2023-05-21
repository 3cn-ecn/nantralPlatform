import React from 'react';

import { Grid } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarView } from '../CalendarProps/CalendarProps';
import { ChangeWeek } from './ChangeWeek/ChangeWeek';
import './ChooseWeek.scss';
import { DateBox } from './DateBox/DateBox';

/**
 * Create an object to choose the current week.
 * @param step The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @param startDate The first day of the week.
 * @param endDate The last day of the week.
 * @param updateBegin The callback to update first day.
 * @param startDate The callback to update last day.
 * @returns The component to change week.
 */
export function ChooseWeek(props: {
  step: { type: CalendarView; startDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; startDate: number }>
  >;
  startDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}): JSX.Element {
  const { step, updateDisplay, startDate, endDate, updateBegin, updateEnd } =
    props;
  const { t, formatDate } = useTranslation();
  const sunday = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  sunday.setDate(sunday.getDate() - 1);
  return (
    <>
      <div id="areaOfTimeDisplay">
        {`${formatDate(startDate, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })} ${t('calendar.to')} `}
        {formatDate(sunday, {
          weekday: 'long',
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
              startDate={startDate}
              endDate={endDate}
              updateBegin={updateBegin}
              updateEnd={updateEnd}
            ></ChangeWeek>
          </Grid>
          <Grid item xs={1}>
            <DateBox date={startDate} endDate={endDate}></DateBox>
          </Grid>
          <Grid item xs={1}>
            <ChangeWeek
              action="next"
              step={step}
              updateDisplay={updateDisplay}
              startDate={startDate}
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
