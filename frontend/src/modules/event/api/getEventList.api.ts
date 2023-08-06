import axios, { GenericAbortSignal } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { OrderingField } from '#shared/infra/orderingFields.types';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { EventPreview } from '../event.type';
import { adaptEventPreview } from '../infra/event.adapter';
import { EventDTO, EventPreviewDTO } from '../infra/event.dto';

export type EventListQueryParams = {
  group?: string[] | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  isMember?: boolean | null;
  isShotgun?: boolean | null;
  isBookmarked?: boolean | null;
  isParticipating?: boolean | null;
  isRegistrationOpen?: boolean | null;
  search?: string | null;
  ordering?: OrderingField<EventDTO> | null;
  page?: number | null;
  pageSize?: number | null;
};

export async function getEventListApi(
  params: EventListQueryParams = {},
  signal?: GenericAbortSignal
): Promise<Page<EventPreview>> {
  const { data } = await axios
    .get<PageDTO<EventPreviewDTO>>('/api/event/event/', {
      params: {
        group: params.group,
        from_date: params.fromDate,
        to_date: params.toDate,
        is_member: params.isMember,
        is_shotgun: params.isShotgun,
        is_bookmarked: params.isBookmarked,
        is_participating: params.isParticipating,
        is_registration_open: params.isRegistrationOpen,
        search: params.search,
        ordering: params.ordering,
        page: params.page,
        page_size: params.pageSize,
      },
      signal: signal,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptEventPreview);
}
