import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

import { adaptMapGroupPreview } from '../infra/group.adapter';
import { MapGroupPreviewDTO } from '../infra/group.dto';
import { MapGroupPreview } from '../types/group.types';

export interface GetGroupListApiParams {
  type?: string | null;
  archived?: boolean | null;
  search?: string | null;
  page?: number | null;
  pageSize?: number | null;
}

export async function getMapGroupListApi(
  options: GetGroupListApiParams,
): Promise<Page<MapGroupPreview>> {
  const { data } = await axios
    .get<PageDTO<MapGroupPreviewDTO>>('/api/group/group/', {
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

  return adaptPage(data, adaptMapGroupPreview);
}
