import axios from 'axios';

import { ApiErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';
import { adaptPage } from '#shared/infra/pagination/page.adapter';
import { PageDTO } from '#shared/infra/pagination/page.dto';
import { Page } from '#shared/infra/pagination/page.types';

import { adaptSportEventDTO } from '../infra/sportevent.adapter';
import { SportEventDTO } from '../infra/sportevent.dto';
import { SportEvent } from '../sportevent.type';

export interface SportEventsQueryParameters {
  ordering?: string | null;
  search?: string | null;
  group?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  is_member?: boolean | null;
  isParticipating?: boolean | null;
  isNotParticipating?: boolean | null;
  page?: number | null;
  pageSize?: number | null;
}

export async function getSportEventsApi(
  params: SportEventsQueryParameters = {},
): Promise<Page<SportEvent>> {
  const { data } = await axios
    .get<PageDTO<SportEventDTO>>('/api/event/sport/', {
      params: {
        group: params.group,
        from_date: params.fromDate,
        to_date: params.toDate,
        is_member: params.is_member,
        is_participating: params.isParticipating,
        is_not_participating: params.isNotParticipating,
        ordering: params.ordering,
        search: params.search,
        page: params.page,
        page_size: params.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiFormErrors(err);
    });
  return adaptPage(data, adaptSportEventDTO);
}
