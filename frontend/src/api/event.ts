import axios from 'axios';
import { isArray } from 'lodash-es';
import {
  EventProps,
  eventToCamelCase,
  eventsToCamelCase,
} from '../Props/Event';
import { Page } from '../Props/pagination';

export async function getEvents(
  options: {
    orderBy?: string[] | string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  } = {}
) {
  return axios
    .get<Page<EventProps>>('/api/event/', {
      params: {
        from_date: options.fromDate,
        to_date: options.toDate,
        order_by: isArray(options.orderBy)
          ? options.orderBy.join(',')
          : options.orderBy,
        limit: options.limit,
      },
    })
    .then((res) => eventsToCamelCase(res.data.results));
}

export async function getEvent(id: number): Promise<EventProps> {
  const { data } = await axios.get(`/api/event/${id}/`);
  eventToCamelCase(data);
  return data;
}
