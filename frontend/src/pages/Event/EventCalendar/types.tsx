import { EventPreview } from '#modules/event/event.type';

export type CalendarEventItem = {
  data: EventPreview;
  start: Date;
  end: Date;
  col: number;
  nbTotCols: number;
};

export type CalendarViewMode = 'month' | 'days';
