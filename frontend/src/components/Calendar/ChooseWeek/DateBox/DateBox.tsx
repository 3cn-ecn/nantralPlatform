import React from 'react';
import { CalendarMonth } from '@mui/icons-material';
import { Button, Container, Grid } from '@mui/material';

/**
 * The DateBox component which displays the current week and allow to change by click.
 * @param date The first day of the week.
 * @param endDate The last day of the week.
 */
export function DateBox(props: { date: Date; endDate: Date }): JSX.Element {
  const { date, endDate } = props;
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
        onClick={() => {
          console.log('tap');
        }}
        data-testid="DateBoxTestId"
        style={{
          minWidth: `1px`,
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <CalendarMonth></CalendarMonth>
          </Grid>
        </Grid>
      </Button>
    </div>
  );
}
