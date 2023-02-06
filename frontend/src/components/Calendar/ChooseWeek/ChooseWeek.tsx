import React from 'react';
import { Stack } from '@mui/material';
import { ChangeWeek } from './ChangeWeek/ChangeWeek';
import { DateBox } from './DateBox/DateBox';

export function ChooseWeek(props: {
  beginDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}) {
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
