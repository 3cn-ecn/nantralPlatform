import axios from 'axios';

import { OrderingFields } from '#shared/api/orderingFields.types';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { EventPreview } from '../event.type';
import { adaptEventPreview } from '../infra/event.adapter';
import { EventDTO, EventPreviewDTO } from '../infra/event.dto';

type GetEventListParams = {
  group?: string[];
  fromDate?: Date;
  toDate?: Date;
  isMember?: boolean;
  isShotgun?: boolean;
  isBookmarked?: boolean;
  isParticipating?: boolean;
  isRegistrationOpen?: boolean;
  search?: string;
  ordering?: OrderingFields<EventDTO>;
  page?: number;
  pageSize?: number;
};

export async function getEventList(
  options: GetEventListParams = {}
): Promise<Page<EventPreview>> {
  const { data } = await axios.get<PageDTO<EventPreviewDTO>>(
    '/api/event/event/',
    {
      params: {
        group: options.group,
        from_date: options.fromDate,
        to_date: options.toDate,
        is_member: options.isMember,
        is_shotgun: options.isShotgun,
        is_bookmarked: options.isBookmarked,
        is_participating: options.isParticipating,
        is_registration_open: options.isRegistrationOpen,
        search: options.search,
        ordering: options.ordering?.join(','),
        page: options.page,
        page_size: options.pageSize,
      },
    }
  );

  return adaptPage(data, adaptEventPreview);
}
