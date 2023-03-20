import React from 'react';
import './DayInfos.scss';

/**
 * Function that creates the DayInfos component, which display the hours in the day.
 * @return The DayInfos component.
 */
export function DayInfos() {
  const timeSlots = [];
  for (let i = 0; i < 10; i += 2) {
    timeSlots.push(
      <p
        key={`timeSlot 0${i}:00`}
        className="timeSlot"
        data-testid={`timeSlotTestId 0${i}:00`}
      >{`0${i}:00`}</p>
    );
  }
  for (let i = 10; i < 24; i += 2) {
    timeSlots.push(
      <p
        key={`timeSlot ${i}:00`}
        className="timeSlot"
        data-testid={`timeSlotTestId ${i}:00`}
      >{`${i}:00`}</p>
    );
  }
  return (
    <div className="blockDisplay" data-testid="blockDisplayTestId">
      <div className="blankedArea" data-testid="blankedAreaTestId"></div>
      {timeSlots}
    </div>
  );
}
