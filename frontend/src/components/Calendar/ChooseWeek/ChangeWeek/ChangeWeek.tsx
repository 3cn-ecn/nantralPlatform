import React from 'react';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export function ChangeWeek(props: {
  action: 'previous' | 'next';
  beginDate: Date;
  endDate: Date;
  updateBegin: any;
  updateEnd: any;
}) {
  const { action, beginDate, endDate, updateBegin, updateEnd } = props;
  if (action === 'previous') {
    return (
      <Button
        variant="outlined"
        onClick={() => {
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
          newBeginDate.setDate(newBeginDate.getDate() - 7);
          updateBegin(newBeginDate);
          newEndDate.setDate(endDate.getDate() - 7);
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
          newBeginDate.setDate(newBeginDate.getDate() + 7);
          updateBegin(newBeginDate);
          newEndDate.setDate(endDate.getDate() + 7);
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
