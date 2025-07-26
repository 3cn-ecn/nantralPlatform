import axios from 'axios';

import { MapGroupPoint } from '#modules/group/types/group.types';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export interface GetGroupListApiParams {
  type?: string | null;
  archived?: boolean | null;
}

export async function getMapGroupListPreviewApi(
  options: GetGroupListApiParams,
): Promise<MapGroupPoint[]> {
  const { data } = await axios
    .get<MapGroupPoint[]>('/api/group/group/', {
      params: {
        map: true,
        type: options.type,
        archived: options.archived,
        format: 'points',
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return data;
}
