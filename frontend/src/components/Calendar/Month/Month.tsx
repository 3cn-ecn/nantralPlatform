import React from 'react';
import { EventProps } from '../../../Props/Event';
import { WeekLine } from './WeekLine/WeekLine';

export function Month(props: {
  monthData: Array<Array<any>>;
  events: Array<Array<EventProps>>;
}) {
  const { monthData, events } = props;
  console.log(monthData);
  console.log(events);
  return (
    <div>
      {/* {monthData.map(
        (week: Array<{ date: number; events: Array<EventProps> }>) => {
          return <WeekLine week={week} />;
        }
      )} */}
      oui
    </div>
  );
}
