import React from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// import './Event.scss';

function TimeBlock(props: { startTime: any }) {
  const { startTime } = props;
  return (
    <Box margin="10px" style={{ border: '2px solid gray' }}>
      {startTime}
    </Box>
  );
}

function Day() {
  return (
    <div style={{ display: 'block' }}>
      <TimeBlock startTime={0}></TimeBlock>
      <TimeBlock startTime={2}></TimeBlock>
      <TimeBlock startTime={4}></TimeBlock>
      <TimeBlock startTime={6}></TimeBlock>
      <TimeBlock startTime={8}></TimeBlock>
      <TimeBlock startTime={10}></TimeBlock>
      <TimeBlock startTime={12}></TimeBlock>
      <TimeBlock startTime={14}></TimeBlock>
      <TimeBlock startTime={16}></TimeBlock>
      <TimeBlock startTime={18}></TimeBlock>
      <TimeBlock startTime={20}></TimeBlock>
      <TimeBlock startTime={22}></TimeBlock>
    </div>
  );
}

function Calendar() {
  return (
    <>
      {/* <h1>Évènements</h1> */}
      <p>Le calendrier</p>
      <div style={{ display: 'flex' }}>
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
      </div>
    </>
  );
}

export default Calendar;
