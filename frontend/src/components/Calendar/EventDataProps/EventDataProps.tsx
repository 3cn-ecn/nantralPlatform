export interface EventDataProps {
  key: number; // The index of the event which this object refects to in the events list.
  beginDate: Date; // The start date of the event.
  endDate: Date; // The end date of the event.
  blocked: boolean; // Wheter take part of a chain of simultaneous events which use all the horizontal space of a Day component.
  size: number; // Relative horizontal size of the event.
  sameTimeEvent: Array<number>; // List of simultaneous events.
  coupleEvents: Array<Array<number>>; // List of simultaneous events which have all a common area of time.
}
