import React from 'react';
import { EventProps } from '../../../Props/Event';
import { WeekLine } from './WeekLine/WeekLine';

export function Month(props: {
  monthWeeks: Array<Array<[string, number]>>;
  events: Array<Array<EventProps>>;
}) {
  const { monthWeeks, events } = props;
  let weekIndex = 0;
  let dayCount = 0;
  const weeks: Array<
    Array<{ day: number; date: number; events: Array<EventProps> }>
  > = [];
  let tempWeek: Array<{ day: number; date: number; events: Array<EventProps> }>;
  monthWeeks.forEach((week) => {
    tempWeek = [];
    week.forEach((day) => {
      dayCount += 1;
      tempWeek.push({
        day: day[1],
        date: dayCount,
        events: events[dayCount - 1],
      });
    });
    weeks.push(tempWeek);
  });
  return (
    <div>
      {weeks.map(
        (
          week: Array<{ day: number; date: number; events: Array<EventProps> }>
        ) => {
          weekIndex += 1;
          return <WeekLine key={`week${weekIndex}`} week={week} />;
        }
      )}
    </div>
  );
}
