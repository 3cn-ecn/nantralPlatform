import React from 'react';
import { Box } from '@mui/material';

/**
 * Function that creates the TimeBlock component, which are the backround lines in the calendar.
 * @param startTime The hour value, to set where and how the component has to be placed.
 * @returns The TimeBlock component.
 */
export function TimeBlock(props: { startTime: number }): JSX.Element {
  const { startTime } = props;

  if (startTime % 2 === 0) {
    return (
      <Box className="TimeBlockEven" data-testid="TimeBlockEvenTestId"></Box>
    );
  }

  return <Box className="TimeBlockOdd" data-testid="TimeBlockOddTestId"></Box>;
}
