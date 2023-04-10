import axios from 'axios';
import {
  EventProps,
  eventToCamelCase,
  eventsToCamelCase,
} from '../Props/Event';

export async function getEvents(options?: {
  orderBy?: string[] | string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}): Promise<EventProps[]> {
  const { data } = await axios.get('/api/event/', {
    params: {
      from_date: options?.fromDate,
      to_date: options?.toDate,
      order_by: Array.isArray(options?.orderBy)
        ? options?.orderBy?.join(',')
        : options?.orderBy,
      limit: options?.limit,
    },
  });
  eventsToCamelCase(data.results);
  return data.results;
}

export async function getEvent(id: number): Promise<EventProps> {
  const { data } = await axios.get(`/api/event/${id}/`);
  eventToCamelCase(data);
  return data;
}
