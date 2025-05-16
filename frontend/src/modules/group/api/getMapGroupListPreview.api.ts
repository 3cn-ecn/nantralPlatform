import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

import { FeatureCollection } from '../types/geojson.type';

export interface GetGroupListApiParams {
  type?: string | null;
  archived?: boolean | null;
}

export async function getMapGroupListPreviewApi(
  options: GetGroupListApiParams,
): Promise<FeatureCollection> {
  const { data } = await axios
    .get<FeatureCollection>('/api/group/group/', {
      params: {
        map: true,
        type: options.type,
        archived: options.archived,
      },
      headers: {
        Accept: 'application/geo+json',
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return data;
}
