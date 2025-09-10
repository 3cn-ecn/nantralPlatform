import axios from 'axios';

import { MapGroupPoint } from '#modules/group/types/group.types';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

export interface GetGroupListApiParams {
  type?: string | null;
  archived?: boolean | null;
  page?: number;
  pageSize?: number;
}

export async function getMapGroupListPreviewApi(
  options: GetGroupListApiParams,
): Promise<Page<MapGroupPoint>> {
  const { data } = await axios
    .get<PageDTO<MapGroupPoint>>('/api/group/group/', {
      params: {
        map: true,
        type: options.type,
        archived: options.archived,
        format: 'points',
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, (dto) => dto);
}
