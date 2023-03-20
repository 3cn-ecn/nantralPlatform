import React from 'react';
import './DayInfos.scss';

/**
 * Function that creates the DayInfos component, which display the hours in the day.
 * @return The DayInfos component.
 */
export function DayInfos() {
  const timeSlots = [];
  for (let i = 0; i <= 10; i += 2) {
    timeSlots.push(<p className="timeSlot">{`0${i}:00`}</p>);
  }
  for (let i = 10; i < 24; i += 2) {
    timeSlots.push(<p className="timeSlot">{`${i}:00`}</p>);
  }
  return (
    <div className="blockDisplay">
      <div className="blankedArea"></div>
      {timeSlots}
    </div>
  );
}
