import React from 'react';

import { CalendarMonth } from '@mui/icons-material';
import { Button } from '@mui/material';

/**
 * The DateBox component which displays the current week and allow to change by click.
 * @param date The first day of the week.
 * @param endDate The last day of the week.
 */
export function DateBox(props: { date: Date; endDate: Date }): JSX.Element {
  const { date, endDate } = props;
  // @todo implement the change date with the CalendarMonth button
  const sunday = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  sunday.setDate(sunday.getDate() - 1);
  return (
    <div>
      <Button
        variant="outlined"
        fullWidth
        data-testid="DateBoxTestId"
        style={{
          minWidth: `1px`,
          padding: '0px',
        }}
      >
        <CalendarMonth style={{ width: 'inherit' }}></CalendarMonth>
      </Button>
    </div>
  );
}
