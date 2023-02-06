import React from 'react';
import { Stack } from '@mui/material';
import { ChangeWeek } from './ChangeWeek/ChangeWeek';
import { DateBox } from './DateBox/DateBox';

/**
 * Create an object to choose the current week.
 * @param beginDate The first day of the week.
 * @param endDate The last day of the week.
 * @param updateBegin The callback to update first day.
 * @param beginDate The callback to update last day.
 * @returns The component to change week.
 */
export function ChooseWeek(props: {
  beginDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}): JSX.Element {
  const { beginDate, endDate, updateBegin, updateEnd } = props;
  return (
    <div id="day" style={{ display: 'flex' }}>
      <ChangeWeek
        action="previous"
        beginDate={beginDate}
        endDate={endDate}
        updateBegin={updateBegin}
        updateEnd={updateEnd}
      ></ChangeWeek>
      <Stack spacing={3}>
        <DateBox date={beginDate} endDate={endDate}></DateBox>
      </Stack>
      <ChangeWeek
        action="next"
        beginDate={beginDate}
        endDate={endDate}
        updateBegin={updateBegin}
        updateEnd={updateEnd}
      ></ChangeWeek>
    </div>
  );
}
