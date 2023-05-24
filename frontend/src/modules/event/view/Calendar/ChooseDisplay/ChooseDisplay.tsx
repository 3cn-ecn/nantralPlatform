import React from 'react';

import { Button } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';
import { modulo } from '#shared/utils/maths';

import { CalendarView } from '../CalendarProps/CalendarProps';
import { firstMonthDay } from '../utils';

/**
 * Component to change the calendar view.
 * @param display The type and beginning day in the week of the view.
 * @param updateDisplay The callback to update display.
 * @returns The buttons to change the view of the calendar.
 */
export function ChooseDisplay(props: {
  display: { type: CalendarView; startDate: number };
  updateDisplay: React.Dispatch<
    React.SetStateAction<{ type: CalendarView; startDate: number }>
  >;
  startDate: Date;
}): JSX.Element {
  const { display, updateDisplay, startDate } = props;
  const { t } = useTranslation();
  return (
    <>
      <Button
        data-testid="day-view-button"
        onClick={() => {
          if (display.type !== 'day') {
            updateDisplay({ type: 'day', startDate: display.startDate });
          }
        }}
      >
        {t('calendar.view.day')}
      </Button>
      <Button
        data-testid="3days-view-button"
        onClick={() => {
          if (display.type !== '3Days') {
            updateDisplay({ type: '3Days', startDate: display.startDate });
          }
        }}
      >
        {t('calendar.view.3Days')}
      </Button>
      <Button
        data-testid="week-view-button"
        onClick={() => {
          if (display.type !== 'week') {
            updateDisplay({ type: 'week', startDate: 0 });
          }
        }}
      >
        {t('calendar.view.week')}
      </Button>
      <Button
        data-testid="month-view-button"
        onClick={() => {
          if (display.type !== 'month') {
            updateDisplay({
              type: 'month',
              startDate: modulo(firstMonthDay(startDate).getDay() - 1, 7) + 1,
            });
          }
        }}
      >
        {t('calendar.view.month')}
      </Button>
    </>
  );
}