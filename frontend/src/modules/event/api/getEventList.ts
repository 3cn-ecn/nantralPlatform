import axios from 'axios';

import { Page } from '#types/Group';

import { EventPreview } from '../event.type';
import { adaptEventPreview } from '../infra/event.adapter';
import { EventPreviewDTO } from '../infra/event.dto';

type GetEventListParams = {
  orderBy?: string[] | string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
  isShotgun?: boolean;
  isFavorite?: boolean;
  minParticipants?: number;
  maxParticipants?: number;
  isMember?: boolean;
  isForm?: boolean;
  isParticipating?: boolean;
  publicity?: 'Mem' | 'Pub';
  registration?: 'open' | 'closed';
  group?: string | string[];
};

export async function getEvents(
  options: GetEventListParams = {}
): Promise<Page<EventPreview>> {
  const { data } = await axios.get<Page<EventPreviewDTO>>('/api/event/', {
    params: {
      from_date: options.fromDate,
      to_date: options.toDate,
      order_by: options.orderBy,
      limit: options.limit,
      offset: options.offset,
      is_shotgun: options.isShotgun || undefined,
      is_favorite: options.isFavorite || undefined,
      min_participants: options.minParticipants,
      max_participants: options.maxParticipants,
      is_member: options.isMember || undefined,
      is_form: options.isForm || undefined,
      is_participating: options.isParticipating || undefined,
      publicity: options.publicity,
      registration: options.registration,
      group: options.group,
    },
  });

  const events = data.results.map((event) => adaptEventPreview(event));

  return {
    results: events,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
}
