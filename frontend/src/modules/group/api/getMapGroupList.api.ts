import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

import { adaptMapGroupSearch } from '../infra/group.adapter';
import { MapGroupSearchDTO } from '../infra/group.dto';
import { MapGroupSearch } from '../types/group.types';

export interface GetGroupListApiParams {
  type?: string | null;
  archived?: boolean | null;
  search?: string | null;
  page?: number | null;
  pageSize?: number | null;
}

export async function getMapGroupListApi(
  options: GetGroupListApiParams,
): Promise<Page<MapGroupSearch>> {
  const { data } = await axios
    .get<PageDTO<MapGroupSearchDTO>>('/api/group/group/', {
      params: {
        map: true,
        type: options.type,
        archived: options.archived,
        search: options.search,
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptMapGroupSearch);
}
